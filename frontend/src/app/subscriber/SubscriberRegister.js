import React, { useState } from "react";
import { Form, Container, Alert, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../utils/api";
import backgroundImage from "../../images/login_image.jpeg";
import Button from "../../components/Button";
import CustomInput from "../../components/CustomInput";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";
import moment from "moment";

const SubscriberRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone_number: "",
    city: "",
    state: "",
    zipcode: "",
    dob: null, // Initialize dob as null
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [success, setSuccess] = useState("");
  const [validated, setValidated] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setValidated(true);

    if (isFormValid()) {
      const {
        firstName,
        lastName,
        email,
        password,
        phone_number,
        city,
        state,
        zipcode,
        dob,
      } = formData;

      try {
        await api.post("/subscribers", {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          phone_number,
          city,
          state,
          zipcode,
          status: "Approved",
          dob: dob ? format(dob, "MM-dd-yyyy") : null, // Format dob as MM-DD-YYYY
        });
        setSuccess("Registration successful!");
        setTimeout(() => {
          navigate("/subscriber/login");
        }, 1000);
      } catch (error) {
        setErrors({ form: "Registration failed. Please try again." });
      }
    }
  };

  const isFormValid = () => {
    const newErrors = {};
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone_number,
      city,
      state,
      zipcode,
      dob,
    } = formData;

    if (!firstName.trim()) newErrors.firstName = "Please enter your first name";
    if (!lastName.trim()) newErrors.lastName = "Please enter your last name";
    if (!email || !emailPattern.test(email))
      newErrors.email = "Please enter a valid email address";
    if (!password.trim()) newErrors.password = "Please enter a valid password";
    if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!phone_number.trim())
      newErrors.phone_number = "Please enter your phone number";
    if (!city.trim()) newErrors.city = "Please enter your city";
    if (!state.trim()) newErrors.state = "Please enter your state";
    if (!zipcode.trim()) newErrors.zipcode = "Please enter your zipcode";
    if (!dob) newErrors.dob = "Please enter your date of birth";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    isFormValid();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      dob: date,
    });
  };

  return (
    <Container>
      <Row className="justify-content-center" style={{ marginTop: 10 }}>
        <Col sm={6} md={5}>
          <img
            src={backgroundImage}
            alt="Background"
            style={{ width: "100%", height: "auto", borderRadius: 16 }}
          />
        </Col>
        <Col sm={6} md={4} style={{ marginLeft: 30 }}>
          <h2>Subscriber Registration</h2>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            style={{ width: "80%" }}
          >
            {errors.form && <Alert variant="danger">{errors.form}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <CustomInput
              controlId="firstName"
              label="First Name"
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              isInvalid={touched.firstName && !!errors.firstName}
              errorMessage={errors.firstName}
            />
            <CustomInput
              controlId="lastName"
              label="Last Name"
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              isInvalid={touched.lastName && !!errors.lastName}
              errorMessage={errors.lastName}
            />
            <CustomInput
              controlId="email"
              label="Email address"
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              isInvalid={touched.email && !!errors.email}
              errorMessage={errors.email}
            />
            <CustomInput
              controlId="password"
              label="Password"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              isInvalid={touched.password && !!errors.password}
              errorMessage={errors.password}
            />
            <CustomInput
              controlId="confirmPassword"
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
            />
            <CustomInput
              controlId="phone_number"
              label="Phone Number"
              type="text"
              name="phone_number"
              placeholder="Enter phone number"
              value={formData.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              isInvalid={touched.phone_number && !!errors.phone_number}
              errorMessage={errors.phone_number}
            />
            <CustomInput
              controlId="city"
              label="City"
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              isInvalid={touched.city && !!errors.city}
              errorMessage={errors.city}
            />
            <CustomInput
              controlId="state"
              label="State"
              type="text"
              name="state"
              placeholder="Enter state"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              isInvalid={touched.state && !!errors.state}
              errorMessage={errors.state}
            />
            <CustomInput
              controlId="zipcode"
              label="Zipcode"
              type="text"
              name="zipcode"
              placeholder="Enter zipcode"
              value={formData.zipcode}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              isInvalid={touched.zipcode && !!errors.zipcode}
              errorMessage={errors.zipcode}
            />
            <br />
            <Form.Group controlId="dob">
              <Form.Label style={{ marginRight: 10 }}>
                <b>Date of Birth</b>
              </Form.Label>
              <DatePicker
                selected={formData.dob}
                onChange={handleDateChange}
                dateFormat="MM-dd-yyyy"
                placeholderText="Select date"
                className={`form-control ${
                  touched.dob && errors.dob ? "is-invalid" : ""
                }`}
                style={{ padding: 10, borderRadius: 16 }}
                maxDate={moment().format("YYYY-MM-DD")}
              />
              {touched.dob && errors.dob && (
                <div className="invalid-feedback">{errors.dob}</div>
              )}
            </Form.Group>
            <Button
              style={{ width: "100%", marginTop: 16 }}
              variant="primary"
              type="submit"
            >
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SubscriberRegister;
