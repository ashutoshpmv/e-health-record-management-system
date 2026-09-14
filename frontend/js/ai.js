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

    aiForm.addEventListener(
        "submit",
        async (event) => {

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


            message.className =
                "message";

            message.textContent =
                "Generating your preliminary health assessment...";

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


                resultContainer.innerHTML =
                    createAssessmentHTML(
                        data.assessment
                    );


            } catch (error) {

                message.className =
                    "message error";

                message.textContent =
                    error.message;
            }
        }
    );
}


/*
    Create the complete assessment UI
*/

function createAssessmentHTML(
    assessment
) {

    const severityClass =
        getSeverityClass(
            assessment.severity
        );


    return `

        <div class="ai-assessment">

            <!-- Header -->

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


            <!-- Summary -->

            <div class="ai-section">

                <div class="ai-section-title">
                    <span class="section-icon">
                        🩺
                    </span>

                    <h3>
                        Health Summary
                    </h3>
                </div>

                <p class="ai-summary">
                    ${escapeHTML(
                        assessment.summary
                    )}
                </p>

            </div>


            <!-- Possible Causes -->

            <div class="ai-section">

                <div class="ai-section-title">

                    <span class="section-icon">
                        🔎
                    </span>

                    <h3>
                        Possible Causes
                    </h3>

                </div>


                <div class="ai-list">

                    ${createList(
                        assessment.possibleCauses
                    )}

                </div>

            </div>


            <!-- Severity -->

            <div class="ai-section">

                <div class="ai-section-title">

                    <span class="section-icon">
                        📊
                    </span>

                    <h3>
                        Severity
                    </h3>

                </div>


                <div class="severity-row">

                    <span
                        class="severity-badge ${severityClass}"
                    >
                        ${escapeHTML(
                            assessment.severity
                        )}
                    </span>

                    <span class="severity-text">

                        ${escapeHTML(
                            assessment.severityExplanation
                        )}

                    </span>

                </div>

            </div>


            <!-- General Care -->

            <div class="ai-section">

                <div class="ai-section-title">

                    <span class="section-icon">
                        💡
                    </span>

                    <h3>
                        General Care
                    </h3>

                </div>


                <div class="ai-list">

                    ${createList(
                        assessment.generalCare
                    )}

                </div>

            </div>


            <!-- Warning Signs -->

            <div class="ai-section warning-section">

                <div class="ai-section-title">

                    <span class="section-icon">
                        ⚠️
                    </span>

                    <h3>
                        Warning Signs
                    </h3>

                </div>


                <p class="warning-intro">
                    Seek prompt medical attention if you
                    experience any of the following:
                </p>


                <div class="ai-list warning-list">

                    ${createList(
                        assessment.warningSigns
                    )}

                </div>

            </div>


            <!-- Doctor -->

            <div class="ai-section doctor-section">

                <div class="ai-section-title">

                    <span class="section-icon">
                        👨‍⚕️
                    </span>

                    <h3>
                        When to See a Doctor
                    </h3>

                </div>


                <p>
                    ${escapeHTML(
                        assessment.whenToSeeDoctor
                    )}
                </p>

            </div>


            <!-- Disclaimer -->

            <div class="ai-disclaimer">

                <strong>
                    ⚠️ Important Notice
                </strong>

                <p>
                    ${escapeHTML(
                        assessment.disclaimer
                    )}
                </p>

            </div>

        </div>
    `;
}


/*
    Convert arrays into bullet lists
*/

function createList(items) {

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        return `
            <p>
                No specific information available.
            </p>
        `;
    }


    return items
        .map(
            (item) => `
                <div class="ai-list-item">

                    <span class="bullet">
                        •
                    </span>

                    <span>
                        ${escapeHTML(item)}
                    </span>

                </div>
            `
        )
        .join("");
}


/*
    Severity badge styling
*/

function getSeverityClass(
    severity
) {

    switch (
        String(severity).toLowerCase()
    ) {

        case "mild":
            return "severity-mild";

        case "moderate":
            return "severity-moderate";

        case "urgent":
            return "severity-urgent";

        default:
            return "severity-moderate";
    }
}


/*
    Prevent HTML injection from AI output
*/

function escapeHTML(value) {

    if (
        value === undefined ||
        value === null
    ) {
        return "";
    }


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

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            window.location.href =
                "login.html";
        }
    );
}