// ==========================================
// AUTH CHECK
// ==========================================

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

if (!token || !storedUser) {

    window.location.href = "login.html";
}

const user = JSON.parse(storedUser);


// ==========================================
// ELEMENTS
// ==========================================

const recordsContainer =
    document.getElementById("recordsContainer");

const addRecordSection =
    document.getElementById("addRecordSection");

const editRecordSection =
    document.getElementById("editRecordSection");

const recordForm =
    document.getElementById("recordForm");

const editRecordForm =
    document.getElementById("editRecordForm");

const recordMessage =
    document.getElementById("recordMessage");

const editMessage =
    document.getElementById("editMessage");

const patientSelect =
    document.getElementById("patientId");

const dashboardLink =
    document.getElementById("dashboardLink");

const pageDescription =
    document.getElementById("pageDescription");

const logoutButton =
    document.getElementById("logoutButton");

const cancelEditButton =
    document.getElementById("cancelEditButton");


// Currently editing record
let editingRecordId = null;


// ==========================================
// DASHBOARD LINK
// ==========================================

if (user.role === "doctor") {

    dashboardLink.href =
        "doctor-dashboard.html";

    pageDescription.textContent =
        "Create and manage medical records.";

} else {

    dashboardLink.href =
        "patient-dashboard.html";

    pageDescription.textContent =
        "View your medical history.";
}


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
// LOAD PATIENTS
// ==========================================

const loadPatients = async () => {

    try {

        const data =
            await apiRequest("/users/patients");


        patientSelect.innerHTML =
            `<option value="">
                Select a patient
            </option>`;


        if (data.patients.length === 0) {

            patientSelect.innerHTML =
                `<option value="">
                    No patients registered
                </option>`;

            return;
        }


        data.patients.forEach(
            (patient) => {

                const option =
                    document.createElement("option");

                option.value =
                    patient._id;

                option.textContent =
                    `${patient.name} (${patient.email})`;

                patientSelect.appendChild(option);
            }
        );

    } catch (error) {

        patientSelect.innerHTML =
            `<option value="">
                Unable to load patients
            </option>`;

        console.error(
            "Patient loading error:",
            error.message
        );
    }
};


// ==========================================
// LOAD RECORDS
// ==========================================

const loadRecords = async () => {

    try {

        const data =
            await apiRequest("/records");


        recordsContainer.innerHTML = "";


        if (data.records.length === 0) {

            recordsContainer.innerHTML = `

                <div class="card">

                    <h3>
                        No Medical Records
                    </h3>

                    <p>
                        No medical records are
                        available yet.
                    </p>

                </div>

            `;

            return;
        }


        data.records.forEach(
            (record) => {

                const card =
                    document.createElement("div");

                card.className = "card";

                card.style.marginBottom = "20px";


                const visitDate =
                    record.visitDate
                        ? new Date(
                            record.visitDate
                        ).toLocaleDateString()
                        : "Not provided";


                const patientName =
                    record.patient
                        ? record.patient.name
                        : "Unknown";


                const doctorName =
                    record.doctor
                        ? record.doctor.name
                        : "Unknown";


                // Main content

                card.innerHTML = `

                    <h3>
                        Medical Visit
                    </h3>

                    <p>
                        <strong>Patient:</strong>
                        ${patientName}
                    </p>

                    <p>
                        <strong>Doctor:</strong>
                        ${doctorName}
                    </p>

                    <p>
                        <strong>Visit Date:</strong>
                        ${visitDate}
                    </p>

                    <hr style="margin: 18px 0;">


                    <p>
                        <strong>Symptoms:</strong>
                    </p>

                    <p>
                        ${record.symptoms || "Not provided"}
                    </p>


                    <p style="margin-top: 12px;">
                        <strong>Diagnosis:</strong>
                    </p>

                    <p>
                        ${record.diagnosis || "Not provided"}
                    </p>


                    <p style="margin-top: 12px;">
                        <strong>Medications:</strong>
                    </p>

                    <p>
                        ${record.medications || "Not provided"}
                    </p>


                    <p style="margin-top: 12px;">
                        <strong>Doctor Notes:</strong>
                    </p>

                    <p>
                        ${record.notes || "Not provided"}
                    </p>

                `;


                // ==================================
                // DOCTOR BUTTONS
                // ==================================

                if (user.role === "doctor") {

                    const buttonContainer =
                        document.createElement("div");

                    buttonContainer.style.marginTop =
                        "20px";


                    // EDIT BUTTON

                    const editButton =
                        document.createElement("button");

                    editButton.className =
                        "btn";

                    editButton.textContent =
                        "Edit";

                    editButton.type =
                        "button";


                    editButton.addEventListener(
                        "click",
                        () => {

                            openEditForm(record);
                        }
                    );


                    // DELETE BUTTON

                    const deleteButton =
                        document.createElement("button");

                    deleteButton.className =
                        "btn btn-secondary";

                    deleteButton.textContent =
                        "Delete";

                    deleteButton.type =
                        "button";

                    deleteButton.style.marginLeft =
                        "10px";


                    deleteButton.addEventListener(
                        "click",
                        () => {

                            deleteRecord(
                                record._id
                            );
                        }
                    );


                    buttonContainer.appendChild(
                        editButton
                    );

                    buttonContainer.appendChild(
                        deleteButton
                    );

                    card.appendChild(
                        buttonContainer
                    );
                }


                recordsContainer.appendChild(card);
            }
        );

    } catch (error) {

        recordsContainer.innerHTML = `

            <div class="card">

                <h3>
                    Error
                </h3>

                <p>
                    ${error.message}
                </p>

            </div>

        `;
    }
};


