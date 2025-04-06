import React, { useState } from "react";
import { Container, Row, Col, Form, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../../context/AuthContext";
import CustomInput from "../../components/CustomInput"; // Ensure this is the correct path to your CustomInput component
import Button from "../../components/Button";

const BuyPremium = () => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    securityCode: "",
    amount: "100", // Set annual subscription price
  });
  const [validations, setValidations] = useState({
    cardNumber: true,
    cardName: true,
    expiryDate: true,
    securityCode: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  console.log(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setValidations({ ...validations, [name]: value.trim() !== "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formValidation = Object.values(formData).every(
      (value) => value.trim() !== ""
    );

    if (!formValidation) {
      // Set validations for each field that is empty
      const updatedValidations = {};
      Object.entries(formData).forEach(([key, value]) => {
        updatedValidations[key] = value.trim() !== "";
      });
      setValidations(updatedValidations);

      setError("Please fill in all required fields.");
      setSuccess("");
      return;
    }

    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const payload = {
      ...formData,
      user_id: user?.id,
    };

    try {
      const response = await api.post("/subscriptions", payload);
      setSuccess(
        "Payment successful! Your premium subscription is now active."
      );
      setError("");
      setTimeout(() => {
        navigate("/premium-details");
      }, 1000);
    } catch (error) {
      setError("Payment failed. Please try again.");
      setSuccess("");
    }
  };

  return (
    <Container>
      <Row className="justify-content-center" style={{ marginTop: 50 }}>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Premium Subscription</Card.Title>
              <Card.Text>
                <ul>
                  <li>Access to exclusive recipes</li>
                  <li>Ad-free experience</li>
                  <li>Priority support</li>
                  <li>Special discounts on cooking classes</li>
                </ul>
                <h4>Price: $100 /year</h4> {/* Update the price display */}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} style={{ marginLeft: 30 }}>
          <h2>Buy Premium Subscription</h2>
          <Form noValidate onSubmit={handleSubmit} style={{ width: "60%" }}>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <CustomInput
              controlId="cardNumber"
              label="Card Number"
              type="text"
              name="cardNumber"
              placeholder="Enter card number"
              value={formData.cardNumber}
              onChange={handleChange}
              required
              isValid={validations.cardNumber}
              errorMessage={"Please enter a valid card number."}
            />

            <CustomInput
              controlId="cardName"
              label="Card Name"
              type="text"
              name="cardName"
              placeholder="Name on card"
              value={formData.cardName}
              onChange={handleChange}
              required
              isValid={validations.cardName}
              errorMessage={"Please enter the name on the card."}
            />

            <CustomInput
              controlId="expiryDate"
              label="Expiry Date"
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              required
              isValid={validations.expiryDate}
              errorMessage={"Please enter the expiry date."}
            />

            <CustomInput
              controlId="securityCode"
              label="Security Code"
              type="text"
              name="securityCode"
              placeholder="CVV"
              value={formData.securityCode}
              onChange={handleChange}
              required
              isValid={validations.securityCode}
              errorMessage={"Please enter the security code."}
            />

            <Button
              style={{ width: "100%", marginTop: 12 }}
              className="mt-4"
              type="submit"
              variant="primary"
              block
            >
              Pay $100
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BuyPremium;
