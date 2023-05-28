import React from "react";
import { Col, Row, Spinner } from "react-bootstrap";

export function Loading() {
  return (
    <Row
      className="justify-content-center my-3"
      style={{ maxWidth: "100%", overflowX: "hidden" }}
    >
      <Col className="text-center">
        <Spinner animation="grow" size="sm" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    </Row>
  );
}
