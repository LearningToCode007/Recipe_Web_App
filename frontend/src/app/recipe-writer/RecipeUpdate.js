import React, { useEffect, useState } from "react";
import { Container, Form, Modal, Table } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api"; // Ensure the correct path to your api utility
import CustomInput from "../../components/CustomInput";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { measurements } from "./measurements";

const RecipeUpdate = () => {
  const { recipeId } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    image: null,
    categoryId: "",
    is_premium: false,
  });
  const [showIngredientModal, setShowIngredientModal] = useState(false);
  const [ingredientFormData, setIngredientFormData] = useState({
    ingredient: "",
    quantity: "",
    measurement: "",
  });
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to update recipe:", error);
    }
  };

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${recipeId}`);
      const recipe = response.data;
      setFormData({
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.steps,
        categoryId: recipe.category_id,
        is_premium: Boolean(recipe.is_premium),
        image: null, // Image should be handled separately
      });
    } catch (error) {
      console.error("Failed to fetch recipe:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchRecipe();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleInstructionChange = (index, e) => {
    const { value } = e.target;
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    setFormData((prevData) => ({
      ...prevData,
      instructions: updatedInstructions,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleAddIngredient = () => {
    setShowIngredientModal(true);
  };

  const handleEditIngredient = (ingredient) => {
    setIngredientFormData(ingredient);
    setShowIngredientModal(true);
  };

  const handleAddInstruction = () => {
    setFormData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, ""],
    }));
  };

  const handleIngredientModalClose = () => {
    setShowIngredientModal(false);
    setIngredientFormData({
      ingredient: "",
      quantity: "",
      measurement: "",
    });
  };

  const handleSaveIngredient = () => {
    setFormData((prevData) => {
      const ingredientExists = prevData.ingredients.some(
        (ingredient) => ingredient._id === ingredientFormData._id
      );

      if (ingredientExists) {
        // Update the existing ingredient
        return {
          ...prevData,
          ingredients: prevData.ingredients.map((ingredient) =>
            ingredient._id === ingredientFormData._id
              ? ingredientFormData
              : ingredient
          ),
        };
      } else {
        // Add a new ingredient
        return {
          ...prevData,
          ingredients: [...prevData.ingredients, ingredientFormData],
        };
      }
    });

    setShowIngredientModal(false);
    setIngredientFormData({
      ingredient: "",
      quantity: "",
      measurement: "",
    });
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      ingredients: updatedIngredients,
    }));
  };

  const handleDeleteInstruction = (index) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions.splice(index, 1);
    setFormData((prevData) => ({
      ...prevData,
      instructions: updatedInstructions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("description", formData.description);
    formDataToSubmit.append("category_id", formData.categoryId);
    formDataToSubmit.append("writer_id", user?.id);
    formDataToSubmit.append("is_premium", Boolean(formData.is_premium));
    formDataToSubmit.append(
      "ingredients",
      JSON.stringify(formData.ingredients)
    );
    formDataToSubmit.append(
      "instructions",
      JSON.stringify(formData.instructions)
    );
    formDataToSubmit.append("image", formData.image);

    try {
      await api.put("/recipes/" + recipeId, formDataToSubmit, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/recipe-writer/my-recipes"); // Redirect to recipe list page after successful creation
    } catch (error) {
      console.error("Failed to update recipe:", error);
    }
  };

  console.log(formData);

  return (
    <Container style={{ paddingLeft: "30%" }}>
      <h1 className="my-4">Update Recipe</h1>
      <Form style={{ width: "70%" }} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Select
          name="category"
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({
              ...formData,
              categoryId: e.target.value,
            })
          }
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => {
            return <option value={category._id}>{category.name}</option>;
          })}
        </Form.Select>
        <Form.Group controlId="is_premium" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Is Premium"
            name="is_premium"
            checked={formData.is_premium}
            onChange={handleChange}
          />
        </Form.Group>
        <br />

        <Form.Group className="mb-3" controlId="ingredients">
          <Form.Label>Ingredients</Form.Label>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Ingredient</th>
                <th>Quantity</th>
                <th>Measurement</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.ingredients.map((ingredient, index) => (
                <tr key={index}>
                  <td>{ingredient.ingredient}</td>
                  <td>{ingredient.quantity}</td>
                  <td>{ingredient.measurement}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => handleEditIngredient(ingredient)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteIngredient(index)}
                      style={{
                        backgroundColor: "#dc3545",
                        borderColor: "#dc3545",
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button variant="secondary" onClick={handleAddIngredient}>
            Add Ingredient
          </Button>
        </Form.Group>
        <Form.Group className="mb-3" controlId="instructions">
          <Form.Label>Instructions</Form.Label>
          {formData.instructions.map((instruction, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <CustomInput
                as="textarea"
                rows={3}
                placeholder={`Step ${index + 1}`}
                name={`instruction-${index}`}
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e)}
                required
                isValid={true}
                style={{ width: "100%", marginRight: "10px" }} // Adjusted width and added margin to the right
              />
              <Button
                variant="danger"
                onClick={() => handleDeleteInstruction(index)}
                style={{
                  width: "30%",
                  backgroundColor: "#dc3545",
                  borderColor: "#dc3545",
                  marginTop: 16,
                }}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button variant="secondary" onClick={handleAddInstruction}>
            Add Instruction
          </Button>
        </Form.Group>
        <Form.Group controlId="image" className="mb-3">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            type="file"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
          />
        </Form.Group>
        <br />
        <Button style={{ marginBottom: 30 }} variant="primary" type="submit">
          Update Recipe
        </Button>
        <br />
      </Form>

      {/* Ingredient Modal */}
      <Modal show={showIngredientModal} onHide={handleIngredientModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Ingredient</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CustomInput
            label="Name"
            name="name"
            isValid={true}
            value={ingredientFormData.ingredient}
            onChange={(e) =>
              setIngredientFormData({
                ...ingredientFormData,
                ingredient: e.target.value,
              })
            }
            required
          />
          <CustomInput
            label="Quantity"
            name="quantity"
            value={ingredientFormData.quantity}
            onChange={(e) =>
              setIngredientFormData({
                ...ingredientFormData,
                quantity: e.target.value,
              })
            }
            required
            isValid={true}
          />
          <Form.Label>
            <b>Measurement</b>
          </Form.Label>
          <Form.Select
            name="measurement"
            value={ingredientFormData.measurement}
            onChange={(e) =>
              setIngredientFormData({
                ...ingredientFormData,
                measurement: e.target.value,
              })
            }
            required
          >
            <option value="">Select Measurement</option>
            {measurements.map((measurement) => (
              <option key={measurement.value} value={measurement.value}>
                {measurement.text}
              </option>
            ))}
          </Form.Select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleIngredientModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveIngredient}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RecipeUpdate;
