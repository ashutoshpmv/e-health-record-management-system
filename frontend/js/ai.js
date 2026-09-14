const aiForm = document.getElementById("aiForm");
const resultContainer = document.getElementById("result");
const message = document.getElementById("message");

const token = localStorage.getItem("token");
const user = JSON.parse(
    localStorage.getItem("user") || "null"
);

if (!token || !user) {
    window.location.href = "login.html";
}

if (aiForm) {
    aiForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const symptoms = document
            .getElementById("symptoms")
            .value
            .trim();

        if (!symptoms) {
            message.className = "message error";
            message.textContent =
                "Please describe your symptoms.";
            return;
        }

        message.className = "message";
        message.textContent =
            "Generating preliminary assessment...";

        resultContainer.innerHTML = "";

        try {
            const data = await apiRequest(
                "/ai/assessment",
                {
                    method: "POST",
                    body: JSON.stringify({
                        symptoms
                    })
                }
            );

            message.className =
                "message success";

            message.textContent =
                "Assessment generated successfully.";

            resultContainer.innerHTML = `
                <div class="ai-assessment">

                    <div class="ai-header">

                        <div class="ai-header-icon">
                            ✨
                        </div>

                        <div>
                            <h2>
                                AI Preliminary Health Assessment
                            </h2>

                            <p>
                                AI-generated informational assessment
                            </p>
                        </div>

                    </div>

                    <div class="ai-result-content">
                        ${formatAssessment(
                            data.assessment
                        )}
                    </div>

                    <div class="ai-disclaimer">

                        <strong>
                            ⚠️ Important Notice
                        </strong>

                        <p>
                            This AI-generated assessment is
                            for informational purposes only
                            and is not a medical diagnosis.
                            It should not replace advice from
                            a qualified healthcare professional.
                        </p>

                    </div>

                </div>
            `;

        } catch (error) {

            message.className =
                "message error";

            message.textContent =
                error.message;
        }
    });
}


/*
    Format Gemini's text response
*/

function formatAssessment(text) {

    if (typeof text !== "string") {
        return `
            <p>
                Unable to display the AI response.
            </p>
        `;
    }

    let html = escapeHTML(text);

    /*
        Convert section headings
    */

    const headings = [
        ["SUMMARY", "🩺"],
        ["POSSIBLE CAUSES", "🔎"],
        ["SEVERITY", "📊"],
        ["GENERAL CARE", "💡"],
        ["WARNING SIGNS", "⚠️"],
        ["WHEN TO SEE A DOCTOR", "👨‍⚕️"],
        ["IMPORTANT NOTICE", "📌"]
    ];

    headings.forEach(
        ([heading, icon]) => {

            const regex =
                new RegExp(
                    `(^|\\n)\\s*${heading}\\s*:?`,
                    "gi"
                );

            html = html.replace(
                regex,
                `$1<div class="ai-heading">
                    <span>${icon}</span>
                    <strong>${heading}</strong>
                </div>`
            );
        }
    );


    /*
        Convert bullet points
    */

    html = html.replace(
        /(^|\n)\s*[-•*]\s+(.+)/g,
        `$1<div class="ai-list-item">
            <span class="bullet">•</span>
            <span>$2</span>
        </div>`
    );


    /*
        Convert line breaks
    */

    html = html.replace(
        /\n/g,
        "<br>"
    );


    return html;
}


/*
    Prevent HTML injection
*/

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/*
    Logout
*/

const logout =
    document.getElementById("logout");

if (logout) {

    logout.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "login.html";
        }
    );
}