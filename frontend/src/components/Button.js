import { Button as Btn } from "react-bootstrap";

const Button = ({ children, style = {}, type = "button", onClick }) => {
  return (
    <Btn
      type={type}
      onClick={onClick}
      style={{
        backgroundColor: "#4CAF50",
        border: "none",
        color: "white",
        padding: "8px 16px",
        textAlign: "center",
        textDecoration: "none",
        display: "inline-block",
        fontSize: "16px",
        margin: "4px 2px",
        cursor: "pointer",
        borderRadius: "20px",
        ...style,
      }}
    >
      {children}
    </Btn>
  );
};

export default Button;
