import Link from "next/link";
import React from "react";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";

export function MainHeader() {
  return (
    <Navbar bg="white" variant="white" className="mb-4" role="navigation">
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
        <Navbar.Collapse
          id="mainheader-nav"
          className="justify-content-end"
        ></Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
