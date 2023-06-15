import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import { ChatForm } from "../src/components/Chat";
import { Plan } from "../src/components/Plan";

function Main() {
  const router = useRouter();
  const { q: queryParam } = router.query || { q: "" };
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam || "";

  return (
    <>
      <NextSeo title="your personal finance companion" />
      <Container fluid>
        <Row>
          <Col md={3} sm={0} className={`d-none d-md-flex`}></Col>
          <Col
            md={6}
            sm={12}
            className="d-flex flex-column justify-content-between"
          >
            <Plan />
            <ChatForm query={query} />
          </Col>
          <Col md={3} sm={0} className="d-none d-md-flex"></Col>
        </Row>
      </Container>
    </>
  );
}

export default Main;
