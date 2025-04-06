import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Spinner } from "react-bootstrap";
import api from "../utils/api"; // Ensure the correct path to your api utility
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getRecipeImage } from "../home/RecipeList";

const FavoriteRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, isRecipeWriter, isSubscriber } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      const url = isSubscriber()
        ? `/recipes/favorites/subscriber/${user.id}`
        : isRecipeWriter()
        ? `/recipes/favorites/recipe-writer/${user.id}`
        : "";

      if (!url) return;
      try {
        const response = await api.get(url);
        setRecipes(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to load favorite recipes.");
        setLoading(false);
      }
    };

    fetchFavorites();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Spinner animation="border" variant="primary" />
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Row className="justify-content-center">
          <Alert variant="danger">{error}</Alert>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-center" style={{ marginTop: 50 }}>
        <Col md={8}>
          <h2>Favorite Recipes</h2>
          <Row>
            {recipes.map((recipe) => (
              <Col md={6} lg={4} key={recipe.id} className="mb-4">
                <Card
                  className="shadow-sm"
                  onClick={() => navigate(`/recipes/${recipe._id}/details`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card.Img
                    variant="top"
                    src={getRecipeImage(recipe.recipe_image_url)}
                    alt={recipe.title}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title>{recipe.title}</Card.Title>
                    <Card.Text>{recipe.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default FavoriteRecipes;
