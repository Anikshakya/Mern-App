import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let auth = localStorage.getItem("user");
    if (auth == null) {
      navigate("/auth");
    }
    if (auth) {
      auth = JSON.parse(auth);
      if (auth.match !== "1") {
        navigate("/otp");
      }
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const logout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  return (
    <div>
      <nav style={styles.navbar}>
        <div style={styles.logo}>Acs App</div>
        <ul style={styles.navList}>
          <li style={styles.navItem}><Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>Home</Link></li>
          <li style={styles.navItem}><Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>Dashboard</Link></li>
          {/* Add more navigation links as needed */}
        </ul>
        <button style={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </nav>
      <div style={styles.container}>
        <h1 style={styles.heading}>Hello, Friend!</h1>
        <p style={styles.subHeading}>Welcome to Your Home Page</p>
      </div>
    </div>
  );
};

const styles = {
    navbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      backgroundColor: "#f2f2f2",
      color: "#333",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    logo: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#555",    
    },
    navList: {
      listStyle: "none",
      display: "flex",
    },
    navItem: {
      marginRight: "20px",
    },
    container: {
      textAlign: "center",
      margin: "50px auto",
      padding: "20px",
      maxWidth: "400px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
    },
    heading: {
      fontSize: "24px",
      color: "#333",
    },
    subHeading: {
      fontSize: "16px",
      color: "#666",
      marginTop: "10px",
    },
    logoutButton: {
      padding: "10px 20px",
      backgroundColor: "#e74c3c",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
  };
  

export default Home;
