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
          <Col md={2} sm={0} />
          <Col md={8} sm={12}>
            <ChatBox />
          </Col>
          <Col md={2} sm={0} />
        </Row>
      </Container>
    </>
  );
}

export default Main;
