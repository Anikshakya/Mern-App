import React,{useState,useEffect} from "react";
import { useNavigate,Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LOGIN_IMAGE, SIGNUP_IMAGE } from "../../app_config/constants";

const RecoverPassword=()=>{

    const[password,setPassword]=useState();
    const[confirm_password,setConfirmPassword]=useState();
    const[otp,setOtp]=useState();
    const navigate=useNavigate();
  
    useEffect(()=>{
      const auth = localStorage.getItem("user"); 
      if (auth) {
         navigate("/dashboard");
      }
    })

  useEffect(()=>{
    const auth = localStorage.getItem("user"); 
    if (auth) {
       navigate("/dashboard");
    }
  })
  
  const  recoverPassword=async()=>{
    let result = await fetch("http://localhost:5000/recover_password", {
        method: "post",
        body: JSON.stringify({ password,confirm_password,otp }),
        headers: {
            "Content-Type": "application/json"
        }
    });

    result=await result.json();
    if(result.success==true){
        toast.success(result.message);
        navigate("/auth")
    }else{
        toast.error(result.message);
    }
    
  }

    return(

        <div>
        <div class="container" id="container">
            <div class="forms-container">
                <div class="signin-signup">
                    {/* <!-- Sign In Form --> */}
                    <form action="#" class="sign-in-form">
                        <h2 class="title">Recover Password</h2>
                        
                        <div class="input-field">
                            <i class="fas fa-user"></i>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" required/>
                        </div><br></br>
                        
                        <div class="input-field">
                            <i class="fas fa-user"></i>
                            <input type="password" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="confirm Password" required/>
                        </div>
                        <br></br>

                        <div class="input-field">
                            <i class="fas fa-user"></i>
                            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Otp" required/>
                        </div>
         
                        <button type="button" class="btn solid" id="signInButton" onClick={recoverPassword}>Recover Password</button>
                        <p class="social-text">Or Sign in with social platforms</p>
                        <div class="social-media">
                            <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                            <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                            <a href="#" class="social-icon"><i class="fab fa-google"></i></a>
                            <a href="#" class="social-icon"><i class="fab fa-linkedin-in"></i></a>
                        </div>
                    </form>

 
                </div>
            </div>
            
            {/* Animation Panels */}
            <div class="panels-container">
                <div class="panel left-panel">
                    <div class="content">
                        <h3>Wanna Login in?</h3>
                        <p>
                            Click the button below to go to the login page.
                        </p>
                        <button class="btn transparent" id="sign-up-btn">
                        <Link to="/auth" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
                        </button>
                
                    </div>
                    <img src= {LOGIN_IMAGE} class="image" alt="" />
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

export default RecoverPassword;