import { useSupabaseClient } from "@supabase/auth-helpers-react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Container, Dropdown, DropdownButton, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";

import styles from "./Header.module.scss";

export function Header() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const handleSignout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) console.error("Error signing out: ", error);
    router.push("/login");
  };

  return (
    <Container className="d-flex flex-column">
      <Row className={`${styles.navbar}`}>
        <Navbar
          variant="white"
          className="d-flex flex-column justify-content"
          role="navigation"
        >
          <Navbar.Brand as={Link} className="align-self-center" href="/">
            <Image
              alt="eras logo: yellow lines gradually reaching the horizon"
              className="d-inline-block align-top"
              src="/eras-logo.png"
              height="95px"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="header-nav" />
          <Navbar.Collapse
            id="header-nav"
            className="justify-content-end"
          ></Navbar.Collapse>
        </Navbar>
      </Row>
      <Row className="mt-5">
        <DropdownButton
          drop="up"
          variant="primary-light"
          id="profile-dropdown"
          title="Your profile"
          className={`${styles.profileButton} d-flex flex-column align-items-center`}
          onSelect={(e: string | null) => {
            if (e === "1") {
              handleSignout();
            }
          }}
        >
          <Dropdown.Item eventKey={1} href="#">
            Sign out
          </Dropdown.Item>
        </DropdownButton>
      </Row>
    </Container>
  );
}
