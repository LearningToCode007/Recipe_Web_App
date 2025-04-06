import React, { useState } from "react";
import { Form } from "react-bootstrap";

const CustomInput = ({
  controlId,
  label,
  type,
  name,
  placeholder,
  value,
  onChange,
  onBlur,
  required,
  isInvalid,
  errorMessage,
  style = {},
}) => {
  const [touched, setTouched] = useState(false);

  const handleBlur = (e) => {
    setTouched(true);
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <Form.Group controlId={controlId} style={style}>
      <Form.Label>
        <b>{label}</b>
      </Form.Label>
      <Form.Control
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        required={required}
        isInvalid={touched && isInvalid}
        style={{ padding: 10, borderRadius: 16 }}
      />
      {touched && isInvalid && (
        <Form.Control.Feedback type="invalid">
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default CustomInput;
