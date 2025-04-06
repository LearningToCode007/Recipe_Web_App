import React, { useState, useEffect } from "react";
import { Container, Form, Row, Col, InputGroup, Badge, Card, Alert, Spinner, Button } from "react-bootstrap";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export const getRecipeImage = (imageUrl) => {
  if (!imageUrl) return require("../../images/default.avif");
  return `http://localhost:3002/images/${imageUrl}`;
};

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [filterPremium, setFilterPremium] = useState("all");
  const navigate = useNavigate();

  const fetchData = async (searchTerm = "") => {
    try {
      setLoading(true);
      setError("");

      // Fetch recipes with search parameters
      const params = {};
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }
      
      const recipesResponse = await api.get("/recipes", { params });
      let filteredData = recipesResponse.data;
      
      // Filter by category
      if (selectedCategory) {
        filteredData = filteredData.filter(recipe => recipe.category_id === selectedCategory);
      }
      
      // Filter by premium status
      if (filterPremium !== "all") {
        filteredData = filteredData.filter(recipe => recipe.is_premium === (filterPremium === "premium"));
      }
      
      // Sort recipes
      filteredData.sort((a, b) => {
        switch (sortBy) {
          case "title":
            return a.title.localeCompare(b.title);
          case "views":
            return (b.num_of_views || 0) - (a.num_of_views || 0);
          default:
            return 0;
        }
      });
      
      setRecipes(recipesResponse.data);
      setFilteredRecipes(filteredData);

      // Fetch categories if not already loaded
      if (categories.length === 0) {
        const categoriesResponse = await api.get("/categories");
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.response?.data?.message || "Failed to load recipes. Please try again later.");
      setFilteredRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = () => {
    fetchData(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleRetry = () => {
    fetchData(searchQuery);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading recipes...</p>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-center my-4">Search Recipes</h2>
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <Form onSubmit={(e) => e.preventDefault()}>
              <Row className="g-3">
                <Col md={12}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search recipes by title or description"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onKeyPress={handleKeyPress}
                      className="rounded-start"
                    />
                    <Button 
                      variant="primary" 
                      onClick={handleSearch}
                      className="rounded-end"
                    >
                      Search
                    </Button>
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      fetchData(searchQuery);
                    }}
                    className="rounded"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={filterPremium}
                    onChange={(e) => {
                      setFilterPremium(e.target.value);
                      fetchData(searchQuery);
                    }}
                    className="rounded"
                  >
                    <option value="all">All Recipes</option>
                    <option value="free">Free Recipes</option>
                    <option value="premium">Premium Recipes</option>
                  </Form.Select>
                </Col>
                <Col md={4}>
                  <Form.Select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      fetchData(searchQuery);
                    }}
                    className="rounded"
                  >
                    <option value="title">Sort by Title</option>
                    <option value="views">Sort by Views</option>
                  </Form.Select>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" className="mb-4">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" onClick={handleRetry}>
              Try Again
            </Button>
          </div>
        </Alert>
      )}

      {!error && recipes.length === 0 ? (
        <Alert variant="info" className="text-center">
          <p className="mb-0">No recipes available. Please check back later!</p>
        </Alert>
      ) : filteredRecipes.length === 0 ? (
        <Alert variant="info" className="text-center">
          <p className="mb-0">No recipes found matching your criteria.</p>
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredRecipes.map((recipe) => (
            <Col key={recipe._id}>
              <Card className="h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={getRecipeImage(recipe.recipe_image_url)}
                  alt={recipe.title}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = require("../../images/default.avif");
                  }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{recipe.title}</Card.Title>
                  <Card.Text>{recipe.description}</Card.Text>
                  <div className="mt-auto">
                    {recipe.is_premium && (
                      <Badge bg="warning" text="dark" className="me-2">
                        Premium
                      </Badge>
                    )}
                    <Badge bg="info" className="me-2">
                      {categories.find(c => c._id === recipe.category_id)?.name || "Uncategorized"}
                    </Badge>
                  </div>
                  <Button
                    variant="primary"
                    className="mt-3"
                    onClick={() => navigate(`/recipes/${recipe._id}/details`)}
                  >
                    View Recipe
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default RecipeList;
