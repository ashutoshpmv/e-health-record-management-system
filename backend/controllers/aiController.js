const assessHealth = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || !symptoms.trim()) {
            return res.status(400).json({
                message: "Please provide your symptoms."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({
                message: "Gemini API key is not configured."
            });
        }

        const model =
            process.env.GEMINI_MODEL || "gemini-3.6-flash";

        const prompt = `
You are a professional health information assistant.

Analyze the user's symptoms and provide a preliminary health assessment.

This is an educational and informational tool, NOT a medical diagnosis.

Return ONLY valid JSON using exactly this structure:

{
    "summary": "A short, clear summary of the symptoms.",
    "possibleCauses": [
        "Possible cause 1",
        "Possible cause 2",
        "Possible cause 3"
    ],
    "severity": "Mild",
    "severityExplanation": "Short explanation of why this severity level was selected.",
    "generalCare": [
        "General self-care recommendation 1",
        "General self-care recommendation 2",
        "General self-care recommendation 3"
    ],
    "warningSigns": [
        "Warning sign 1",
        "Warning sign 2"
    ],
    "whenToSeeDoctor": "Explain when the user should consult a healthcare professional.",
    "disclaimer": "This AI-generated assessment is for informational purposes only and is not a medical diagnosis."
}

Rules:

1. Never provide a definitive diagnosis.
2. Possible causes must be presented only as possibilities.
3. Severity must be exactly one of:
   - Mild
   - Moderate
   - Urgent
4. Do not prescribe prescription medication.
5. Do not recommend specific prescription drug dosages.
6. Provide only general self-care information.
7. Include important warning signs when relevant.
8. Recommend professional medical care when appropriate.
9. Keep the language simple and easy to understand.
10. Do not include Markdown.
11. Return ONLY the JSON object. Do not add any text before or after the JSON.

User symptoms:
${symptoms}
`;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key":
                        process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    model: model,
                    input: prompt
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API error:", data);

            return res.status(500).json({
                message:
                    data?.error?.message ||
                    "Unable to get AI assessment."
            });
        }

        let text = "";

        if (Array.isArray(data.steps)) {
            for (const step of data.steps) {
                if (
                    step.type === "model_output" &&
                    Array.isArray(step.content)
                ) {
                    for (const content of step.content) {
                        if (
                            content.type === "text" &&
                            content.text
                        ) {
                            text += content.text;
                        }
                    }
                }
            }
        }

        if (!text) {
            return res.status(500).json({
                message: "AI returned an empty response."
            });
        }

        // Remove accidental markdown code fences
        text = text
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();

        let assessment;

        try {
            assessment = JSON.parse(text);
        } catch (error) {
            console.error(
                "Failed to parse AI JSON:",
                text
            );

            return res.status(500).json({
                message:
                    "AI returned an invalid assessment format."
            });
        }

        res.status(200).json({
            assessment
        });

    } catch (error) {
        console.error(
            "AI assessment error:",
            error
        );

        res.status(500).json({
            message:
                "Server error while generating AI assessment."
        });
    }
};

module.exports = {
    assessHealth
};