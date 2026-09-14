// ==========================================
// CHECK LOGIN
// ==========================================

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}


// ==========================================
// ELEMENTS
// ==========================================

const profileForm =
    document.getElementById("profileForm");

const message =
    document.getElementById("message");

const logoutButton =
    document.getElementById("logoutButton");


// ==========================================
// LOAD PROFILE
// ==========================================

const loadProfile = async () => {

    try {

        const data =
            await apiRequest("/users/profile");

        const user = data.user;

        document.getElementById("name").value =
            user.name || "";

        document.getElementById("email").value =
            user.email || "";

        if (user.dateOfBirth) {

            document.getElementById("dateOfBirth").value =
                new Date(user.dateOfBirth)
                    .toISOString()
                    .split("T")[0];
        }

        document.getElementById("gender").value =
            user.gender || "";

        document.getElementById("phone").value =
            user.phone || "";

        document.getElementById("bloodGroup").value =
            user.bloodGroup || "";

        document.getElementById("allergies").value =
            user.allergies || "";

        if (user.emergencyContact) {

            document.getElementById("emergencyName").value =
                user.emergencyContact.name || "";

            document.getElementById("emergencyPhone").value =
                user.emergencyContact.phone || "";

            document.getElementById("emergencyRelationship").value =
                user.emergencyContact.relationship || "";
        }

        // Update localStorage user
        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        // Dashboard based on role
        const dashboardLink =
            document.getElementById("dashboardLink");

        if (user.role === "doctor") {

            dashboardLink.href =
                "doctor-dashboard.html";

        } else {

            dashboardLink.href =
                "patient-dashboard.html";
        }

    } catch (error) {

        message.className =
            "message error";

        message.textContent =
            error.message;
    }
};


// ==========================================
// UPDATE PROFILE
// ==========================================

profileForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        try {

            const updatedData = {

                name:
                    document.getElementById("name")
                        .value
                        .trim(),

                dateOfBirth:
                    document.getElementById("dateOfBirth")
                        .value,

                gender:
                    document.getElementById("gender")
                        .value,

                phone:
                    document.getElementById("phone")
                        .value
                        .trim(),

                bloodGroup:
                    document.getElementById("bloodGroup")
                        .value,

                allergies:
                    document.getElementById("allergies")
                        .value
                        .trim(),

                emergencyContact: {

                    name:
                        document.getElementById(
                            "emergencyName"
                        ).value.trim(),

                    phone:
                        document.getElementById(
                            "emergencyPhone"
                        ).value.trim(),

                    relationship:
                        document.getElementById(
                            "emergencyRelationship"
                        ).value.trim()
                }
            };


            const data =
                await apiRequest(
                    "/users/profile",
                    {
                        method: "PUT",

                        body:
                            JSON.stringify(updatedData)
                    }
                );


            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            message.className =
                "message success";

            message.textContent =
                "Profile updated successfully.";

        } catch (error) {

            message.className =
                "message error";

            message.textContent =
                error.message;
        }
    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href =
            "login.html";
    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

loadProfile();