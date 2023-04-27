import "./Login.scss";

import React, { FormEvent, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import { Button } from "../../components/Button";
import { MainHeader } from "../../components/MainHeader";
import { supabase } from "../../services/supabase";
import {
  logger,
  toast,
  TOAST_ERROR,
  TOAST_INFO,
  useNavigate,
} from "../../utils";
import { useAuth } from "./RequireAuth";

function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const { session } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: process.env.LOGIN_REDIRECT_URL },
    });

    if (error) {
      logger.error(error.message);
      toast("Something went wrong! Please try again later.", {
        type: TOAST_ERROR,
      });
    } else {
      toast("Check your email for the login link!", { type: TOAST_INFO });
    }
    setLoading(false);
  };

  if (session) {
    // Redirect to profile if already logged in
    navigate("/profile");
  }

  return (
    <>
      <MainHeader />
      <Row className="mb-3">
        <Row>
          <h4 className="text-secondary text-center mb-5">eras</h4>
        </Row>
        <Row className="">
          <h1 className="text-center">Sign in</h1>
        </Row>
        <Row className="">
          <h4 className="text-center">to a new era</h4>
        </Row>
      </Row>
      <Container className="d-flex align-items-center justify-content-center">
        <Col lg={3} md={2} sm={1} />
        <Col>
          <Row className="d-flex align-items-center justify-content-center">
            <Form onSubmit={handleLogin} className="w-75">
              <Form.Group controlId="email" className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="inputField"
                  required
                />
              </Form.Group>
              <Button type="submit" disabled={loading}>
                {loading ? "Loading..." : "Get Magic Link!"}
              </Button>
            </Form>
          </Row>
        </Col>
        <Col lg={3} md={2} sm={1} />
      </Container>
    </>
  );
}

export default Login;
