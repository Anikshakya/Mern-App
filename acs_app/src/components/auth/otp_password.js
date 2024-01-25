import React, { useEffect } from "react";
import { LOGIN_IMAGE, SIGNUP_IMAGE } from "../../app_config/constants";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate, Link } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';

const OtpSignup = () => {

    const navigate = useNavigate();
    const [otp, setOtp] = React.useState();

    useEffect(() => {

        let auth = localStorage.getItem("user");
        if (auth == null) {
            navigate("/auth");
        }
        if (auth) {

            auth = JSON.parse(auth);
            if (auth.match == "1") {
                if (auth.role == "user") {
                    navigate("/home");
                }
            } else {
                navigate("/otp");
            }
        } else {
            navigate("/auth");
        }


        var timeleft = 120;
        var downloadTimer = setInterval(function () {
            if (timeleft <= 0) {
                clearInterval(downloadTimer);
                navigate("/auth");
            } else {
                // toast.success(timeleft + "second remainning")     
            }
            timeleft -= 1;
        }, 1000);
    })

    const otpSignup = async () => {

        let email = JSON.parse(localStorage.getItem("user"));
        let result = await fetch("http://localhost:5000/otp", {
            method: "post",
            body: JSON.stringify({ otp }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        result = await result.json();

        if (result.success == true) {
            debugger;
            localStorage.setItem("user", JSON.stringify(result.user));
            navigate("/home");
        } else {
            toast.error(result.message)
        }
    }

    return (

        <div>
            <div className="container" id="container">
                <div className="forms-container">
                    <div className="signin-signup">
                        {/* <!-- Sign In Form --> */}

                        <form action="#" className="sign-in-form">
                            <Alert variant="success">
                                <div id="countdown"></div>

                            </Alert>
                            <br></br>
                            <h2 className="title">OTP</h2>
                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Otp" required />
                            </div>

                            <button type="button" className="btn solid" id="signInButton" onClick={otpSignup}>Submit</button>
                            <p className="social-text">Or Sign in with social platforms</p>
                            <div className="social-media">
                                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </form>


                    </div>
                </div>

                {/* Animation Panels */}
                <div className="panels-container">
                    <div className="panel left-panel">
                        <div className="content">
                            <h3>Welcome to  Otp.....!</h3>
                            <p>
                                Please provide the Opt For Login Purpose.....!
                            </p>

                            <button className="btn transparent" id="sign-up-btn">
                                <Link to="/auth" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
                            </button>

                        </div>
                        <img src={LOGIN_IMAGE} className="image" alt="" />
                    </div>

                </div>

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </div>

    )

}

export default OtpSignup;