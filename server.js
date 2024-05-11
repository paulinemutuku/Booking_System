const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000; // or any other port that you prefer

// Middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // Example using Gmail; replace with your preferred service
    auth: {
        user: 'your-email@gmail.com', // Your email address
        pass: 'your-email-password'  // Your email password
    }
});

// Function to send emails
function sendEmail(to, subject, text, callback) {
    const mailOptions = {
        from: 'your-email@gmail.com', // Sender address
        to: to, // Recipient address
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

// GET route for the root to test the server
app.get('/', (req, res) => {
    res.send('Hello from the Appointment Booking Server!');
});

// POST route to handle appointment booking
app.post('/book-appointment', (req, res) => {
    const { name, email, date, time } = req.body;

    // Email content for user
    const userMessage = `Hello ${name}, your appointment is confirmed for ${date} at ${time}.`;
    sendEmail(email, "Appointment Confirmation", userMessage, (err, result) => {
        if (err) {
            res.status(500).send('Error sending email to user.');
            return;
        }

        // Email content for admin
        const adminEmail = "admin-email@gmail.com";  // Admin email
        const adminMessage = `New appointment booked: Name: ${name}, Email: ${email}, Date: ${date}, Time: ${time}.`;
        sendEmail(adminEmail, "New Appointment Booked", adminMessage, (err, result) => {
            if (err) {
                res.status(500).send('Error sending email to admin.');
                return;
            }
            
            res.status(200).send("Appointment booked successfully and notifications sent.");
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
