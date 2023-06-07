import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import React, { FormEvent, useEffect, useState } from "react";
import { Col, Container, Form, Navbar, Row } from "react-bootstrap";

import { Button } from "../../src/components/Button";
import { logger, toast, TOAST_ERROR, TOAST_INFO } from "../../src/utils";
import styles from "./index.module.scss";

function Login({ isAuthChecking }: { isAuthChecking: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [email, setEmail] = useState<string>("");
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!isAuthChecking && user) {
      router.push("/");
      return;
    }
  }, [user, isAuthChecking]);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    // TODO: convert to use react-query
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
    <>
      <NextSeo title="personal finance companionship" />
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
              priority
              height={140}
              width={200}
            />
          </Navbar.Brand>
        </Navbar>

        <div className="text-tertiary text-center">
          <h5>Sign in to speak to Sera 🌅</h5>
          <h6 className="mt-4">your personal finance companion</h6>
        </div>
        <Container className="d-flex align-items-center justify-content-center mt-4">
          <Col lg={4} md={3} sm={2} />
          <Col className="d-flex flex-column align-items-center justify-content-center">
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
            <Link className={`${styles.link} mt-4`} href="/">
              <small>Or continue without signing in</small>
            </Link>
          </Col>
          <Col lg={4} md={3} sm={2} />
        </Container>
      </Row>
    </>
  );
}

export default Login;
