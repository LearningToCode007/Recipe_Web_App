import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("http://localhost:3002/api/recipes", { withCredentials: true });
      console.log('Recipes response:', response.data);
      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setError(error.response?.data?.message || "Failed to load recipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const imageStyle = {
    height: "200px",
    objectFit: "cover",
    borderRadius: "20px 20px 0 0",
  };

  const renderRecipes = () => {
    if (loading) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading recipes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-5">
          <h3 className="text-danger">Error loading recipes</h3>
          <p>{error}</p>
          <Button onClick={fetchRecipes} variant="primary">
            Try Again
          </Button>
        </div>
      );
    }

    if (recipes.length === 0) {
      return (
        <div className="text-center py-5">
          <p>No recipes found. Check back later!</p>
        </div>
      );
    }

    return (
      <Row xs={1} md={2} lg={3} className="g-4">
        {recipes.map((recipe) => (
          <Col key={recipe._id}>
            <Card className="h-100 shadow-sm">
              {recipe.recipe_image_url && (
                <Card.Img
                  variant="top"
                  src={`http://localhost:3002/images/${recipe.recipe_image_url}`}
                  style={imageStyle}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-recipe.jpg';
                  }}
                />
              )}
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Text>{recipe.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <Button
                    onClick={() => navigate(`/recipes/${recipe._id}/details`)}
                    variant="primary"
                    size="sm"
                  >
                    View Recipe
                  </Button>
                  {recipe.is_premium && (
                    <span className="badge bg-warning">Premium</span>
                  )}
                </div>
              </Card.Body>
              <Card.Footer className="text-muted">
                <small>Category: {recipe.category_name}</small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          padding: "50px 0",
          textAlign: "center",
          backgroundColor: "#f8f9fa",
          marginBottom: "2rem"
        }}
      >
        <Container>
          <h1>Welcome to Recipe Management</h1>
          <p className="lead">
            Discover, share, and enjoy mouthwatering recipes from around the world.
          </p>
          <Button
            onClick={() => navigate("/search-recipes")}
            variant="primary"
            size="lg"
          >
            Explore More Recipes
          </Button>
        </Container>
      </div>

      {/* Recipes Dashboard */}
      <Container>
        <h2 className="text-center mb-4">Latest Recipes</h2>
        {renderRecipes()}
      </Container>

      {/* Why Choose Us Section */}
      <Container style={{ padding: "50px 0" }}>
        <Row className="justify-content-center">
          <Col md={8}>
            <h2 className="text-center mb-4">Why Choose Us?</h2>
            <p className="text-center">
              At Recipe Management, we're passionate about bringing you the best
              recipes and culinary experiences. Here's why you'll love our
              platform:
            </p>
            <ul className="list-unstyled">
              <li className="mb-3">
                <i className="bi bi-check-circle-fill text-primary me-2"></i>
                <strong>Wide Variety:</strong> Explore a vast collection of recipes
                ranging from traditional favorites to innovative creations.
              </li>
              <li className="mb-3">
                <i className="bi bi-check-circle-fill text-primary me-2"></i>
                <strong>User-Friendly:</strong> Our intuitive interface makes it
                easy to find, save, and share your favorite recipes.
              </li>
              <li className="mb-3">
                <i className="bi bi-check-circle-fill text-primary me-2"></i>
                <strong>Community-Driven:</strong> Join a passionate community of
                food lovers, share your recipes, and connect with others.
              </li>
              <li className="mb-3">
                <i className="bi bi-check-circle-fill text-primary me-2"></i>
                <strong>Quality Content:</strong> Every recipe is curated and
                reviewed to ensure only the best make it to your kitchen.
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
