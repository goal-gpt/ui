import "./MainHeader.scss";

import React from "react";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

import LoginToggle from "../LoginToggle/LoginToggle";

export function MainHeader() {
  return (
    <Navbar bg="light" variant="light" className="mb-4" role="navigation">
      <Container>
        <Navbar.Brand as={Link} to="/">
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
            <Nav.Link as={Link} id="nav-home" to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} id="nav-help" to="/help">
              Help
            </Nav.Link>
            <Nav.Link as={Link} id="nav-profile" to="/profile">
              Profile
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <LoginToggle />
      </Container>
    </Navbar>
  );
}
