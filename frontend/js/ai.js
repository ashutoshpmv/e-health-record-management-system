const aiForm = document.getElementById("aiForm");
const resultContainer = document.getElementById("result");
const message = document.getElementById("message");

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "null");

if (!token || !user) {
    window.location.href = "login.html";
}

if (aiForm) {
    aiForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const symptoms =
            document.getElementById("symptoms").value.trim();

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

            message.className = "message success";
            message.textContent =
                "Assessment generated successfully.";

            resultContainer.innerHTML = `
                <div class="card">
                    <h2>Preliminary Health Assessment</h2>
                    <div class="ai-result">
                        ${formatAssessment(data.assessment)}
                    </div>

                    <p class="warning">
                        ⚠️ This AI-generated assessment is for
                        informational purposes only and is not a
                        medical diagnosis. Consult a qualified
                        healthcare professional for medical advice.
                    </p>
                </div>
            `;

        } catch (error) {
            message.className = "message error";
            message.textContent = error.message;
        }
    });
}

function formatAssessment(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
}
const logout = document.getElementById("logout");

if (logout) {
    logout.addEventListener("click", (event) => {

        event.preventDefault();

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "login.html";
    });
}