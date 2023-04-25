import "./MainHeader.module.scss";

import Link from "next/link";
import React from "react";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// import { Link } from "react-router-dom";

export function MainHeader() {
  return (
    <Navbar bg="light" variant="light" className="mb-4" role="navigation">
      <Container>
        <Navbar.Brand as={Link} href="/">
          <Image
            alt="eras logo: yellow lines gradually reaching the horizon"
            className="d-inline-block align-top"
            src="/eras-logo.png"
            height="50px"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="mainheader-nav" />
        <Navbar.Collapse id="mainheader-nav" className="justify-content-end">
          <Nav className="me-auto">
            <Nav.Link as={Link} id="nav-home" href="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} id="nav-help" href="/help">
              Help
            </Nav.Link>
            <Nav.Link as={Link} id="nav-profile" href="/profile">
              Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
