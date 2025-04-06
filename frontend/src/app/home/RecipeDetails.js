import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import api from "../utils/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import { getRecipeImage } from "./RecipeList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";

const RecipeDetails = () => {
  const { recipeId: id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const {
    isAuthenticated,
    user,
    isSubscriber,
    isRecipeWriter,
    isAdmin,
    setUser,
  } = useAuth();
  const navigate = useNavigate();
  const showPremiumContent = (isSubscriber() || isRecipeWriter()) && isPremium;

  const fetchSubscriptionStatus = async () => {
    if (!isAuthenticated() || !user) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        `/subscriptions/check-subscription/${user.id}`
      );
      setIsPremium(response.data?.subscription_status);
    } catch (error) {
      setError("Failed to load subscription status.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecipeDetails = async () => {
    try {
      const response = await api.get(`/recipes/${id}`);
      const recipeData = response.data;
      setRecipe(recipeData);
      
      // Only update views if user is authenticated, admin, and recipe is premium
      if (recipeData && recipeData.is_premium && isAuthenticated() && user && !isAdmin()) {
        updateRecipeViews(recipeData);
      }
      
      // Check favorites only if user is authenticated and not admin
      if (isAuthenticated() && user && !isAdmin()) {
        setIsFavorite(user.favorites_list?.includes(response.data._id));
      }
    } catch (error) {
      console.error("Error fetching recipe details:", error);
      setError("Failed to fetch recipe details");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPremium = () => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      navigate(`/recipes/buy-premium`);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      const updatedFavorites = isFavorite
        ? user.favorites_list.filter((favId) => favId !== recipe._id)
        : [...user.favorites_list, recipe._id];

      const url = isRecipeWriter()
        ? `/recipe-writers/${user.id}/update-favorites`
        : isSubscriber()
        ? `/subscribers/${user.id}/update-favorites`
        : "";

      if (!url) return;

      await api.put(url, {
        favorites_list: updatedFavorites,
      });

      setUser({ ...user, favorites_list: updatedFavorites });

      setIsFavorite(!isFavorite); // Toggle the favorite state locally
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };

  const updateRecipeViews = async () => {
    try {
      if (!recipe.viewers.includes(user._id)) {
        await api.put(`/recipes/${id}/increment-views`, {
          userId: user.id,
        });
      }
    } catch (error) {
      console.error("Error updating recipe views:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated() && user) {
      fetchSubscriptionStatus();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchRecipeDetails();
  }, [id, isAuthenticated, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!recipe) {
    return <div>No recipe found</div>;
  }

  return (
    <Container
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "10px",
      }}
    >
      <Row className="justify-content-center" style={{ marginTop: 50 }}>
        <Col md={10}>
          <Card
            style={{
              border: "none",
              borderRadius: "15px",
              overflow: "hidden",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              display: "flex",
            }}
          >
            <Row noGutters style={{ display: "flex", width: "100%" }}>
              <Col md={5} style={{ padding: 0 }}>
                <Card.Img
                  variant="top"
                  src={getRecipeImage(recipe.recipe_image_url)}
                  alt={recipe.title}
                  style={{
                    borderRadius: "15px 0 0 15px",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Col>
              <Col
                md={7}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Card.Body style={{ padding: "20px" }}>
                  <Card.Title
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "bold",
                      color: "#333",
                    }}
                  >
                    {recipe.title}
                  </Card.Title>
                  <Card.Text
                    style={{
                      fontSize: "1rem",
                      color: "#555",
                      marginBottom: "20px",
                    }}
                  >
                    {recipe.description}
                  </Card.Text>
                  {recipe.is_premium && !showPremiumContent && !isAdmin() && (
                    <Button variant="primary" onClick={handleBuyPremium}>
                      Buy Premium
                    </Button>
                  )}
                  {(!recipe.is_premium || showPremiumContent || isAdmin()) && (
                    <ListGroup
                      variant="flush"
                      style={{ padding: 0, margin: 0 }}
                    >
                      <ListGroup.Item
                        style={{
                          backgroundColor: "#fff",
                          border: "none",
                          padding: "10px 0",
                        }}
                      >
                        <h5
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            marginBottom: "10px",
                          }}
                        >
                          Ingredients
                        </h5>
                        <ul style={{ margin: 0, paddingLeft: "20px" }}>
                          {recipe.ingredients.map((ingredient, index) => (
                            <li
                              key={index}
                              style={{ marginBottom: "5px", color: "#555" }}
                            >
                              {ingredient.quantity} {ingredient.measurement}{" "}
                              {ingredient.ingredient}
                            </li>
                          ))}
                        </ul>
                      </ListGroup.Item>
                      <ListGroup.Item
                        style={{
                          backgroundColor: "#fff",
                          border: "none",
                          padding: "10px 0",
                        }}
                      >
                        <h5
                          style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            marginBottom: "10px",
                          }}
                        >
                          Steps
                        </h5>
                        <ol style={{ margin: 0, paddingLeft: "20px" }}>
                          {recipe.steps.map((step, index) => (
                            <li
                              key={index}
                              style={{ marginBottom: "5px", color: "#555" }}
                            >
                              {step}
                            </li>
                          ))}
                        </ol>
                      </ListGroup.Item>
                    </ListGroup>
                  )}
                </Card.Body>
                <Card.Footer>
                  <FontAwesomeIcon
                    icon={isFavorite ? faHeartSolid : faHeartRegular}
                    style={{
                      cursor: "pointer",
                      fontSize: "1.5rem",
                      color: isFavorite ? "#dc3545" : "#ccc",
                    }}
                    onClick={toggleFavorite}
                  />
                  <span
                    style={{
                      fontSize: "0.9rem",
                      marginLeft: "10px",
                      color: "#555",
                    }}
                  >
                    {isFavorite ? "Unmark as Favorite" : "Mark as Favorite"}
                  </span>
                </Card.Footer>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default RecipeDetails;
