import React, { useContext } from "react";
import { Col, Row, Spinner } from "react-bootstrap";

import { QueryStatus } from "../../hooks/useChat";
import { ChatContext } from "../Chat";

export function Status() {
  const chatContext = useContext(ChatContext);
  const { chatStatus } = chatContext || {
    chatStatus: QueryStatus.Loading,
  };

  if (chatStatus === QueryStatus.Success || chatStatus === QueryStatus.Idle) {
    return null;
  }

  if (chatStatus === QueryStatus.Error) {
    return (
      <Row className="justify-content-center">
        <Col className="text-center">
          <p className="text-danger">
            Sorry, an error occurred. Please try again!
          </p>
        </Col>
      </Row>
    );
  }

  return (
    <Row
      className="justify-content-center my-3"
      style={{ overflowX: "hidden" }}
    >
      <Col className="text-center">
        <Spinner animation="grow" size="sm" variant="primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Col>
    </Row>
  );
}
