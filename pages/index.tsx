import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import { ChatBox } from "../src/components/Chat";
import { MainHeader } from "../src/components/MainHeader";

function Main() {
  return (
    <>
      <MainHeader />
      <Container>
        <Row>
          <Col md={3} />
          <Col>
            <ChatBox />
          </Col>
          <Col md={3} />
        </Row>
      </Container>
    </>
  );
}

export default Main;