// ==========================================
// OPEN EDIT FORM
// ==========================================

const openEditForm = (record) => {

    editingRecordId =
        record._id;


    document.getElementById(
        "editSymptoms"
    ).value =
        record.symptoms || "";


    document.getElementById(
        "editDiagnosis"
    ).value =
        record.diagnosis || "";


    document.getElementById(
        "editMedications"
    ).value =
        record.medications || "";


    document.getElementById(
        "editNotes"
    ).value =
        record.notes || "";


    if (record.visitDate) {

        document.getElementById(
            "editVisitDate"
        ).value =
            new Date(record.visitDate)
                .toISOString()
                .split("T")[0];
    }


    editMessage.className =
        "message";


    editMessage.textContent = "";


    editRecordSection.style.display =
        "block";


    // Scroll to edit form

    editRecordSection.scrollIntoView({
        behavior: "smooth"
    });
};


// ==========================================
// UPDATE RECORD
// ==========================================

editRecordForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!editingRecordId) {
            return;
        }


        try {

            const updatedData = {

                symptoms:
                    document.getElementById(
                        "editSymptoms"
                    ).value.trim(),

                diagnosis:
                    document.getElementById(
                        "editDiagnosis"
                    ).value.trim(),

                medications:
                    document.getElementById(
                        "editMedications"
                    ).value.trim(),

                notes:
                    document.getElementById(
                        "editNotes"
                    ).value.trim(),

                visitDate:
                    document.getElementById(
                        "editVisitDate"
                    ).value
            };


            await apiRequest(
                `/records/${editingRecordId}`,
                {
                    method: "PUT",

                    body:
                        JSON.stringify(updatedData)
                }
            );


            editMessage.className =
                "message success";

            editMessage.textContent =
                "Medical record updated successfully.";


            editingRecordId = null;


            setTimeout(
                () => {

                    editRecordSection.style.display =
                        "none";

                },
                800
            );


            await loadRecords();

        } catch (error) {

            editMessage.className =
                "message error";

            editMessage.textContent =
                error.message;
        }
    }
);


// ==========================================
// CANCEL EDIT
// ==========================================

cancelEditButton.addEventListener(
    "click",
    () => {

        editingRecordId = null;

        editRecordForm.reset();

        editRecordSection.style.display =
            "none";
    }
);


// ==========================================
// DELETE RECORD
// ==========================================

const deleteRecord = async (recordId) => {

    const confirmed =
        confirm(
            "Are you sure you want to delete this medical record?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `/records/${recordId}`,
            {
                method: "DELETE"
            }
        );


        alert(
            "Medical record deleted successfully."
        );


        await loadRecords();

    } catch (error) {

        alert(
            error.message
        );
    }
};


// ==========================================
// CREATE RECORD
// ==========================================

if (user.role === "doctor") {

    addRecordSection.style.display =
        "block";


    loadPatients();


    recordForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            try {

                const recordData = {

                    patientId:
                        patientSelect.value,

                    symptoms:
                        document.getElementById(
                            "symptoms"
                        ).value.trim(),

                    diagnosis:
                        document.getElementById(
                            "diagnosis"
                        ).value.trim(),

                    medications:
                        document.getElementById(
                            "medications"
                        ).value.trim(),

                    notes:
                        document.getElementById(
                            "notes"
                        ).value.trim(),

                    visitDate:
                        document.getElementById(
                            "visitDate"
                        ).value
                };


                await apiRequest(
                    "/records",
                    {
                        method: "POST",

                        body:
                            JSON.stringify(
                                recordData
                            )
                    }
                );


                recordMessage.className =
                    "message success";

                recordMessage.textContent =
                    "Medical record created successfully.";


                recordForm.reset();


                await loadRecords();

            } catch (error) {

                recordMessage.className =
                    "message error";

                recordMessage.textContent =
                    error.message;
            }
        }
    );
}


// ==========================================
// INITIAL LOAD
// ==========================================

loadRecords();