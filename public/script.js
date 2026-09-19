document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       INTRO SCREEN
    ===================================== */

    const introScreen =
        document.getElementById("introScreen");

    const mainContent =
        document.getElementById("mainContent");

    setTimeout(function () {

        introScreen.classList.add("intro-hide");

        setTimeout(function () {

            introScreen.style.display = "none";

            mainContent.classList.add("show-main");

        }, 800);

    }, 5000);
/* ==========================================
   PAGE 2 - 3D COLLEGE SLIDESHOW
========================================== */

const galleryPhotos =
    document.querySelectorAll(".gallery-photo");

const photoNumber =
    document.getElementById("photoNumber");

let currentPhoto = 0;

if (galleryPhotos.length > 0) {

    function updateGallery() {

        galleryPhotos.forEach(function (photo, index) {

            photo.classList.remove(
                "active",
                "prev",
                "next"
            );

            if (index === currentPhoto) {
                photo.classList.add("active");
            }

            if (
                index ===
                (currentPhoto - 1 + galleryPhotos.length)
                % galleryPhotos.length
            ) {
                photo.classList.add("prev");
            }

            if (
                index ===
                (currentPhoto + 1)
                % galleryPhotos.length
            ) {
                photo.classList.add("next");
            }

        });

        if (photoNumber) {
            photoNumber.textContent =
                String(currentPhoto + 1).padStart(2, "0");
        }
    }

    updateGallery();

    setInterval(function () {

        currentPhoto =
            (currentPhoto + 1) % galleryPhotos.length;

        updateGallery();

    }, 3500);
}
/* ==========================================
   PAGE 2 - HOD INFO
========================================== */

const hodInfoButton =
    document.getElementById("hodInfoButton");

const hodDetails =
    document.getElementById("hodDetails");

if (hodInfoButton && hodDetails) {

    hodInfoButton.addEventListener(
        "click",
        function () {

            hodDetails.classList.toggle("hidden");

            if (
                hodDetails.classList.contains("hidden")
            ) {

                hodInfoButton.textContent =
                    "ℹ HOD INFO";

            } else {

                hodInfoButton.textContent =
                    "✕ CLOSE HOD INFO";

            }

        }
    );

}
/* ==========================================
   PAGE 2 - COUNTDOWN
========================================== */

// CHANGE THIS DATE & TIME
const targetDate = new Date("2026-09-30T10:00:00+05:30").getTime();


function updateCountdown() {

    const now =
        new Date().getTime();

    const difference =
    targetDate - now;

    if (difference <= 0) {

        document.getElementById("days").textContent =
            "00";

        document.getElementById("hours").textContent =
            "00";

        document.getElementById("minutes").textContent =
            "00";

        document.getElementById("seconds").textContent =
            "00";

        return;

    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (difference %
                (1000 * 60 * 60 * 24)) /
                (1000 * 60 * 60)
        );

    const minutes =
        Math.floor(
            (difference %
                (1000 * 60 * 60)) /
                (1000 * 60)
        );

    const seconds =
        Math.floor(
            (difference %
                (1000 * 60)) /
                1000
        );


    document.getElementById("days").textContent =
        String(days).padStart(2, "0");

    document.getElementById("hours").textContent =
        String(hours).padStart(2, "0");

    document.getElementById("minutes").textContent =
        String(minutes).padStart(2, "0");

    document.getElementById("seconds").textContent =
        String(seconds).padStart(2, "0");

}

updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* ==========================================
   PAGE 2 → MAIN PAGE (REGISTRATION PAGE)
========================================== */

const goToRegistration =
    document.getElementById("goToRegistration");

const page2 =
    document.getElementById("page2");

const mainPage =
    document.getElementById("mainPage");

