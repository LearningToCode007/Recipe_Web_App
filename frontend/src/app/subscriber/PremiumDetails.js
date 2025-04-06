import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import api from "../utils/api"; // Ensure the correct path to your api utility
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import moment from "moment"; // For date formatting

const premiumFeatures = [
  {
    title: "Exclusive Recipes",
    description: "Access to premium and exclusive recipes.",
    icon: "🍽️",
  },
  {
    title: "Early Access",
    description: "Get early access to new features and content.",
    icon: "⏰",
  },
];

const PremiumDetails = () => {
  const { user } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [premiumEndDate, setPremiumEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const response = await api.get(
          `/subscriptions/check-subscription/${user.id}`
        );
        setIsPremium(response.data?.subscription_status);
        setPremiumEndDate(response.data?.end_date);
        setLoading(false);
      } catch (error) {
        setError("Failed to load subscription status.");
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, [user.id]);

  const handleBuyPremium = () => {
    if (!isAuthenticated()) {
      navigate("/login");
    } else {
      navigate(`/recipes/buy-premium`);
    }
  };

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
    <Container className="my-5">
      {isPremium ? (
        <>
          <Row className="justify-content-center">
            <Col md={8} className="text-center">
              <h1>Premium Subscription</h1>
              <p className="lead">
                Thank you for being a premium subscriber! Enjoy these exclusive
                features:
              </p>
              <p className="text-success">
                Your premium subscription is active until{" "}
                {moment(premiumEndDate).format("MMMM Do, YYYY")}.
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center mt-4">
            {premiumFeatures.map((feature, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div
                      className="text-center mb-3"
                      style={{ fontSize: "2rem" }}
                    >
                      {feature.icon}
                    </div>
                    <Card.Title className="text-center">
                      {feature.title}
                    </Card.Title>
                    <Card.Text className="text-center">
                      {feature.description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <h1>Premium Subscription</h1>
            <p className="lead">
              Unlock all the exclusive features and enjoy a premium experience.
            </p>
            <Button onClick={handleBuyPremium} variant="primary" size="lg">
              Subscribe Now
            </Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default PremiumDetails;
