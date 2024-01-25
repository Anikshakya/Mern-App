import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginRegister from "./components/auth/login_register";
import Dashboard from "./components/dashboard/dashboard";
import Home from "./components/home/home"
import ForgetPassword from "./components/auth/forgot_password";
import RecoverPassword  from "./components/auth/recover_password";
import OtpSignup from "./components/auth/otp_password";

/* Root Routes */
export default function App() {
  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Navigate to="/auth"/> } />
          <Route path="/auth" element={<LoginRegister/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/forgotPassword" element={<ForgetPassword/>} />
          <Route path="/recoverPassword" element={<RecoverPassword/>} />
          <Route path="/otp" element={<OtpSignup/>} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}