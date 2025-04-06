import React from "react";
import {
  Container,
  Nav,
  Navbar,
  Button,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CustomMenuItem = ({ children, to }) => {
  return (
    <Nav.Link as={Link} to={to}>
      <div
        style={{
          padding: 6,
        }}
      >
        {children}
      </div>
    </Nav.Link>
  );
};

const Header = () => {
  const {
    isAuthenticated,
    user,
    logout,
    isSubscriber,
    isRecipeWriter,
    isAdmin,
  } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Logout</Popover.Header>
      <Popover.Body>
        Are you sure you want to logout?
        <Button
          variant="danger"
          onClick={handleLogout}
          style={{ marginTop: "10px" }}
        >
          Yes, Logout
        </Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <Navbar bg="dark" variant="dark" expand="lg" style={{ height: 65 }}>
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            fontFamily: "cursive !important",
            fontStyle: "italic",
            fontSize: "bold",
          }}
        >
          <b> Recipe Management</b>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <CustomMenuItem to="/">Home</CustomMenuItem>
            {!isAdmin() && (
              <CustomMenuItem to="/search-recipes">
                Search Recipes
              </CustomMenuItem>
            )}
            {isAdmin() && (
              <>
                <CustomMenuItem to="/admin/recipes">Recipes</CustomMenuItem>
                <CustomMenuItem to="/admin/recipe-writers">
                  Recipes Writers
                </CustomMenuItem>
                <CustomMenuItem to="/admin/subscribers">
                  Subscribers
                </CustomMenuItem>
              </>
            )}
            {isSubscriber() && (
              <>
                <CustomMenuItem to="/subscriber/favorite-recipes">
                  Favorite Recipes
                </CustomMenuItem>
                <CustomMenuItem to="/recipe-writer/my-recipes">
                  My Recipes
                </CustomMenuItem>
                <CustomMenuItem to="/premium-details">Premium</CustomMenuItem>
              </>
            )}
            {isRecipeWriter() && (
              <>
                <CustomMenuItem to="/recipe-writer/favorite-recipes">
                  Favorite Recipes
                </CustomMenuItem>
                {user?.status === "Approved" && (
                  <CustomMenuItem to="/recipe-writer/my-recipes">
                    My Recipes
                  </CustomMenuItem>
                )}
                <CustomMenuItem to="/premium-details">Premium</CustomMenuItem>
              </>
            )}
            {!isAuthenticated() && (
              <>
                <CustomMenuItem to="/login">Login</CustomMenuItem>
                <CustomMenuItem to="/register">Register</CustomMenuItem>
                <CustomMenuItem to="/recipe-writer/login">
                  Recipe Writer
                </CustomMenuItem>
              </>
            )}
          </Nav>
          {isAuthenticated() && (
            <Nav>
              {(isAdmin() || isRecipeWriter() || isSubscriber()) && (
                <Nav.Item style={{ marginRight: 80 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span
                      style={{ marginRight: 16, marginTop: 8, color: "white" }}
                    >
                      Compensation Balance: $
                      {isAdmin()
                        ? (user?.amount || 0).toFixed(2)
                        : (user?.compensation_balance || 0).toFixed(2)}
                    </span>
                  </div>
                </Nav.Item>
              )}
              <Nav.Item>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    style={{ marginRight: 16, marginTop: 8, color: "white" }}
                  >
                    Welcome, {user?.first_name}
                  </span>
                </div>
              </Nav.Item>
              <Nav.Item>
                <OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  overlay={popover}
                  rootClose={true} // Set rootClose to true
                >
                  <Button variant="danger" onClick={() => navigate("/logout")}>
                    Logout
                  </Button>
                </OverlayTrigger>
              </Nav.Item>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
