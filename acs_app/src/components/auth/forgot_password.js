import React,{useState,useEffect} from "react";
import { useNavigate,Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LOGIN_IMAGE } from "../../app_config/constants";


const ForgetPassword=()=>{

    const [email,setForgetEmail] = useState();
    const navigate=useNavigate();
     
    useEffect(()=>{
        const auth = localStorage.getItem("user");
        if (auth) {
            navigate("/dashboard");
        }
    })

    const  forgetEmailPassword=async()=>{
    let result = await fetch("http://localhost:5000/forget_password", {
        method: "post",
        body: JSON.stringify({ email }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    result=await result.json();
    if(result.success==true){
        toast.success(result?.message);
        navigate("/recoverPassword")
    }else{
        toast.error(result?.message);
    }
    }

    return(
        <div>
        <div className="container" id="container">
            <div className="forms-container">
                <div className="signin-signup">
                    {/* <!-- Sign In Form --> */}
                    <form action="#" className="sign-in-form">
                        <h2 className="title">Forget Password</h2>
                        <div className="input-field">
                            <i className="fas fa-user"></i>
                            <input type="email" value={email} onChange={(e) => setForgetEmail(e.target.value)} placeholder="Email" required/>
                        </div>
         
                        <button type="button" className="btn solid" id="signInButton" onClick={forgetEmailPassword}>Submit</button>
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
                        <h3>Wanna Login in?!</h3>
                        <p>
                        Click Below to go to the Login Page.
                        </p>

                        <button className="btn transparent" id="sign-up-btn">
                         <Link to="/auth" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
                            </button>

                    </div>
                    <img src= {LOGIN_IMAGE} className="image" alt="" />
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

export default ForgetPassword;