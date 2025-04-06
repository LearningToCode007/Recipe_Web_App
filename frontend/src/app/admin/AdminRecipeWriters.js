import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Alert,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import api from "../utils/api";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";

const AdminRecipeWriters = () => {
  const [writers, setWriters] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchWriters();
  }, []);

  const fetchWriters = async () => {
    try {
      const response = await api.get("/recipe-writers");
      setWriters(response.data);
    } catch (error) {
      console.error("Failed to fetch writers:", error);
      setError("Failed to fetch writers. Please try again.");
    }
  };

  const handleStatusChange = async (writerId, newStatus) => {
    try {
      await api.put(`/recipe-writers/${writerId}`, { status: newStatus });
      setSuccess(`Writer ${writerId} has been ${newStatus.toLowerCase()}.`);
      setWriters((prevWriters) =>
        prevWriters.map((writer) =>
          writer._id === writerId ? { ...writer, status: newStatus } : writer
        )
      );
    } catch (error) {
      console.error("Failed to update writer status:", error);
      setError("Failed to update writer status. Please try again.");
    }
  };

  const handleViewRecipes = async (writerId) => {
    navigate(`/admin/recipe-writers/${writerId}/view-recipes`);
  };

  return (
    <Container>
      <h2 className="my-4">Recipe Writers List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Compensation</th>
            <th>Subscription Start Date</th>
            <th>Subscription End Date</th>
            <th>Subscription Status</th>
            <th>Status</th>
            <th>Action</th>
            <th>Recipes</th>
          </tr>
        </thead>
        <tbody>
          {writers.map((writer) => (
            <tr key={writer._id}>
              <td>
                {writer.first_name} {writer.last_name}
              </td>
              <td>{writer.email}</td>
              <td>${writer.compensation_balance}</td>
              <td>
                {writer.subscription
                  ? new Date(
                      writer.subscription.start_date
                    ).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {writer.subscription
                  ? new Date(writer.subscription.end_date).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {writer.subscription
                  ? writer.subscription.subscription_status
                  : "No Subscription"}
              </td>
              <td>{writer.status}</td>
              <td>
                {writer.status === "Pending" ? (
                  <DropdownButton
                    id={`dropdown-${writer._id}`}
                    title="Change Status"
                    onSelect={(eventKey) =>
                      handleStatusChange(writer._id, eventKey)
                    }
                  >
                    <Dropdown.Item eventKey="Approved">Approve</Dropdown.Item>
                    <Dropdown.Item eventKey="Rejected">Reject</Dropdown.Item>
                  </DropdownButton>
                ) : (
                  "None"
                )}
              </td>
              <td>
                <Button
                  onClick={() => handleViewRecipes(writer._id)}
                  variant="primary"
                >
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminRecipeWriters;
