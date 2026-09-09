const dns = require("dns");
const XLSX = require("xlsx");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const crypto = require("crypto");


const multer = require("multer");

const Registration = require("./models/Registration");

dotenv.config();

const app = express();
// =====================================
// ADMIN AUTHENTICATION
// =====================================

function createAdminToken() {

    const payload = JSON.stringify({
        admin: true,
        time: Date.now()
    });

    const encodedPayload =
        Buffer.from(payload).toString("base64url");

    const signature =
        crypto
            .createHmac(
                "sha256",
                process.env.ADMIN_SECRET
            )
            .update(encodedPayload)
            .digest("base64url");

    return encodedPayload + "." + signature;
}


function verifyAdminToken(token) {

    if (!token) {
        return false;
    }

    const parts = token.split(".");

    if (parts.length !== 2) {
        return false;
    }

    const [payload, signature] = parts;

    const expectedSignature =
        crypto
            .createHmac(
                "sha256",
                process.env.ADMIN_SECRET
            )
            .update(payload)
            .digest("base64url");

    if (signature !== expectedSignature) {
        return false;
    }

    try {

        const data =
            JSON.parse(
                Buffer.from(
                    payload,
                    "base64url"
                ).toString()
            );

        // Token expires after 8 hours
        if (
            Date.now() - data.time >
            8 * 60 * 60 * 1000
        ) {
            return false;
        }

        return data.admin === true;

    }

    catch {

        return false;

    }

}


function adminAuth(req, res, next) {

    const cookies =
        req.headers.cookie || "";

    const match =
        cookies.match(
            /adminToken=([^;]+)/
        );

    const token =
        match ? match[1] : null;

    if (!verifyAdminToken(token)) {

        return res.status(401).json({

            success: false,

            message: "Unauthorized"

        });

    }

    next();

}
const upload = multer();



const PORT = process.env.PORT || 5000;



// =====================================
// MIDDLEWARE
// =====================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(
    express.static(
        path.join(__dirname, "public")
    )
);



// =====================================
// MONGODB CONNECTION
// =====================================

mongoose
    .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 10000,
        family: 4
    })
    
    .then(() => {
        console.log(
            "MongoDB Connected Successfully"
        );
    })
    .catch((error) => {
        console.log(
            "MongoDB Connection Error:",
            error.message
        );
    });
    app.get("/api/test-db", async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({
                success: false,
                message: "MongoDB is not connected",
                readyState: mongoose.connection.readyState
            });
        }

        await mongoose.connection.db.command({
            ping: 1
        });

        res.json({
            success: true,
            message: "MongoDB Connected Successfully",
            readyState: mongoose.connection.readyState
        });

    } catch (error) {
        console.error("DB TEST ERROR:", error);

        res.status(500).json({
            success: false,
            message: "MongoDB Connection Failed",
            error: error.message,
            readyState: mongoose.connection.readyState
        });
    }
});


// =====================================
// UNIQUE REGISTRATION CODE
// =====================================

function generateRegistrationCode() {

    const random =
        crypto
            .randomBytes(3)
            .toString("hex")
            .toUpperCase();

    return "SYMPO26-" + random;

}
// =====================================
// ADMIN LOGIN
// =====================================

app.post(
    "/api/admin/login",
    (req, res) => {

        const {
            username,
            password
        } = req.body;

        if (
            username !==
                process.env.ADMIN_USERNAME ||
            password !==
                process.env.ADMIN_PASSWORD
        ) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid Username or Password"

            });

        }

        const token =
            createAdminToken();

        res.setHeader(
            "Set-Cookie",
            `adminToken=${token}; HttpOnly; Path=/; Max-Age=28800; SameSite=Lax${process.env.NODE_ENV === "production"
                ? "; Secure"
                : ""
            }`
        );

        return res.json({

            success: true,

            message: "Login successful"

        });

    }
);


// =====================================
// ADMIN LOGOUT
// =====================================

app.post(
    "/api/admin/logout",
    (req, res) => {

        res.setHeader(
            "Set-Cookie",
            "adminToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax"
        );

        res.json({

            success: true

        });

    }
);

// =====================================
// REGISTER STUDENT
// =====================================

