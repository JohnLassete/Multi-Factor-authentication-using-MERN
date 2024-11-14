import React, { useState } from "react";
import "./Login.css";
import axios from 'axios';

const Login = () => {
    const [showOtpFiled, setShowOtpFiled] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3001/auth/login', { email, password });

            if (response.data.success) {
                setShowOtpFiled(true);
                alert('OTP sent to your email. Check your inbox.')
            } else {
                alert(response.data.message);
            }
        }
        catch (error) {
            console.error('Error during login: ', error.message);
            alert('An error occurred during login');
        }
    }

    const handleOtpVerification = async () => {
        try {
            const optResponse = await axios.post('http://localhost:3001/auth/verify-otp', { otp });
            if (optResponse.data.success) {
                alert('OTP verified. User logged in.')
            } else {
                alert("Invalid OTP. Please try again.")
            }
        } catch (error) {
            console.error("Error during OTP verification: ", error.message);
            alert('An error occurred during OTP verification');
        }
    };

    return (
        <div className="login-container">
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            {showOtpFiled && (
                <>
                    <input
                        type="text"
                        placeholder="OTP"
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button className="login-button"
                        onClick={handleOtpVerification}>
                        Verify OTP
                    </button>
                </>
            )}
            <button className="login-button"
                onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}

export default Login;