if (
    goToRegistration &&
    page2 &&
    mainPage
) {
    goToRegistration.addEventListener(
        "click",
        function () {

            page2.classList.add(
                "page2-fade-out"
            );

            setTimeout(function () {

                page2.style.display = "none";

                mainPage.classList.add("show-registration");

                window.scrollTo(0, 0);

            }, 700);

        }
    );
}

    /* =====================================
       EVENT TABS
    ===================================== */

    const technicalTab =
        document.getElementById("technicalTab");

    const nonTechnicalTab =
        document.getElementById("nonTechnicalTab");

    const technicalEvents =
        document.getElementById("technicalEvents");

    const nonTechnicalEvents =
        document.getElementById("nonTechnicalEvents");


    technicalTab.addEventListener(
        "click",
        function () {

            technicalTab.classList.add("active");

            nonTechnicalTab.classList.remove("active");

            technicalEvents.classList.remove("hidden");

            nonTechnicalEvents.classList.add("hidden");

        }
    );


    nonTechnicalTab.addEventListener(
        "click",
        function () {

            nonTechnicalTab.classList.add("active");

            technicalTab.classList.add("active");

            nonTechnicalEvents.classList.remove("hidden");

            technicalEvents.classList.remove("hidden");

        }
    );
/* =====================================
   EVENT SELECTION LIMIT
===================================== */

// TECHNICAL - MAXIMUM 2
const technicalCheckboxes =
    document.querySelectorAll(
        '#technicalEvents input[name="events"]'
    );

technicalCheckboxes.forEach(function (checkbox) {

    checkbox.addEventListener(
        "change",
        function () {

            const selectedTechnical =
                document.querySelectorAll(
                    '#technicalEvents input[name="events"]:checked'
                );

            if (selectedTechnical.length > 2) {

                checkbox.checked = false;

                alert(
                    "You can select maximum 2 Technical Events."
                );

            }

        }
    );

});


// NON-TECHNICAL - MAXIMUM 1
const nonTechnicalCheckboxes =
    document.querySelectorAll(
        '#nonTechnicalEvents input[name="events"]'
    );

nonTechnicalCheckboxes.forEach(function (checkbox) {

    checkbox.addEventListener(
        "change",
        function () {

            const selectedNonTechnical =
                document.querySelectorAll(
                    '#nonTechnicalEvents input[name="events"]:checked'
                );

            if (selectedNonTechnical.length > 1) {

                checkbox.checked = false;

                alert(
                    "You can select only 1 Non-Technical Event."
                );

            }

        }
    );

});


/* =====================================
   EVENT INFO GUIDELINES
===================================== */

const eventGuidelines = {

    perspecta: {
        title: "💻 PERSPECTA",
        content: `
            <ul>
                <li>Each team should have 2 or 3 members.</li>
                <li>PPT should contain a maximum of 10 to 15 slides.</li>
                <li>The idea must be creative, innovative, clear, and concise.</li>
                <li>10 minutes are allotted for presentation, followed by a Q&A session.</li>
                <li>Participants must follow formal dress code, time management, and professional behaviour.</li>
            </ul>
        `
    },

    bitcrux: {
        title: "💻 BITCRUX",
        content: `
            <ul>
                <li>Participants must use their own HackerRank account.</li>
                <li>The competition duration in 1hr.</li>
                <li>Participants must debug programs with Syntax, Logical, and Runtime Errors.</li>
                <li>Copying, collaboration, or sharing questions/solutions/screenshots is strictly prohibited.</li>
                <li>Evaluation is based on test cases successfully passed; in case of a tie, lower submission time wins.</li>
            </ul>
        `
    },

    vizzard: {
        title: "💻 VIZZARD",
        content: `
            <ul>
                <li>Participants will be provided with 3 datasets and questions for each dataset.</li>
                <li>Participants must create a suitable Power BI dashboard and answer the given questions.</li>
                <li>Each team can have 1 to 3 members.</li>
                <li>The total event duration is 1 hour 10 minutes, and participants must complete at least 2 datasets.</li>
                <li>Evaluation will consider accuracy, number of datasets completed, visualizations, dashboard clarity, and quality of insights.</li>
            </ul>
        `
    },

    mystery: {
        title: "🎭 MYSTERY MISSION",
        content: `
            <ul>
                <li>Objects/clues are displayed only once.</li>
                <li>Participants must work independently.</li>
                <li>Marks depend on accuracy and time.</li>
                <li>No external assistance or discussion.</li>
                <li>Judges decision is final. </li>
            </ul>
        `
    },

    voice: {
        title: "🎤 VOICE CLASH",
        content: `
            <ul>
                <li>The topic is given by the organizers.</li>
                <li>Participants are assigned For or Against.</li>
                <li>Each participant has a fixed speaking time.</li>
                <li>Personal attacks, offensive language, and interruptions are not allowed.</li>
                <li>Evaluation is based on content, relevance, clarity, confidence, and presentation.</li>
            </ul>
        `
    },

    mind: {
        title: "🧠 MIND TRACK",
        content: `
            <ul>
                <li>The item list is displayed only once.</li>
                <li>Participants must observe and remember the items.</li>
                <li>Items must be arranged in the same order.</li>
                <li>No assistance or communication is allowed.</li>
                <li>Evaluation is based on accuracy and completion time.</li>
            </ul>
        `
    }

};


