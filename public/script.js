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