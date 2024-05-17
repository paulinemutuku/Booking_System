// const express = require('express');
// const bodyParser = require('body-parser');
// const nodemailer = require('nodemailer');

// const app = express();
// const port = 3000; // or any other port that you prefer

// // Middleware to parse request bodies
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // Email configuration
// const transporter = nodemailer.createTransport({
//     service: 'gmail', // Example using Gmail; replace with your preferred service
//     auth: {
//         user: 'paulinenthenya10@gmail.com', // Your email address
//         pass: 'raru auyk dlhz vvvl'  // Your email password
//     }
// });

// // Function to send emails
// function sendEmail(to, subject, text, callback) {
//     const mailOptions = {
//         from: 'paulinenthenya10@gmail.com', // Sender address
//         to: to, // Recipient address
//         subject: subject,
//         text: text
//     };

//     transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//             console.log('Error sending email:', error);
//             callback(error, null);
//         } else {
//             console.log('Email sent:', info.response);
//             callback(null, info.response);
//         }
//     });
// }

// // GET route for the root to test the server
// app.get('/', (req, res) => {
//     res.send('Hello from the Appointment Booking Server!');
// });

// // POST route to handle appointment booking
// app.post('/book-appointment', (req, res) => {
//     const { name, email, date, time } = req.body;

//     // Email content for user
//     const userMessage = `Hello ${name}, your appointment is confirmed for ${date} at ${time}.`;
//     sendEmail(email, "Appointment Confirmation", userMessage, (err, result) => {
//         if (err) {
//             res.status(500).send('Error sending email to user.');
//             return;
//         }

//         // Email content for admin
//         const adminEmail = "paulinenthenya10@gmail.com";  // Admin email
//         const adminMessage = `New appointment booked: Name: ${name}, Email: ${email},
//         console.log('Success:', AdminMessage);
//         Date: ${date}, Time: ${time}.`;
//         sendEmail(adminEmail, "New Appointment Booked", adminMessage, (err, result) => {
//             if (err) {
//                 res.status(500).send('Error sending email to admin.');
//                 return;
//             }
//             res.status(200).send("Appointment booked successfully and notifications sent.");
//         });
//     });
// });

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// var smtpTransport = require('nodemailer-smtp-transport');


// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
// const transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail', // 'smtp.gmail.com
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        //should be written in the .env file
        user: 'paulinenthenya10@gmail.com',
        pass: 'raru auyk dlhz vvvl'
    }
});

function sendEmail(to, subject, text, callback) {
    const mailOptions = {
        from: 'paulinenthenya10@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log('Error sending email:', error);
            callback(error, null);
        } else {
            console.log('Email sent:', info.response);
            callback(null, info.response);
        }
    });
}

app.get('/', (req, res) => {
    res.send('Hello from the Appointment Booking Server!');
});

app.post('/book-appointment', (req, res) => {
    const { name, email, date, time } = req.body;

    // Validation
    if (!name || !email || !date || !time) {
        return res.status(400).send('Please provide all required information.');
    }

    // Email content for user
    const userMessage = `Hello ${name}, your appointment is confirmed for ${date} at ${time}.`;

    sendEmail(email, "Appointment Confirmation", userMessage, (err, result) => {
        if (err) {
            console.error('Error sending email to user:', err);
            return res.status(500).send('Error sending email to user.');
        }

        // Email content for admin
        const adminEmail = "paulinenthenya10@gmail.com";
        const adminMessage = `New appointment booked:\nName: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}.`;

        sendEmail(adminEmail, "New Appointment Booked", adminMessage, (err, result) => {
            if (err) {
                console.error('Error sending email to admin:', err);
                return res.status(500).send('Error sending email to admin.');
            }

            res.status(200).send("Appointment booked successfully and notifications sent.");
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});