import React, { useState } from "react";
import { Button, Form, Grid, Header, Message } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import moment from "moment";

const CustomerRegister = () => {
  const [customer, setCustomer] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    dob: "", // Changed dob to string
    city: "",
    zipcode: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e, { name, value }) => {
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async () => {
    setErrors({});

    // Validation rules
    const validationRules = {
      first_name: "First name is required",
      last_name: "Last name is required",
      email: "Email address is required",
      password: "Password is required",
      confirm_password:
        "Confirm password is required and must match the password",
      dob: "Date of birth is required",
      city: "City is required",
      zipcode: "Zipcode is required",
    };

    let formIsValid = true;
    let finalErrors = {};

    // Check for empty fields
    for (const key in customer) {
      if (!customer[key]) {
        finalErrors = { ...finalErrors, [key]: validationRules[key] };
        formIsValid = false;
      }
    }

    // Check if passwords match
    if (customer.password !== customer.confirm_password) {
      finalErrors.confirm_password = validationRules.confirm_password;
      formIsValid = false;
    }

    // Update errors state
    if (!formIsValid) {
      setErrors(finalErrors);
      return;
    }

    try {
      // Make API call to register customer
      await api.post("/customers", {
        ...customer,
        dob: moment(customer.dob).format("MM-DD-YYYY"),
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred.";
      setErrors({ apiError: errorMessage });
    }
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 400 }}>
        <Header as="h2" color="black" textAlign="center">
          Customer Registration
        </Header>
        <Form size="large" onSubmit={handleSubmit}>
          <Form.Input
            fluid
            placeholder="First Name"
            type="text"
            name="first_name"
            value={customer.first_name}
            onChange={handleChange}
            error={errors.first_name ? true : false}
          />
          <Form.Input
            fluid
            placeholder="Last Name"
            type="text"
            name="last_name"
            value={customer.last_name}
            onChange={handleChange}
            error={errors.last_name ? true : false}
          />
          <Form.Input
            fluid
            placeholder="E-mail address"
            type="email"
            name="email"
            value={customer.email}
            onChange={handleChange}
            error={errors.email ? true : false}
          />
          <Form.Input
            fluid
            placeholder="Password"
            type="password"
            name="password"
            value={customer.password}
            onChange={handleChange}
            error={errors.password ? true : false}
          />
          <Form.Input
            fluid
            placeholder="Confirm Password"
            type="password"
            name="confirm_password"
            value={customer.confirm_password}
            onChange={handleChange}
            error={errors.confirm_password ? true : false}
          />
          <Form.Input
            fluid
            placeholder="Date of Birth"
            type="date"
            name="dob"
            max={moment().format("YYYY-MM-DD")}
            value={customer.dob}
            onChange={handleChange}
            error={errors.dob ? true : false}
          />
          <Form.Input
            fluid
            placeholder="City"
            type="text"
            name="city"
            value={customer.city}
            onChange={handleChange}
            error={errors.city ? true : false}
          />
          <Form.Input
            fluid
            placeholder="Zipcode"
            type="text"
            name="zipcode"
            value={customer.zipcode}
            onChange={handleChange}
            error={errors.zipcode ? true : false}
          />
          {errors.apiError && (
            <Message negative>
              <Message.Header>Error:</Message.Header>
              <p>{errors.apiError}</p>
            </Message>
          )}
          <Button color="blue" fluid size="large" type="submit">
            Register
          </Button>
        </Form>
        <Message>
          Already have an account? <a href="/login">Log In</a>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default CustomerRegister;