app.post("/register", upload.none(), async (req, res) => {

        try {

            const {
                name,
                email,
                mobile,
                college,
                department,
                year,
                food,
                events,
                payment,
                transactionId
            } = req.body;


            // =====================================
            // REQUIRED FIELD VALIDATION
            // =====================================

            if (
                !name ||
                !college ||
                !department ||
                !year ||
                !mobile ||
                !email ||
                !food ||
                !events ||
                !payment
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please fill all required fields"

                });

            }


            // =====================================
            // MOBILE NUMBER VALIDATION
            // =====================================

            if (
                !/^[0-9]{10}$/.test(mobile)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Please enter a valid 10 digit mobile number"

                });

            }


            // =====================================
            // DUPLICATE EMAIL / MOBILE CHECK
            // =====================================

            console.time(
                "DUPLICATE CHECK"
            );

            const existingUser =
                await Registration.findOne({

                    $or: [

                        {
                            email:
                                email.toLowerCase()
                        },

                        {
                            mobile:
                                mobile
                        }

                    ]

                });

            console.timeEnd(
                "DUPLICATE CHECK"
            );


            if (existingUser) {

                if (
                    existingUser.email ===
                    email.toLowerCase()
                ) {

                    return res.status(409).json({

                        success: false,

                        message:
                            "This Email ID is already registered!"

                    });

                }


                if (
                    existingUser.mobile ===
                    mobile
                ) {

                    return res.status(409).json({

                        success: false,

                        message:
                            "This Mobile Number is already registered!"

                    });

                }

            }


            // =====================================
            // REGISTRATION CODE GENERATION
            // =====================================

            console.time(
                "CODE GENERATION"
            );

            let registrationCode;

            let codeExists = true;


            while (codeExists) {

                registrationCode =
                    generateRegistrationCode();


                const existingCode =
                    await Registration.findOne({

                        registrationCode:
                            registrationCode

                    });


                if (!existingCode) {

                    codeExists = false;

                }

            }


            console.timeEnd(
                "CODE GENERATION"
            );


            // =====================================
            // EVENT PROCESSING
            // =====================================

            let selectedEvents;


            if (Array.isArray(events)) {

                selectedEvents =
                    events

                        .flatMap(
                            event =>
                                String(event)
                                    .split(",")
                                    .map(
                                        e =>
                                            e.trim()
                                    )
                        )

                        .filter(Boolean);

            }

            else {

                selectedEvents =
                    String(events)

                        .split(",")

                        .map(
                            e =>
                                e.trim()
                        )

                        .filter(Boolean);

            }


            // =====================================
            // CREATE SCORE FOR EACH EVENT
            // =====================================

            const eventScores =
                selectedEvents.map(
                    event => ({

                        event:
                            event,

                        score:
                            null

                    })
                );


            // =====================================
            // PAYMENT VALIDATION
            // =====================================

            if (
                payment === "Online" &&
                !/^\d{12}$/.test(
                    transactionId || ""
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Transaction ID must be exactly 12 digits."

                });

            }


            // =====================================
            // CREATE REGISTRATION
            // =====================================

            const newRegistration =
                new Registration({

                    name:
                        name,

                    email:
                        email.toLowerCase(),

                    mobile:
                        mobile,

                    college:
                        college,

                    department:
                        department,

                    year:
                        year,

                    food:
                        food,

                    events:
                        selectedEvents,

                    scores:
                        eventScores,

                    payment:
                        payment,

                    transactionId:
                        payment === "Online"
                            ? transactionId
                            : "",

                    registrationCode:
                        registrationCode

                });


            // =====================================
            // SAVE TO MONGODB
            // =====================================

            console.time(
                "MONGODB SAVE"
            );

            await newRegistration.save();

            console.timeEnd(
                "MONGODB SAVE"
            );


            // =====================================
            // EMAIL HTML
            // =====================================

            const emailHtml = `

<div style="
    font-family: Arial, sans-serif;
    padding: 30px;
    background: #071632;
    color: white;
    border-radius: 15px;
">

    <h1 style="color:#38bdf8;">
        Registration Successful!
    </h1>

    <p>
        Hello <b>${name}</b>,
    </p>

    <p>
        Your NEXORA 2026 symposium registration
        has been successfully completed.
    </p>

    <hr>

    <h2>
        Registration ID
    </h2>

    <h1 style="color:#22d3ee;">
        ${registrationCode}
    </h1>

    <p>
        <b>College:</b> ${college}
    </p>

    <p>
        <b>Events:</b>
        ${selectedEvents.join(", ")}
    </p>

    <p>
        <b>Payment:</b> ${payment}
    </p>

    <br>

    <p>
        Please keep your Registration ID safe.
    </p>

    <p>
        NEXORA 2026
    </p>

</div>

`;


            // =====================================
            // SEND CONFIRMATION EMAIL
            // =====================================

            try {

                console.log(
                    "Sending confirmation email to:",
                    email
                );


                const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json"
    },
    body: JSON.stringify({
        sender: {
            name: "NEXORA 2026",
            email: process.env.EMAIL_FROM
        },
        to: [
            {
                email: email
            }
        ],
        subject: "NEXORA 2026 - Registration Confirmation",
        htmlContent: emailHtml
    })
});

