import { useState, useEffect } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import useAxios from "../hooks/useAxios";

const LoginForm = ({ onLoginSuccess }) => {
  const loginApi = useAxios();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
    loginApi.fetchData({
      url: "api/auth/login",
      method: "POST",
      data: { email, password },
    });
  };

  useEffect(() => {
    if (loginApi.response) {
      console.log("Login Response:", loginApi.response);
      localStorage.setItem("user", JSON.stringify(loginApi.response.user));
      localStorage.setItem("token", loginApi.response.token);
      //   window.location.reload();
      onLoginSuccess(loginApi.response.user);
    }
  }, [loginApi.response]);

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "400px" }} className="p-4 shadow">
        <h3 className="text-center mb-4">Login</h3>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mb-4">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default LoginForm;
