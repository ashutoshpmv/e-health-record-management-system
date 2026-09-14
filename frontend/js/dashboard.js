// ==========================================
// CHECK LOGIN
// ==========================================

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

if (!token || !storedUser) {
    window.location.href = "login.html";
}


// ==========================================
// LOAD USER
// ==========================================

const user = JSON.parse(storedUser);


// ==========================================
// DISPLAY USER INFORMATION
// ==========================================

const userNameElement =
    document.getElementById("userName");

const userRoleElement =
    document.getElementById("userRole");

if (userNameElement) {
    userNameElement.textContent = user.name;
}

if (userRoleElement) {
    userRoleElement.textContent =
        user.role.charAt(0).toUpperCase() +
        user.role.slice(1);
}


// ==========================================
// LOAD PROFILE
// ==========================================

const loadProfile = async () => {
    try {
        const data =
            await apiRequest("/users/profile");

        const profile = data.user;

        if (document.getElementById("profileName")) {
            document.getElementById("profileName")
                .textContent =
                profile.name || "Not provided";
        }

        if (document.getElementById("profileEmail")) {
            document.getElementById("profileEmail")
                .textContent =
                profile.email || "Not provided";
        }

        if (document.getElementById("profilePhone")) {
            document.getElementById("profilePhone")
                .textContent =
                profile.phone || "Not provided";
        }

        if (document.getElementById("profileBloodGroup")) {
            document.getElementById("profileBloodGroup")
                .textContent =
                profile.bloodGroup || "Not provided";
        }

    } catch (error) {
        console.error(
            "Profile loading failed:",
            error.message
        );
    }
};


// ==========================================
// LOAD RECORD COUNT
// ==========================================

const loadRecordCount = async () => {
    try {
        const data =
            await apiRequest("/records");

        const recordCount =
            document.getElementById("recordCount");

        if (recordCount) {
            recordCount.textContent =
                data.count;
        }

    } catch (error) {
        console.error(
            "Record loading failed:",
            error.message
        );
    }
};


// ==========================================
// LOGOUT
// ==========================================

const logoutButton =
    document.getElementById("logoutButton");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "login.html";
        }
    );
}


// ==========================================
// INITIALIZE
// ==========================================

loadProfile();
loadRecordCount();