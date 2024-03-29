import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Container, Dropdown, DropdownButton, Row } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";

import { logger } from "@/utils";

import { Logo } from "../Logo/Logo";
import styles from "./Header.module.scss";

export function Header() {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const handleSignout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) logger.error("Error signing out: ", error);
  };

  const handleSignin = async () => {
    router.push("/login");
  };

  return (
    <Container className={`${styles.navContainer}`}>
      <Row className={`${styles.navbar}`}>
        <Navbar
          variant="white"
          className="d-flex flex-column justify-content"
          role="navigation"
        >
          <Navbar.Brand as={Link} className="align-self-center" href="/">
            <Logo />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="header-nav" />
          <Navbar.Collapse
            id="header-nav"
            className="justify-content-end"
          ></Navbar.Collapse>
        </Navbar>
      </Row>
      <Row className="my-4">
        <DropdownButton
          drop="up"
          variant="primary-light"
          id="profile-dropdown"
          title="Your profile"
          className={`${styles.profileButton} d-flex flex-column align-items-center`}
          onSelect={(e: string | null) => {
            if (e === "1") {
              if (user) {
                handleSignout();
              } else {
                handleSignin();
              }
            }
          }}
        >
          <Dropdown.Item as={Link} eventKey={1} href="#" id="signin">
            {user ? "Sign out" : "Sign in"}
          </Dropdown.Item>
        </DropdownButton>
      </Row>
    </Container>
  );
}
