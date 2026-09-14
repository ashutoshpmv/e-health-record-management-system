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
You are a health information assistant.

Analyze the symptoms provided by the user and give a preliminary health assessment.

IMPORTANT:
- Do NOT provide a definitive medical diagnosis.
- Clearly state that the response is informational only.
- Mention possible common conditions or causes only as possibilities.
- Provide general self-care guidance when appropriate.
- Mention warning signs that require medical attention.
- Recommend consulting a qualified healthcare professional when appropriate.
- Keep the response clear and easy to understand.

User symptoms:
${symptoms}
`;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/interactions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
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

        let assessment = "";

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
                            assessment += content.text;
                        }
                    }
                }
            }
        }

        if (!assessment) {
            return res.status(500).json({
                message: "AI returned an empty response."
            });
        }

        res.status(200).json({
            assessment
        });

    } catch (error) {
        console.error("AI assessment error:", error);

        res.status(500).json({
            message:
                "Server error while generating AI assessment."
        });
    }
};

module.exports = {
    assessHealth
};