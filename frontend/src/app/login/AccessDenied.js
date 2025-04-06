import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Segment } from "semantic-ui-react";
import { useAuth } from "../../context/AuthContext";

const AccessDenied = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Container text textAlign="center" style={{ marginTop: "100px" }}>
      <Segment raised>
        <Header as="h2" color="red">
          Access Denied
        </Header>
        <p>You do not have permission to access this page.</p>

        {!isAuthenticated() && (
          <>
            <p>Please login to continue.</p>
            <Button primary as={Link} to="/login">
              Go to Login Page
            </Button>
          </>
        )}
      </Segment>
    </Container>
  );
};

export default AccessDenied;
