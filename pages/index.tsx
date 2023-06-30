import Image from "next/image";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import { ChatBox, ChatForm } from "../src/components/Chat";
import { FeedbackForm } from "../src/components/Feedback";
import { Plan } from "../src/components/Plan";
import { Status } from "../src/components/Status";

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
          <Col md={6} sm={12} className="mainContainer">
            <div className="logo d-flex flex-column justify-content-between align-items-center">
              <Image
                alt="eras logo: yellow lines gradually reaching the horizon"
                src="/eras-text-below-logo.svg"
                fill
              />
            </div>
            <div className="flex-grow-2">
              <ChatBox />
            </div>
            <div className="flex-grow-1 overflow-auto my-1">
              <Plan />
              <Status />
            </div>
            <div className="d-flex flex-column">
              <ChatForm query={query} />
              <div className="align-self-center">
                <FeedbackForm />
              </div>
              <div className="align-self-center">
                <p className="my-2 small">
                  Disclaimer: this website's information is for informational
                  purposes only and should not be construed as professional
                  advice.
                </p>
              </div>
            </div>
          </Col>
          <Col md={3} sm={0} className="d-none d-md-flex"></Col>
        </Row>
      </Container>
    </>
  );
}

export default Main;
