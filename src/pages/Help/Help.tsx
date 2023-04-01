import "./Help.scss";

import React from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";

import { MainHeader } from "../../components/MainHeader";

type FAQItem = {
  id: string;
  title: string;
  body: string;
};

const faqs: FAQItem[] = [
  {
    id: "1",
    title: "What is eras?",
    body: "eras is a tool to aid you with your financial literacy journey. Our app aims to make it financial education content fun, targeted and rewarding.\nOur app is currently in beta. If you have any feedback, please email us at eras.fyi@gmail.com!",
  },
  {
    id: "2",
    title: "How do I use eras?",
    body: "To use eras, simply start swiping through our content! If an article interests you, swipe right. If it doesn't, swipe left.\nOnce you swiped right, you will be presented with a quiz. After you've read the article, come back and answer the questions!",
  },
  {
    id: "3",
    title: "How can I see the articles I've attempted before?",
    body: "This is a feature we're working on! We will update the profile page with your progress, attempts and scores.",
  },
  {
    id: "4",
    title: "My answers were correct. How come I was told I was wrong?",
    body: "We're sorry to hear that! We're still in beta, so we're working on improving our quiz questions and answers. If you think a question was buggy, please email us at eras.fyi@gmail.com and we'll look into it.",
  },
  {
    id: "5",
    title: "I have other feedback to share. How can I do that?",
    body: "We'd love to hear from you! Please email us at eras.fyi@gmail.com. Thank you so much for your support!",
  },
  {
    id: "6",
    title: "What is on the roadmap for eras?",
    body: "We're working on adding more content and improving the user experience. We're still working on getting the core features out, which will be required before we start building even cooler features to make learning fun and rewarding. Stay tuned for our updates!",
  },
];

// TODO: this serves as public documentation of our app. Features such as the 'undo' button should be added when they are implemented.
function Help() {
  return (
    <div className="help">
      <MainHeader />
      <Container>
        <Row className="mb-3">
          <Col lg={2} md={1} sm={0} />
          <Col className="d-flex align-items-center justify-content-center">
            <h1>Frequently Asked Questions</h1>
          </Col>
          <Col lg={2} md={1} sm={0} />
        </Row>
        <Row>
          <Col lg={2} md={1} sm={0} />
          <Col>
            <Accordion>
              {faqs.map((item: FAQItem) => {
                return (
                  <Accordion.Item eventKey={item.id}>
                    <Accordion.Header className="text-neutral-dark">
                      {item.title}
                    </Accordion.Header>
                    <Accordion.Body className="text-neutral-light">
                      {item.body}
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          </Col>
          <Col lg={2} md={1} sm={0} />
        </Row>
      </Container>
    </div>
  );
}

export default Help;