const result = await response.json();

if (!response.ok) {
    throw new Error(JSON.stringify(result));
}

console.log(
    "Confirmation email sent successfully:",
    result.messageId
);

            }

            catch (emailError) {

                console.error(
                    "EMAIL ERROR:",
                    emailError
                );

            }


            // =====================================
            // SUCCESS RESPONSE
            // =====================================

            return res.status(201).json({

                success: true,

                message:
                    "Registration successful! Confirmation email sent.",

                registrationCode:
                    registrationCode

            });

        }


        // =====================================
        // REGISTRATION ERROR
        // =====================================

        catch (error) {

            console.log(
                "Registration Error:",
                error
            );


            if (
                error.code === 11000
            ) {

                return res.status(409).json({

                    success: false,

                    message:
                        "Email or Mobile Number is already registered!"

                });

            }


            return res.status(500).json({

                success: false,

                message:
                    "Something went wrong. Please try again."

            });

        }

    }
);



// =====================================
// UPDATE ATTENDANCE
// =====================================

app.put(
    "/api/attendance",
    adminAuth,
    async (req, res) => {
        try {

            const {
                studentId,
                attendance
            } = req.body;


            if (
                !studentId ||
                !attendance
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Student ID and attendance are required"

                });

            }


            if (
                attendance !== "Present" &&
                attendance !== "Absent"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid attendance status"

                });

            }


            const student =
                await Registration.findByIdAndUpdate(

                    studentId,

                    {
                        attendance:
                            attendance
                    },

                    {
                        new: true
                    }

                );


            if (!student) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Student not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Attendance updated successfully",

                data:
                    student

            });

        }

        catch (error) {

            console.log(
                "Attendance Error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    "Unable to update attendance"

            });

        }

    }
);

// =====================================
// GET ALL REGISTRATIONS
// =====================================

app.get(
    "/api/registrations",
    adminAuth,
    async (req, res) => {
        try {

            const registrations =
                await Registration
                    .find()
                    .sort({
                        createdAt: -1
                    });


            res.json({

                success: true,

                data:
                    registrations

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch registrations"

            });

        }

    }
);


// =====================================
// GET EVENT PARTICIPANTS
// =====================================

app.get(
    "/api/event/:eventName",
    adminAuth,
    async (req, res) => {
        try {

            const eventName =
                decodeURIComponent(
                    req.params.eventName
                );


            const participants =
                await Registration.find({

                    events:
                        eventName

                });


            const formattedParticipants =
                participants.map(
                    (participant) => {

                        const scoreData =
                            participant.scores.find(

                                (item) =>
                                    item.event ===
                                    eventName

                            );


                        return {

                            _id:
                                participant._id,

                            name:
                                participant.name,

                            college:
                                participant.college,

                            department:
                                participant.department,

                            registrationCode:
                                participant.registrationCode,

                            score:

                                scoreData
                                    ? scoreData.score
                                    : null

                        };

                    }
                );


            res.json({

                success: true,

                data:
                    formattedParticipants

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    "Unable to fetch event participants"

            });

        }

    }
);


// =====================================
// SAVE SCORE FOR SPECIFIC EVENT
// =====================================

