import React, { useState } from "react";
import { Alert, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import { useAuth } from "../../context/AuthContext";
import api from "../utils/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [validated, setValidated] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted"); // Debugging line

    // Validate email and password
    const isEmailValid = email && emailPattern.test(email);
    const isPasswordValid = password && password.trim() !== "";

    setEmailValid(isEmailValid);
    setPasswordValid(isPasswordValid);

    if (!isEmailValid || !isPasswordValid) {
      event.stopPropagation();
      setError("Please fill in all fields correctly.");
      setValidated(true);
      return;
    }

    try {
      const response = await api.post("/admins/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      setSuccess("Login successful!");
      const { token, ...rest } = response?.data;
      setTimeout(() => {
        login(token, { ...rest });
        navigate("/admin/recipes");
      }, 1000);
      setError("");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password. Please try again.");
      setSuccess("");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
      setEmailValid(emailPattern.test(value));
    } else if (name === "password") {
      setPassword(value);
      setPasswordValid(value.trim() !== "");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center" style={{ marginTop: 150 }}>
        <Col sm={6} md={4} style={{ marginLeft: 30 }}>
          <h2>Admin Login</h2>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            style={{ width: "80%" }}
          >
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <CustomInput
              controlId="email"
              label="Email address"
              type="email"
              name="email"
              placeholder="Enter email"
              value={email}
              onChange={handleChange}
              required
              isValid={emailValid}
              errorMessage={"Please enter a valid email address"}
            />

            <CustomInput
              controlId="password"
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
              isValid={passwordValid}
              errorMessage={"Please enter a valid password"}
            />

            <Button
              style={{ width: "100%", marginTop: 16 }}
              variant="primary"
              type="submit" // Ensure button type is submit
            >
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
