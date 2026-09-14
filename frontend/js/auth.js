// ==========================================
// REGISTER
// ==========================================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const message = document.getElementById("message");

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        try {
            const data = await apiRequest("/auth/register", {
                method: "POST",

                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role
                })
            });

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.className = "message success";

            message.textContent =
                "Registration successful! Redirecting...";

            setTimeout(() => {
                redirectToDashboard(data.user.role);
            }, 1000);

        } catch (error) {
            message.className = "message error";

            message.textContent = error.message;
        }
    });
}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const message = document.getElementById("message");

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;

        try {
            const data = await apiRequest("/auth/login", {
                method: "POST",

                body: JSON.stringify({
                    email,
                    password
                })
            });

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            message.className = "message success";

            message.textContent =
                "Login successful! Redirecting...";

            setTimeout(() => {
                redirectToDashboard(data.user.role);
            }, 700);

        } catch (error) {
            message.className = "message error";

            message.textContent = error.message;
        }
    });
}


// ==========================================
// DASHBOARD REDIRECT
// ==========================================

const redirectToDashboard = (role) => {

    if (role === "doctor") {

        window.location.href =
            "doctor-dashboard.html";

    } else {

        window.location.href =
            "patient-dashboard.html";
    }
};