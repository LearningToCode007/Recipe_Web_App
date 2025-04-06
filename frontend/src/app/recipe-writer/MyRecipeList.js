import React, { useState, useEffect } from "react";
import { Container, Table, Tabs, Tab } from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../utils/api"; // Ensure the correct path to your api utility
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";

const MyRecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [key, setKey] = useState("premium"); // state to handle active tab
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await api.get("/recipes/user/" + user?.id); // Assuming the endpoint to fetch recipes
        setRecipes(response.data);
      } catch (error) {
        console.error("Failed to fetch recipes:", error);
      }
    };

    fetchRecipes();
  }, [user?.id]);

  // Separate recipes based on their type
  const premiumRecipes = recipes.filter((recipe) => recipe.is_premium);
  const freeRecipes = recipes.filter((recipe) => !recipe.is_premium);

  const renderRecipeTable = (recipes) => (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {recipes.map((recipe) => (
          <tr key={recipe._id}>
            <td>{recipe.title}</td>
            <td>{recipe.description}</td>
            <td>
              <Link to={`/recipe-writer/my-recipes/${recipe._id}/edit`}>
                <Button
                  style={{ borderRadius: 6, backgroundColor: "gray" }}
                  variant="info"
                  className="me-2"
                >
                  Edit
                </Button>
              </Link>
              {/* Add delete button if needed */}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  return (
    <Container>
      <h1 className="my-4">Recipe List</h1>
      <Link to="/recipe-writer/my-recipes/create">
        <Button variant="primary" className="mb-4" style={{ marginBottom: 12 }}>
          Create Recipe
        </Button>
      </Link>
      <br />
      <Tabs
        id="recipe-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="mb-3"
      >
        <Tab eventKey="premium" title="Premium Recipes">
          {renderRecipeTable(premiumRecipes)}
        </Tab>
        <Tab eventKey="free" title="Free Recipes">
          {renderRecipeTable(freeRecipes)}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MyRecipeList;
