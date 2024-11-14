const express = require('express');
const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const randomatic = require('randomatic');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/mfa-mern')
    .then(console.log("Database is connected."))
    .catch((err) => console.error("DB connecting is failed: ", err));

const User = mongoose.model("User", {
    email: String,
    password: String,
    otp: String,
})

const sendOtpEmail = (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: '',
                pass: ''
            },
        });

        const mailOptions = {
            from: '',
            to: email,
            subject: 'OTP Verification',
            text: `Your OTP is: ${otp}`,
        };

        const info = transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    try {
        const user = await User.findOne({ email, password });
        console.log(user);

        if (!user) {
            return res.json({ success: false, message: "Invalid credentials" });
        }

        const generatedOtp = randomatic("0", 6);
        user.otp = generatedOtp;
        await user.save();

        sendOtpEmail(email, generatedOtp);
        return res.json({ success: true });
    } catch (error) {
        console.error('Error during login: ', error.message);
        return res.status(500).json({ success: false, message: "An error occurred during login" });
    }
});

app.post('auth/verify-opt', async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await User.findOne({ otp });
        if (!user) {
            return res.json({ sucess: false, message: 'Invalid OTP' });
        }

        user.otp = '';
        await user.save();

        return res.json({ success: true });
    } catch (error) {
        console.error('Error during OTP verification:', error.message);
        return res.status(500).json({
            success: false,
            message: 'An error occurred during OTP verification'
        });
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})