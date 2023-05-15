import React from "react";
import { Col, Row } from "react-bootstrap";

import { MainHeader } from "../src/components/MainHeader";

function Main() {
  return (
    <div className="main" role="main">
      <MainHeader />
      <Row>
        <Col md={3} xs={1} />
        <Col></Col>
        <Col md={3} xs={1} />
      </Row>
    </div>
  );
}

export default Main;
