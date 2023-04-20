import "./Signup.scss";

import React, { FormEvent, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

import { Button } from "../../components/Button";
import { MainHeader } from "../../components/MainHeader";
// import { supabase } from "../../services/supabase";

function Signup() {
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    // const { error } = await supabase.auth.signInWithOtp({ email });

    // if (error) {
    //   alert(error.message);
    // } else {
    //   alert("Check your email for the signup link!");
    // }
    setLoading(false);
  };

  return (
    <Container className="Signup">
      <MainHeader />
      <Row>
        <Col>
          <h1>Sign up</h1>
          <Form onSubmit={handleSignup}>
            <Form.Group controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Signup"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Signup;
