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

const AdminSubscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await api.get("/subscriptions");
      const response = await api.get("/subscribers");
      setSubscribers(response.data);
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
      setError("Failed to fetch subscribers. Please try again.");
    }
  };

  const handleStatusChange = async (subscriberId, newStatus) => {
    try {
      await api.put(`/subscribers/${subscriberId}`, { status: newStatus });
      setSuccess(
        `Subscriber ${subscriberId} has been ${newStatus.toLowerCase()}.`
      );
      setSubscribers((prevSubscribers) =>
        prevSubscribers.map((subscriber) =>
          subscriber._id === subscriberId
            ? {
                ...subscriber,
                subscription: {
                  ...subscriber.subscription,
                  subscription_status: newStatus,
                },
              }
            : subscriber
        )
      );
    } catch (error) {
      console.error("Failed to update subscriber status:", error);
      setError("Failed to update subscriber status. Please try again.");
    }
  };

  return (
    <Container>
      <h2 className="my-4">Subscribers List</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subscription Start Date</th>
            <th>Subscription End Date</th>
            <th>Subscription 1 year</th>
            <th>Subscription Status</th>
            <th>Subscription Amount</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((subscriber) => (
            <tr key={subscriber._id}>
              <td>
                {subscriber.first_name} {subscriber.last_name}
              </td>
              <td>{subscriber.email}</td>
              <td>
                {subscriber.subscription
                  ? new Date(
                      subscriber.subscription.start_date
                    ).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {subscriber.subscription
                  ? new Date(
                      subscriber.subscription.end_date
                    ).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {subscriber.subscription
                  ? subscriber.subscription.subscription_status
                  : "No Subscription"}
              </td>
              <td>
                {subscriber.subscription &&
                subscriber.subscription.subscription_status === "Pending" ? (
                  <DropdownButton
                    id={`dropdown-${subscriber._id}`}
                    title="Change Status"
                    onSelect={(eventKey) =>
                      handleStatusChange(subscriber._id, eventKey)
                    }
                    style={{ backgroundColor: "#3498db", color: "white" }}
                  >
                    <Dropdown.Item
                      eventKey="Approved"
                      style={{ backgroundColor: "#3498db", color: "white" }}
                    >
                      Approve
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="Rejected"
                      style={{ backgroundColor: "#3498db", color: "white" }}
                    >
                      Reject
                    </Dropdown.Item>
                  </DropdownButton>
                ) : subscriber.subscription ? (
                  subscriber.subscription.subscription_status
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                <>
                  {subscriber.subscription?.subscription_status === "Active"
                    ? "$100"
                    : "N/A"}
                </>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminSubscribers;
