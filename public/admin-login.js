const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const loginBtn =
    document.getElementById("loginBtn");

const errorMessage =
    document.getElementById("errorMessage");


loginBtn.addEventListener(
    "click",
    async function () {

        const enteredUsername =
            username.value.trim();

        const enteredPassword =
            password.value;

        if (
            !enteredUsername ||
            !enteredPassword
        ) {

            errorMessage.textContent =
                "Please enter username and password.";

            return;

        }

        loginBtn.disabled = true;

        loginBtn.textContent =
            "LOGGING IN...";

        try {

            const response =
                await fetch(
                    "/api/admin/login",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        credentials: "same-origin",

                        body: JSON.stringify({

                            username:
                                enteredUsername,

                            password:
                                enteredPassword

                        })

                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Login failed"
                );

            }


            window.location.href =
                "admin.html";

        }

        catch (error) {

            errorMessage.textContent =
                error.message;

        }

        finally {

            loginBtn.disabled = false;

            loginBtn.textContent =
                "LOGIN";

        }

    }
);