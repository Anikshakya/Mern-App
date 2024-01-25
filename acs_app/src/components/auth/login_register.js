import React, { useEffect, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate,Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import './login_register.css';
import 'react-toastify/dist/ReactToastify.css';
import { LOGIN_IMAGE, SIGNUP_IMAGE } from "../../app_config/constants";
import showPwdImg from '../../app_config/show-password.svg';
import hidePwdImg from '../../app_config/hide-password.svg';

const LoginRegister = () => {
    // State variables
    const [isVerified, setIsVerified]     = React.useState(false);
    const [Login, setLogin]               = React.useState(false);
    const [name, setName]                 = useState();
    const [role, setRole]                 = useState();
    let [email, setEmail]                 = useState();
    let [password, setPassword]           = useState();
    let [loginEmail, setloginEmail]       = useState();
    let [loginPassword, setloginPassword] = useState();

    // State variables for form validation
    const [registerErrors, setRegisterErrors]    = useState(false);
    const [loginErrors, setLoginErrors]          = useState(false);
    const [animateContainer,setAnimateContainer] = useState();
    const [isRevealPwd, setIsRevealPwd] = useState(false);
    
    // React router navigation hook
    const navigate = useNavigate();

    // useEffect to handle initial actions and check for existing authentication
    useEffect(() => {
        
        setRole("user");
        const sign_in_btn     = document.getElementById('sign-in-btn');
        const sign_up_btn     = document.getElementById('sign-up-btn');
        const container       = document.getElementById('container');
        let pass              = document.getElementById("password");
        let passwordStrength  = document.getElementById("password-strength");
        let lowUpperCase      = document.querySelector(".low-upper-case i");
        let number            = document.querySelector(".one-number i");
        let specialChar       = document.querySelector(".one-special-char i");
        let eightChar         = document.querySelector(".eight-character i");

        setAnimateContainer(container);

        // Animate
        sign_up_btn.addEventListener('click', () => {
            container.classList.add("sign-up-mode");
            setLoginErrors(false)
            setRegisterErrors(false)
        });
        sign_in_btn.addEventListener('click', () => {
            container.classList.remove('sign-up-mode');
            setLoginErrors(false)
            setRegisterErrors(false)
        });

        // Password Strength 
        pass.addEventListener("keyup", function(){
            let pass = document.getElementById("password").value;
            checkStrength(pass);
        });
        
        function checkStrength(password) {

            let strength = 0;
            //If password contains both lower and uppercase characters
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                strength += 1;
                lowUpperCase.classList.remove('fa-times');
                lowUpperCase.classList.add('fa-check');
            } else {
                lowUpperCase.classList.add('fa-times');
                lowUpperCase.classList.remove('fa-check');
            }
            //If it has numbers and characters
            if (password.match(/([0-9])/)) {
                strength += 1;
                number.classList.remove('fa-times');
                number.classList.add('fa-check');
            } else {
                number.classList.add('fa-times');
                number.classList.remove('fa-check');
            }
            //If it has one special character
            if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
                strength += 1;
                specialChar.classList.remove('fa-times');
                specialChar.classList.add('fa-check');
            } else {
                specialChar.classList.add('fa-times');
                specialChar.classList.remove('fa-check');
            }
            //If password is greater than 7
            if (password.length > 7) {
                strength += 1;
                eightChar.classList.remove('fa-times');
                eightChar.classList.add('fa-check');
            } else {
                eightChar.classList.add('fa-times');
                eightChar.classList.remove('fa-check');   
            }

            // If value is less than 2
            if (strength < 2) {
                passwordStrength.classList.remove('progress-bar-warning');
                passwordStrength.classList.remove('progress-bar-success');
                passwordStrength.classList.add('progress-bar-danger');
                passwordStrength.style = 'width: 10%';
            } else if (strength == 3) {
                passwordStrength.classList.remove('progress-bar-success');
                passwordStrength.classList.remove('progress-bar-danger');
                passwordStrength.classList.add('progress-bar-warning');
                passwordStrength.style = 'width: 60%';
            } else if (strength == 4) {
                passwordStrength.classList.remove('progress-bar-warning');
                passwordStrength.classList.remove('progress-bar-danger');
                passwordStrength.classList.add('progress-bar-success');
                passwordStrength.style = 'width: 100%';
            }
  
        }

        // Check if user is already authenticated and redirect to dashboard
        let auth = localStorage.getItem("user");
        if (auth) {
           auth=JSON.parse(auth);
           if(auth.match=="1"){
            navigate("/dashboard");
           }else{
            navigate("/auth");
           }
        }

    }, [navigate]);

    // Function to handle login form submission
    const LoginForm = async () => {
        if (!loginEmail || !loginPassword) {
            setLoginErrors(true);
            return false;
        }
        if(loginEmail.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
            email = loginEmail;
            password = loginPassword;
            let result = await fetch("http://localhost:5000/login", {
                method: "post",
                body: JSON.stringify({ email, password }),
                headers: {
                    "Content-Type": "application/json"
                }
            });
            result = await result.json();
            
            if(result.success==false){
                toast.error(result.message);
            } 
            if (result.user) {
                localStorage.setItem("user", JSON.stringify(result.user));
                if (result.user.role == "user") {
                    navigate("/home");
                } else if(result.user.role == "admin"){
                    navigate("/dashboard");
                }
            }
        } else{
            return  toast.error('Please provide valid Email');
        }
    };

    // Function to handle registration form submission
    const registerForm = async () => {

        // Validate Empty
        if (!name || !email || !password) {
            setRegisterErrors(true);
            return false;
        }

        // Validate Email
        if(email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
            // Validate Password
            if( password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) 
                &&  password.match(/([0-9])/) 
                    && password.match(/([!,%,&,@,#,$,^,*,?,_,~])/) 
                        && password.length > 7 ){
                // Validate CAPTCHA
                if(isVerified == false){
                    return  toast.error("Please Validate CAPTCHA");
                }
                setLogin(true);
                let result = await fetch("http://localhost:5000/register", {
                    method: 'post',
                    body: JSON.stringify({ name, email, password, role}),
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                result = await result.json();
                if(result.sucess==true){
                    localStorage.setItem("user", JSON.stringify(result.user));
                    navigate("/otp")
                    if(result.user){
                        animateContainer.classList.remove('sign-up-mode');
                    }
                } else{
                    return  toast.error(result.message);
                }
            } else{
                return  toast.error("Please provide a Strong Password");
            }
        }else{
            return  toast.error('Please provide valid Email');
        }
    };

    // Function to handle reCAPTCHA change
    const onChange = (e) => { 
        console.log(e);
        if (e != null) { 
            setIsVerified(true);
        } else {
            setIsVerified(false);
        }
    };

    // HTML for Login and Register
    return (
        <div>
            <div className="container" id="container">
                <div className="forms-container">
                    <div className="signin-signup">
                        {/* <!-- Sign In Form --> */}
                        <form action="#" className="sign-in-form">
                            <h2 className="title">Sign in</h2>

                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input type="email" value={loginEmail} onChange={(e) => setloginEmail(e.target.value)} placeholder="Email" required/>
                            </div>
                            {loginErrors && !loginEmail && <span style={{ color: '#ca533e', fontSize: '13px'}}>Email must not be Empty</span>}
                            
                            <div className="input-field">
                            <img title={isRevealPwd ? "Hide password" : "Show password"} src={isRevealPwd ? hidePwdImg : showPwdImg} onClick={() => setIsRevealPwd(prevState => !prevState)} height="50px" width="28px" />
                                <input name="password" placeholder="Enter Password" type={isRevealPwd ? "text" : "password"} value={loginPassword} onChange={(e) => setloginPassword(e.target.value)} />        
                            </div>
                            {loginErrors && !loginPassword && <span style={{ color: '#ca533e', fontSize: '13px'}}>Password must not be Empty</span>}
                            <div>
                            <br></br>
                            <Link to="/forgotPassword">Forgot Password?</Link>
                            </div>
                            <button type="button" className="btn solid" id="signInButton" onClick={LoginForm}>Login</button>
                            <p className="social-text">Or Sign in with social platforms</p>
                            <div className="social-media">
                                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-google"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </form>

                        {/* <!-- Sign Up Form --> */}
                        <form action="#" className="sign-up-form">
                            <h2 className="title">Sign up</h2>

                            <div className="input-field">
                                <i className="fas fa-user"></i>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                            </div>
                            {registerErrors && !name && <span style={{ color: '#ca533e', fontSize: '13px'}}>Please Enter Your Name</span>}

                            <div className="input-field">
                                <i className="fas fa-envelope"></i>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
                            </div>
                            {registerErrors && !email && <span style={{ color: '#ca533e', fontSize: '13px'}}>Please Enter Valid Email</span>}

                            <div className="input-field">
                            <img title={isRevealPwd ? "Hide password" : "Show password"} src={isRevealPwd ? hidePwdImg : showPwdImg} onClick={() => setIsRevealPwd(prevState => !prevState)} height="50px" width="28px" />
                                <input type={isRevealPwd ? "text" : "password"}  id="password" className="form-control input-md" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required/>    
                            </div>
                            {registerErrors && !password && <span style={{ color: '#ca533e', fontSize: '13px'}}>Password must not be Empty</span>}
                            <br></br>

                            {/* Password Strength bar and indicator */}
                            <div className="form-group" >
                                {/* Password Strength bar */}
                                <div className="progress">
                                    <div id="password-strength"
                                        role="progressbar" 
                                        aria-valuenow="40"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                        style={{width:"0%"}}
                                        >
                                    </div>
                                </div>
                                {/* Password Strength indicator */}
                                <ul className="list-unstyled">
                                    <li className="" style={{ listStyleType: "none", fontSize: '13px' }}>
                                        <span className="eight-character">
                                            <i className="fas fa-times" aria-hidden="true"></i>
                                            &nbsp; At least 8 Character
                                        </span>
                                    </li>

                                    <li className="" style={{ listStyleType: "none", fontSize: '13px' }}>
                                        <span className="low-upper-case">
                                            <i className="fas fa-times" aria-hidden="true"></i>
                                            &nbsp; Lowercase &amp; Uppercase
                                        </span>
                                    </li>

                                    <li className="" style={{ listStyleType: "none", fontSize: '13px' }}>
                                        <span className="one-number">
                                            <i className="fas fa-times" aria-hidden="true"></i>
                                            &nbsp; Number (0-9)
                                        </span> 
                                    </li>

                                    <li className="" style={{ listStyleType: "none", fontSize: '13px' }}>
                                        <span className="one-special-char">
                                            <i className="fas fa-times" aria-hidden="true"></i>
                                            &nbsp; Special Character (!@#$%^&*)
                                        </span>
                                    </li>
                                </ul>
                            </div>


                            {/* reCAPTCHA component */}
                            <div style={{ transform: 'scale(0.9)'}}>
                                <ReCAPTCHA
                                    sitekey={'6Lfgs4AgAAAAAHHMQgr0D42_1Fxros57krHL9wsS'}
                                    onChange={onChange}
                                    onVerify={() => {
                                        console.log('verificado');
                                    }}
                                    size="normal"
                                />
                            </div>

                            <button type="button" id="signUpButton" className = "btn" onClick={registerForm} >Sign Up</button>
                        </form>
                    </div>
                </div>
                
                {/* Animation Panels */}
                <div className="panels-container">
                    <div className="panel left-panel">
                        <div className="content">
                            <h3>New here ?</h3>
                            <p>
                            Get ready to unlock a world of possibilities. Start your journey by signing up below. We're excited to have you on board.
                            </p>
                            <button className="btn transparent" id="sign-up-btn">Sign up</button>
                        </div>
                        <img src= {LOGIN_IMAGE} className="image" alt="" />
                    </div>
                    <div className="panel right-panel">
                        <div className="content">
                            <h3>One of us ?</h3>
                            <p>
                            Ready to dive into your personalized experience? Log in below to access your account and explore the full potential of our app. We're delighted to have you with us again.
                            </p>
                            <button className="btn transparent" id="sign-in-btn">Sign in</button>
                            </div>
                            <img src= {SIGNUP_IMAGE} className="image" alt="" />
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

export default LoginRegister;