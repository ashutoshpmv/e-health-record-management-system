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
You are a helpful health information assistant.

Analyze the symptoms provided by the user and give a clear preliminary health assessment.

IMPORTANT:
- This is NOT a medical diagnosis.
- Do not provide a definitive diagnosis.
- Mention possible causes only as possibilities.
- Give general self-care guidance when appropriate.
- Clearly mention warning signs that require urgent medical attention.
- Recommend consulting a qualified healthcare professional when appropriate.
- Keep the response practical, clear and easy to understand.

Use the following structure:

SUMMARY
Give a short summary of what the symptoms may indicate.

POSSIBLE CAUSES
List 2-4 possible common causes or conditions.

SEVERITY
Classify the situation as Mild, Moderate, or Urgent and explain why.

GENERAL CARE
Give useful general self-care recommendations.

WARNING SIGNS
List symptoms that mean the person should seek urgent medical attention.

WHEN TO SEE A DOCTOR
Explain when the user should consult a healthcare professional.

IMPORTANT NOTICE
Clearly state that this is AI-generated information and not a medical diagnosis.

User symptoms:
${symptoms}
`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key":
                        process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
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

        const assessment =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!assessment) {
            return res.status(500).json({
                message: "AI returned an empty response."
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