/* =====================================
   OPEN EVENT INFO
===================================== */

window.showEventInfo = function (eventName) {

    const event = eventGuidelines[eventName];

    if (!event) {
        console.error("Event not found:", eventName);
        return;
    }

    const modal =
        document.getElementById("eventInfoModal");

    const title =
        document.getElementById("eventInfoTitle");

    const content =
        document.getElementById("eventInfoContent");

    if (!modal || !title || !content) {
        console.error("Event Info HTML not found");
        return;
    }

    title.innerHTML = event.title;

    content.innerHTML = event.content;

    modal.classList.add("show");

};


/* =====================================
   CLOSE EVENT INFO
===================================== */

window.closeEventInfo = function () {

    const modal =
        document.getElementById("eventInfoModal");

    if (modal) {

        modal.classList.remove("show");

    }

};


/* =====================================
   CLOSE EVENT INFO - OUTSIDE CLICK
===================================== */

const eventInfoModal =
    document.getElementById("eventInfoModal");

if (eventInfoModal) {

    eventInfoModal.addEventListener(
        "click",
        function (e) {

            if (e.target === eventInfoModal) {

                closeEventInfo();

            }

        }
    );

}
    /* =====================================
       PAYMENT OPTION
    ===================================== */

    const paymentOptions =
        document.querySelectorAll(
            'input[name="payment"]'
        );

    const qrPaymentBox =
        document.getElementById(
            "qrPaymentBox"
        );

    const transactionId =
        document.getElementById(
            "transactionId"
        );


    paymentOptions.forEach(
        function (option) {

            option.addEventListener(
                "change",
                function () {

                    if (
                        option.value === "Online"
                    ) {

                        qrPaymentBox.classList.remove(
                            "hidden"
                        );

                        transactionId.required = true;

                    } else {

                        qrPaymentBox.classList.add(
                            "hidden"
                        );

                        transactionId.required = false;

                        transactionId.value = "";

                    }

                }
            );

        }
    );


    /* =====================================
       QR CODE CLICK
    ===================================== */

    const paymentQR =
        document.getElementById("paymentQR");

    if (paymentQR) {

        paymentQR.addEventListener(
            "click",
            function () {

                alert(
                    "Please scan the QR code using GPay, PhonePe or any UPI App."
                );

            }
        );

    }


    /* =====================================
       REGISTRATION FORM
    ===================================== */

    const registrationForm =
        document.getElementById(
            "registrationForm"
        );

    const successModal =
        document.getElementById(
            "successModal"
        );

    const successCloseBtn =
        document.getElementById(
            "successCloseBtn"
        );

    const registerButton =
        document.querySelector(
            ".register-btn"
        );


    registrationForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* ===============================
               EVENT VALIDATION
            =============================== */

            const selectedEvents =
                document.querySelectorAll(
                    'input[name="events"]:checked'
                );


            if (
                selectedEvents.length === 0
            ) {

                alert(
                    "Please select at least one event."
                );

                return;

            }

            /* ===============================
               MOBILE VALIDATION
            =============================== */

            const mobile =
                document.getElementById(
                    "mobile"
                ).value.trim();


            if (
                !/^[0-9]{10}$/.test(
                    mobile
                )
            ) {

                alert(
                    "Please enter a valid 10 digit mobile number."
                );

                return;

            }



            /* ===============================
               PAYMENT VALIDATION
            =============================== */

            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                );


            if (!payment) {

                alert(
                    "Please select a payment option."
                );

                return;

            }


            if (
                payment.value === "Online"
            ) {

                const transaction =
                    transactionId.value.trim();


               if (
    !/^\d{12}$/.test(transaction)
) {

    alert(
        "Transaction ID must be exactly 12 digits."
    );

    return;

}
            }


           /* ===============================
   PREPARE DATA FOR SERVER
=============================== */

