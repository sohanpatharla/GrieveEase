// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Home.css';
// const Home = () => {
//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Welcome to the Grievance Redressal System</h1>
//       <p>Please log in or sign up to continue</p>
//       <div>
//         <Link to="/login">
//           <button style={{ margin: '10px', padding: '10px 20px' }}>Login</button>
//         </Link>
//         <Link to="/signup">
//           <button style={{ margin: '10px', padding: '10px 20px' }}>Signup</button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Home;
import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./Home.css";
import styles from "./Button.module.css";
import { Link } from "react-router-dom";

class Landing extends React.Component {
  render() {
    return (
      <Container fluid id={styles.landingback}>
        <Row className="justify-content-md-center">
          <Col xs="12" lg="12" sm="12" md="12" id={styles.landbox}>
            <span id={styles.landtext}>Grievance Portal</span>
            <br />
            <div className={styles.landsub}>We are here to support you</div>
            <Link
              className={styles.underline_btn}
              style={{ color: "#1c1c1c" }}
              to="/signup"
            >
              Sign Up
            </Link>{" "}
            <Link
              className={styles.underline_btn}
              style={{ color: "#1c1c1c" }}
              to="/login"
            >
              Login
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default Landing;
