async function checkAdminAuth() {

    try {

        const response =
            await fetch(
                "/api/registrations",
                {
                    credentials:
                        "same-origin"
                }
            );

        if (response.status === 401) {

            window.location.href =
                "admin-login.html";

            return false;

        }

        return true;

    }

    catch {

        window.location.href =
            "admin-login.html";

        return false;

    }

}

checkAdminAuth();
const API_BASE_URL = window.API_BASE_URL || "";
let allRegistrations = [];


const eventSelect =
    document.getElementById(
        "eventSelect"
    );


const participantsTable =
    document.getElementById(
        "participantsTable"
    );


const winnerCards =
    document.getElementById(
        "winnerCards"
    );


// =================================
// LOAD ALL REGISTRATIONS
// =================================

async function loadRegistrations() {

    try {

        const response =
            await fetch(
                API_BASE_URL + "/api/registrations"
            );


        const result =
            await response.json();


        allRegistrations =
            result.data;


        displayRegistrations(
            allRegistrations
        );


        updateStatistics(
            allRegistrations
        );


        loadEvents(
            allRegistrations
        );

    }

    catch (error) {

        console.log(error);

        alert(
            "Unable to load registrations"
        );

    }

}


// =================================
// DISPLAY REGISTRATIONS
// =================================

function displayRegistrations(
    registrations
) {

    const table =
        document.getElementById(
            "registrationTable"
        );


    table.innerHTML = "";


    registrations.forEach(
        (student) => {

            table.innerHTML += `

                <tr>

                    <td>
                        ${student.name}
                    </td>

                    <td>
                        ${student.college}
                    </td>

                    <td>
                        ${student.events.join(", ")}
                    </td>
                    
                    <td>
                         ${student.food || "-"}
                    </td>

                    <td>
                        ${student.registrationCode}
                    </td>
<td>

    <select
        onchange="
            updateAttendance(
                '${student._id}',
                this.value
            )
        "
    >

        <option
            value="Absent"
            ${student.attendance === "Absent" ? "selected" : ""}
        >
            Absent
        </option>

        <option
            value="Present"
            ${student.attendance === "Present" ? "selected" : ""}
        >
            Present
        </option>

    </select>

</td>
                    <td>
                        ${student.payment}
                    </td>

                    <td>

                        <button
                            class="delete-btn"
                            onclick="
                                deleteStudent(
                                    '${student._id}'
                                )
                            "
                        >

                            DELETE

                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


// =================================
// STATISTICS
// =================================

function updateStatistics(
    registrations
) {

    document
        .getElementById(
            "totalStudents"
        )
        .innerText =
        registrations.length;


    const eventSet =
        new Set();


    registrations.forEach(
        (student) => {

            student.events.forEach(
                (event) => {

                    eventSet.add(
                        event
                    );

                }
            );

        }
    );


    document
        .getElementById(
            "totalEvents"
        )
        .innerText =
        eventSet.size;

}


/// =================================
// LOAD EVENTS
// =================================

function loadEvents() {

    const eventList = [
        "Perspecta",
        "Bitcrux",
        "Vizzard",
        "Mystery Mission",
        "Voice Clash",
        "Mind Track"
    ];

    eventSelect.innerHTML = `
        <option value="">
            Select Event
        </option>
    `;

    eventList.forEach((event) => {

        const option =
            document.createElement("option");

        option.value = event;
        option.textContent = event;

        eventSelect.appendChild(option);

    });

}

// =================================
// LOAD EVENT PARTICIPANTS
// =================================

document
    .getElementById(
        "loadParticipants"
    )
    .addEventListener(
        "click",
        async () => {

            const event =
                eventSelect.value;


            if (!event) {

                alert(
                    "Please select an event!"
                );

                return;

            }


            document
                .getElementById(
                    "scoreSection"
                )
                .classList
                .remove(
                    "hidden"
                );


            document
                .getElementById(
                    "selectedEventTitle"
                )
                .innerText =
                event;


            await loadParticipants(
                event
            );


            await loadWinners(
                event
            );

        }
    );


// =================================
// GET PARTICIPANTS
// =================================

async function loadParticipants(
    event
) {

    const response =
        await fetch(
            API_BASE_URL + "/api/event/" +
            encodeURIComponent(event)
        );


    const result =
        await response.json();


    participantsTable.innerHTML =
        "";


    result.data.forEach(
        (student) => {

            participantsTable.innerHTML += `

                <tr>

                    <td>
                        ${student.name}
                    </td>

                    <td>
                        ${student.college}
                    </td>

                    <td>
                        ${student.department}
                    </td>

                    <td>

                        <input
                            type="number"
                            class="score-input"
                            id="score-${student._id}"
                            value="${
                                student.score ?? ""
                            }"
                            placeholder="Score"
                        >

                    </td>

                    <td>

                        <button
                            class="save-btn"
                            onclick="
                                saveScore(
                                    '${student._id}',
                                    '${event}'
                                )
                            "
                        >

                            SAVE

                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


// =================================
// SAVE SCORE
// =================================

async function saveScore(
    studentId,
    event
) {

    const input =
        document.getElementById(
            "score-" +
            studentId
        );


    const score =
        input.value;


    if (
        score === ""
    ) {

        alert(
            "Please enter score!"
        );

        return;

    }


    const response =
        await fetch(
            API_BASE_URL + "/api/score",
            {

                method:
                    "PUT",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify({

                        studentId:

                            studentId,

                        event:

                            event,

                        score:

                            score

                    })

            }
        );


    const result =
        await response.json();


    if (
        result.success
    ) {

        alert(
            "Score saved successfully! 🎉"
        );


        await loadParticipants(
            event
        );


        await loadWinners(
            event
        );

    }

    else {

        alert(
            result.message
        );

    }

}


// =================================
// LOAD TOP 3 WINNERS
// =================================

async function loadWinners(
    event
) {

    const response =
        await fetch(
            API_BASE_URL + "/api/winners/" +
            encodeURIComponent(event)
        );


    const result =
        await response.json();


    document
        .getElementById(
            "winnerEvent"
        )
        .innerText =
        event;


    winnerCards.innerHTML =
        "";


    const medals = [

        "🥇 FIRST PLACE",

        "🥈 SECOND PLACE",

        "🥉 THIRD PLACE"

    ];


    if (
        result.winners.length === 0
    ) {

        winnerCards.innerHTML =
            "<p>No scores entered yet.</p>";

        return;

    }


    result.winners.forEach(
        (student, index) => {

            winnerCards.innerHTML += `

                <div class="winner-card">

                    <h2>
                        ${medals[index]}
                    </h2>

                    <h3>
                        ${student.name}
                    </h3>

                    <p>
                        ${student.college}
                    </p>

                    <p>
                        Score:
                        <b>
                            ${student.score}
                        </b>
                    </p>

                </div>

            `;

        }
    );

}


// =================================
// SEARCH
// =================================

document
    .getElementById(
        "searchInput"
    )
    .addEventListener(
        "input",
        function () {

            const search =
                this.value.toLowerCase();


            const filtered =
                allRegistrations.filter(

                    (student) =>

                        student.name
                            .toLowerCase()
                            .includes(search)

                        ||

                        student.college
                            .toLowerCase()
                            .includes(search)

                        ||

                        student.mobile
                            .includes(search)

                );


            displayRegistrations(
                filtered
            );

        }
    );
// =================================
// UPDATE ATTENDANCE
// =================================

async function updateAttendance(
    studentId,
    attendance
) {

    try {

        const response =
            await fetch(
                API_BASE_URL + "/api/attendance",
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            studentId:
                                studentId,

                            attendance:
                                attendance

                        })

                }
            );


        const result =
            await response.json();


        if (
            result.success
        ) {

            alert(
                "Attendance updated successfully! ✅"
            );

        } else {

            alert(
                result.message
            );

        }

    }

    catch (error) {

        console.log(error);

        alert(
            "Unable to update attendance"
        );

    }

}

// =================================
// DELETE STUDENT
// =================================

async function deleteStudent(
    id
) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this registration?"
        );


    if (!confirmDelete) {

        return;

    }


    const response =
        await fetch(

            API_BASE_URL + "/api/registration/" +
            id,

            {
                method:
                    "DELETE"
            }

        );


    const result =
        await response.json();


    alert(
        result.message
    );


    loadRegistrations();

}

// =================================
// DOWNLOAD EXCEL
// =================================

document
    .getElementById(
        "downloadExcel"
    )
    .addEventListener(
        "click",
        function () {

            window.location.href =
                "/api/export-excel";

        }
    );
// =================================
// INITIAL LOAD
// =================================

loadRegistrations();