const formData = new FormData(registrationForm);

/* Student details */

formData.set(
    "name",
    document
        .getElementById("fullName")
        .value
        .trim()
);

formData.set(
    "college",
    document
        .getElementById("collegeName")
        .value
        .trim()
);


/* Food Preference */

const selectedFood =
    document.querySelector(
        'input[name="food"]:checked'
    );

if (selectedFood) {
    formData.set(
        "food",
        selectedFood.value
    );
}


/* Selected Events */
const selectedEventValues = Array.from(
    selectedEvents
).map(function (event) {
    return event.value.trim();
});

formData.delete("events");

selectedEventValues.forEach(function (event) {
    formData.append("events", event);
});

/* Payment */

formData.set(
    "payment",
    payment.value
);


/* Transaction ID */

if (payment.value === "Online") {

    formData.set(
        "transactionId",
        transactionId.value.trim()
    );

} else {

    formData.set(
        "transactionId",
        ""
    );
}


/* Remove old field names */

formData.delete("fullName");
formData.delete("collegeName");


            /* ===============================
               DISABLE BUTTON
            =============================== */

            registerButton.disabled = true;

            registerButton.textContent =
                "REGISTERING...";


            try {

                /* ===============================
                   SEND DATA TO BACKEND
                =============================== */

                const API_BASE_URL = window.API_BASE_URL || "";

                const response =
                    await fetch(
                        API_BASE_URL + "/register",
                        {

                            method:
                                "POST",

                            body:
                                formData

                        }
                    );


                const result =
                    await response.json();


                /* ===============================
                   SERVER ERROR
                =============================== */

                if (
                    !response.ok ||
                    !result.success
                ) {

                    alert(
                        result.message ||
                        "Registration failed. Please try again."
                    );

                    return;

                }


                /* ===============================
                   SUCCESS
                =============================== */

                successModal.classList.remove(
                    "hidden"
                );


                /*
                   Registration code console-la
                   check panna useful
                */

                console.log(
                    "Registration Code:",
                    result.registrationCode
                );


                registrationForm.reset();


                qrPaymentBox.classList.add(
                    "hidden"
                );


                technicalEvents.classList.remove(
                    "hidden"
                );

                nonTechnicalEvents.classList.add(
                    "hidden"
                );


                technicalTab.classList.add(
                    "active"
                );

                nonTechnicalTab.classList.remove(
                    "active"
                );


            }

            catch (error) {

                console.error(
                    "Registration Error:",
                    error
                );

                alert(
                    "Server connection error. Please try again."
                );

            }

            finally {

                /* ===============================
                   ENABLE BUTTON AGAIN
                =============================== */

                registerButton.disabled = false;

                registerButton.innerHTML =
                    "🚀 REGISTER NOW";

            }

        }
    );


    /* =====================================
       SUCCESS MODAL CLOSE
    ===================================== */

    successCloseBtn.addEventListener(
        "click",
        function () {

            successModal.classList.add(
                "hidden"
            );

        }
    );


});
function toggleOtherDepartment() {

    const department =
        document.getElementById("department");

    const otherDepartment =
        document.getElementById("otherDepartment");

    if (department.value === "Other") {

        otherDepartment.style.display = "block";
        otherDepartment.required = true;

    } else {

        otherDepartment.style.display = "none";
        otherDepartment.required = false;
        otherDepartment.value = "";
    }
}
/* =====================================
   SUCCESS MODAL
===================================== */

const successModal = document.getElementById("successModal");
const successCloseBtn = document.getElementById("successCloseBtn");

if (successCloseBtn && successModal) {

    successCloseBtn.addEventListener("click", function () {
        successModal.classList.add("hidden");
    });

}

if (successModal) {

    successModal.addEventListener("click", function (e) {

        if (e.target === successModal) {
            successModal.classList.add("hidden");
        }

    });

}