app.put(
    "/api/score",
    adminAuth,
    async (req, res) => {

        try {

            const {

                studentId,

                event,

                score

            } = req.body;


            if (

                !studentId ||
                !event ||
                score === undefined

            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Student, event and score are required"

                });

            }


            const numericScore =
                Number(score);


            if (
                isNaN(numericScore)
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Score must be a number"

                });

            }


            const student =
                await Registration.findById(
                    studentId
                );


            if (!student) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Student not found"

                });

            }


            const scoreIndex =
                student.scores.findIndex(

                    (item) =>
                        item.event === event

                );


            if (
                scoreIndex !== -1
            ) {

                student.scores[
                    scoreIndex
                ].score =
                    numericScore;

            } else {

                student.scores.push({

                    event:
                        event,

                    score:
                        numericScore

                });

            }


            await student.save();


            res.json({

                success: true,

                message:
                    "Score saved successfully"

            });

        }

        catch (error) {

            console.log(error);

            res.status(500).json({

                success: false,

                message:
                    "Unable to save score"

            });

        }

    }
);


// =====================================
// GET TOP 3 WINNERS FOR EVENT
// =====================================

app.get(
    "/api/winners/:eventName",
    adminAuth,
    async (req, res) => {

        try {

            const eventName =
                decodeURIComponent(
                    req.params.eventName
                );


            const participants =
                await Registration.find({

                    events:
                        eventName

                });


            const scoredParticipants =
                participants
                    .map(
                        (student) => {

                            const eventScore =
                                student.scores.find(

                                    (item) =>
                                        item.event ===
                                        eventName

                                );


                            return {

                                name:
                                    student.name,

                                college:
                                    student.college,

                                department:
                                    student.department,

                                registrationCode:
                                    student.registrationCode,

                                score:

                                    eventScore
                                        ? eventScore.score
                                        : null

                            };

                        }
                    )

                    // SCORE ENTER PANNAVANGA MATTUM

                    .filter(
                        (student) =>
                            student.score !== null
                    )

                    // HIGHEST SCORE FIRST

                    .sort(
                        (a, b) =>
                            b.score - a.score
                    )

                    // TOP 3

                    .slice(0, 3);


            res.json({

                success: true,

                event:
                    eventName,

                winners:
                    scoredParticipants

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    "Unable to get winners"

            });

        }

    }
);


// =====================================
// DELETE REGISTRATION
// =====================================

app.delete(
    "/api/registration/:id",
    adminAuth,
    async (req, res) => {

        try {

            const registration =
                await Registration.findByIdAndDelete(
                    req.params.id
                );


            if (!registration) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Registration not found"

                });

            }


            res.json({

                success: true,

                message:
                    "Registration deleted"

            });

        }

        catch (error) {

            res.status(500).json({

                success: false,

                message:
                    "Unable to delete registration"

            });

        }

    }
);
// =====================================
// EXPORT REGISTRATIONS TO EXCEL
// =====================================

app.get(
    "/api/export-excel",
    adminAuth,
    async (req, res) => {

        try {

            const registrations =
                await Registration
                    .find()
                    .sort({
                        createdAt: -1
                    });


            const excelData =
                registrations.map(
                    (student, index) => ({

                        "S.No":
                            index + 1,

                        "Name":
                            student.name,

                        "College":
                            student.college,

                        "Department":
                            student.department,

                        "Year":
                            student.year,

                        "Email":
                            student.email,

                        "Mobile Number":
                            student.mobile,

                        "Food":
                            student.food || "",

                        "Events":
                            student.events
                                ? student.events.join(", ")
                                : "",

                        "Payment":
                            student.payment,

                        "Attendance":
                            student.attendance || "Absent",

                        "Registration ID":
                            student.registrationCode,

                        "Registration Date":

                            student.createdAt
                                ? new Date(
                                    student.createdAt
                                ).toLocaleString()
                                : ""

                    })
                );


            const workbook =
                XLSX.utils.book_new();


            const worksheet =
                XLSX.utils.json_to_sheet(
                    excelData
                );


            XLSX.utils.book_append_sheet(

                workbook,

                worksheet,

                "Registrations"

            );


            const fileName = "NEXORA_2026_Registrations.xlsx";

const excelBuffer =
    XLSX.write(
        workbook,
        {
            type: "buffer",
            bookType: "xlsx"
        }
    );

res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
);

res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName}"`
);

res.send(excelBuffer);
        }

        catch (error) {

            console.log(
                "Excel Export Error:",
                error
            );


            res.status(500).json({

                success: false,

                message:
                    "Unable to export Excel file"

            });

        }

    }
);

// =====================================
// ERROR HANDLER
// =====================================

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.log(
            error.message
        );

        res.status(400).json({

            success: false,

            message:
                error.message

        });

    }
);


// =====================================
// START SERVER
// =====================================

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

    }
);