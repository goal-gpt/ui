import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { Col, Container, Form, Navbar, Row } from "react-bootstrap";

import { Button } from "../../src/components/Button";
import { logger, toast, TOAST_ERROR, TOAST_INFO } from "../../src/utils";

function Login() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState<string>("");
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user) {
      router.push("/");
      return;
    }
  }, [user]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });

    if (error) {
      logger.error(error.message);
      toast(`${error.message}`, {
        type: TOAST_ERROR,
      });
      setStatus("idle");
    } else {
      toast("Check your email for the login link!", { type: TOAST_INFO });
      setStatus("success");
    }
  };

  return (
    <Row
      className="align-items-center align-content-center"
      style={{ height: "70vh" }}
    >
      <Navbar
        variant="white"
        className="d-flex flex-column justify-content"
        role="navigation"
      >
        <Navbar.Brand as={Link} className="align-self-center" href="/">
          <Image
            alt="eras logo: yellow lines gradually reaching the horizon"
            className="d-inline-block align-top"
            src={"/eras-logo.png"}
            height={140}
            width={200}
          />
        </Navbar.Brand>
      </Navbar>

      <div className="text-tertiary text-center">
        Sign in to speak to Sera, your personal finance companion
      </div>
      <Container className="d-flex align-items-center justify-content-center mt-4">
        <Col lg={4} md={3} sm={2} />
        <Col className="d-flex align-items-center justify-content-center">
          <Form onSubmit={handleLogin} className="w-75" role="form">
            <Form.Group controlId="email" className="mb-3">
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="inputField"
                required
              />
            </Form.Group>
            <Button type="submit" disabled={status !== "idle"}>
              {status === "loading"
                ? "Loading..."
                : status === "idle"
                ? "Get your login link"
                : "Check your email!"}
            </Button>
          </Form>
        </Col>
        <Col lg={4} md={3} sm={2} />
      </Container>
    </Row>
  );
}

export default Login;
