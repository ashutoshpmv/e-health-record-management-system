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

        const symptoms =
            document
                .getElementById("symptoms")
                .value
                .trim();

        if (!symptoms) {

            message.className =
                "message error";

            message.textContent =
                "Please describe your symptoms.";

            return;
        }


        message.className = "message";

        message.textContent =
            "Generating preliminary assessment...";

        resultContainer.innerHTML = "";


        try {

            const data =
                await apiRequest(
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
                            This AI-generated assessment is for
                            informational purposes only and is
                            not a medical diagnosis. It should
                            not replace advice from a qualified
                            healthcare professional.
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
    Format AI response
*/

function formatAssessment(text) {

    if (
        typeof text !== "string"
    ) {
        return `
            <p>
                Unable to format the AI response.
            </p>
        `;
    }


    let formatted =
        escapeHTML(text);


    const sections = [
        {
            title: "SUMMARY",
            icon: "🩺"
        },
        {
            title: "POSSIBLE CAUSES",
            icon: "🔎"
        },
        {
            title: "SEVERITY",
            icon: "📊"
        },
        {
            title: "GENERAL CARE",
            icon: "💡"
        },
        {
            title: "WARNING SIGNS",
            icon: "⚠️"
        },
        {
            title: "WHEN TO SEE A DOCTOR",
            icon: "👨‍⚕️"
        },
        {
            title: "IMPORTANT NOTICE",
            icon: "📌"
        }
    ];


    sections.forEach(
        (section) => {

            const regex =
                new RegExp(
                    section.title,
                    "gi"
                );

            formatted =
                formatted.replace(
                    regex,
                    `|||${section.icon} ${section.title}|||`
                );
        }
    );


    const parts =
        formatted.split("|||");


    let html = "";


    parts.forEach(
        (part) => {

            part = part.trim();

            if (!part) {
                return;
            }


            const matchingSection =
                sections.find(
                    (section) =>
                        part.startsWith(
                            `${section.icon} ${section.title}`
                        )
                );


            if (matchingSection) {

                const title =
                    `${matchingSection.icon} ${matchingSection.title}`;

                const content =
                    part
                        .substring(title.length)
                        .trim();


                html += `
                    <div class="ai-section">

                        <div class="ai-section-title">

                            <h3>
                                ${title}
                            </h3>

                        </div>

                        <div class="ai-section-content">

                            ${formatText(
                                content
                            )}

                        </div>

                    </div>
                `;

            } else {

                html += `
                    <div class="ai-section">

                        <div class="ai-section-content">

                            ${formatText(
                                part
                            )}

                        </div>

                    </div>
                `;
            }

        }
    );


    return html;
}


/*
    Format paragraphs and bullet points
*/

function formatText(text) {

    const lines =
        text
            .split("\n")
            .map(
                line => line.trim()
            )
            .filter(
                line => line.length > 0
            );


    let html = "";


    lines.forEach(
        (line) => {

            if (
                line.startsWith("- ") ||
                line.startsWith("• ")
            ) {

                const item =
                    line.substring(2);

                html += `
                    <div class="ai-list-item">

                        <span class="bullet">
                            •
                        </span>

                        <span>
                            ${item}
                        </span>

                    </div>
                `;

            } else {

                html += `
                    <p>
                        ${line}
                    </p>
                `;
            }

        }
    );


    return html;
}


/*
    Security:
    Escape HTML returned by AI
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