import Link from "next/link";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
// import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";

export function Header() {
  return (
    <Container fluid>
      <Row>
        <Navbar bg="white" variant="white" role="navigation">
          <Col lg={3} md={2} sm={0} className="d-flex justify-content-center">
            <Navbar.Brand as={Link} className="m-auto" href="/">
              <Image
                alt="eras logo: yellow lines gradually reaching the horizon"
                className="d-inline-block align-top"
                src="/eras-logo.png"
                height="95px"
              />
            </Navbar.Brand>
          </Col>
          <Col lg={6} md={8} sm={12} className="d-flex justify-content-center">
            <Navbar.Toggle aria-controls="header-nav" />
            <Navbar.Collapse
              id="header-nav"
              className="justify-content-end"
            ></Navbar.Collapse>
          </Col>
          <Col lg={3} md={2} sm={0}></Col>
        </Navbar>
      </Row>
    </Container>
  );
}
