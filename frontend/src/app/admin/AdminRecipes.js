import React, { useEffect, useState } from "react";
import {
  Table,
  Dropdown,
  DropdownButton,
  Container,
  Alert,
} from "react-bootstrap";
import api from "../utils/api";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await api.get("/recipes");
      setRecipes(response.data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      setError("Failed to fetch recipes. Please try again.");
    }
  };

  const handleStatusChange = async (recipeId, newStatus) => {
    try {
      await api.put(`/recipes/${recipeId}`, { approval_status: newStatus });
      setSuccess(`Recipe ${recipeId} has been ${newStatus.toLowerCase()}.`);
      fetchRecipes();
    } catch (error) {
      console.error("Failed to update recipe status:", error);
      setError("Failed to update recipe status. Please try again.");
    }
  };

  return (
    <Container>
      <h2 className="my-4">Admin Recipes List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Writer</th>
            <th>Views Count</th>
            <th>Subscription</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe._id}>
              <td>{recipe.title}</td>
              <td>{recipe.description}</td>
              <td>{recipe.category_name}</td>
              <td>{recipe.writer_name}</td>
              <td>{recipe.num_of_views || 0}</td>
              <td>{Boolean(recipe.is_premium) ? "Premium" : "Free"}</td>
              <td>
                {recipe.approval_status === "Pending" ? (
                  <DropdownButton
                    id={`dropdown-${recipe._id}`}
                    title={recipe.approval_status}
                    onSelect={(eventKey) =>
                      handleStatusChange(recipe._id, eventKey)
                    }
                    style={{ borderRadius: 10 }}
                  >
                    <Dropdown.Item eventKey="Approved">Approved</Dropdown.Item>
                    <Dropdown.Item eventKey="Rejected">
                      Unapproved
                    </Dropdown.Item>
                  </DropdownButton>
                ) : (
                  <>
                    {!Boolean(recipe.is_premium) ? "" : recipe.approval_status}
                  </>
                )}
              </td>
              <td>
                <Button
                  onClick={() => navigate(`/recipes/${recipe._id}/details`)}
                  variant="primary"
                >
                  View details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminRecipes;
