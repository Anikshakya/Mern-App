import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let auth = localStorage.getItem("user");
    if (auth == null) {
      navigate("/auth");
    }
    if (auth) {
      auth = JSON.parse(auth);
      if (auth.match === "1") {
        if (auth.role === "user") {
          navigate("/home");
        }
      } else {
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
    <div style={styles.container}>
      <div style={styles.drawer}>
        {/* Add navigation links for the side drawer */}
        <p>Dashboard</p>
        <p>User</p>
        <p>Settings</p>
      </div>
      <div style={styles.content}>
        <h1 style={styles.heading}>Admin Dashboard</h1>
        <p style={styles.subHeading}>Welcome, Administrator!</p>
        {/* Add admin dashboard content here */}
        <button style={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
  },
  drawer: {
    width: "200px",
    height: "100vh",
    backgroundColor: "#f2f2f2",  // Light grey color
    padding: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  content: {
    flex: "1",  // Take remaining space
    padding: "20px",
  },
  heading: {
    fontSize: "24px",
  },
  subHeading: {
    fontSize: "20px",
    color: "#666",
    marginTop: "10px",
  },
  logoutButton: {
    padding: "10px 20px",
    marginTop: "20px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default Dashboard;
