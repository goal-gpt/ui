import type { ChangeEvent, FormEvent } from "react";
import React, { useState } from "react";
import {
  Col,
  Container,
  FloatingLabel,
  Form,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  HandThumbsDown,
  HandThumbsDownFill,
  HandThumbsUp,
  HandThumbsUpFill,
} from "react-bootstrap-icons";

import { logger, sendEmailJS, toast, TOAST_SUCCESS } from "../../utils";
import { Button } from "../Button";
import styles from "./FeedbackForm.module.scss";

export interface FeedbackFormProps {
  quiz: string | undefined;
}

type Rating = "up" | "down" | "none";

interface FormData {
  rating: Rating;
  comments: string;
  email: string;
}

interface ThumbIconProps {
  IconComponent: typeof HandThumbsUp | typeof HandThumbsDown;
  FillIconComponent: typeof HandThumbsUpFill | typeof HandThumbsDownFill;
  currentRating: Rating;
  rating: Rating;
  onClick: (rating: Rating) => void;
  size: number;
}

function ThumbIcon({
  IconComponent,
  FillIconComponent,
  currentRating,
  rating,
  onClick,
  size,
}: ThumbIconProps) {
  return currentRating === rating ? (
    <FillIconComponent
      onClick={() => onClick("none")}
      size={size}
      role="button"
      aria-label={`hand-thumbs-${rating}-fill`}
      color="#180de9" // TODO: use a variable
    />
  ) : (
    <IconComponent
      onClick={() => onClick(rating)}
      size={size}
      role="button"
      aria-label={`hand-thumbs-${rating}`}
    />
  );
}

export function FeedbackForm() {
  // TODO: when we have static plans, add the plan ID to this feedback form
  const [formData, setFormData] = useState<FormData>({
    rating: "none",
    comments: "",
    email: "",
  });
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const THUMB_SIZE = 32;

  // Event handlers
  // TODO: convert to use react-query
  const sendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await sendEmailJS({ ...formData });
      logger.info("Successfully sent feedback", response.status, response.text);
      setFormData({ rating: "none", comments: "", email: "" });
      setShow(false);
      toast("Thank you for your feedback!", { type: TOAST_SUCCESS });
    } catch (err) {
      logger.info("Failed to send feedback...", err);
    } finally {
      setLoading(false);
    }
  };

  const handleThumbClick = (rating: Rating) => {
    setFormData({ ...formData, rating });
  };

  const handleCommentsChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, comments: event.target.value });
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: event.target.value });
  };

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  return (
    <div className="my-2">
      <Button variant="quaternary" onClick={handleShow}>
        Share your feedback!
      </Button>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Feedback Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className={`${styles.formBox}`} onSubmit={sendEmail}>
            <Container>
              <h5>
                How have you found <b className="text-secondary">eras</b>?
              </h5>
              <Form.Group>
                <Row className="my-3">
                  <Col lg={2} md={1} sm={0} />
                  <Col className="d-flex align-items-center justify-content-center">
                    <ThumbIcon
                      IconComponent={HandThumbsUp}
                      FillIconComponent={HandThumbsUpFill}
                      currentRating={formData.rating}
                      rating="up"
                      onClick={handleThumbClick}
                      size={THUMB_SIZE}
                    />
                  </Col>
                  <Col className="d-flex align-items-center justify-content-center">
                    <ThumbIcon
                      IconComponent={HandThumbsDown}
                      FillIconComponent={HandThumbsDownFill}
                      currentRating={formData.rating}
                      rating="down"
                      onClick={handleThumbClick}
                      size={THUMB_SIZE}
                    />
                  </Col>
                  <Col lg={2} md={1} sm={0} />
                </Row>
              </Form.Group>
              <Form.Group>
                <FloatingLabel
                  controlId="feedback-comments"
                  label="Share any comments..."
                >
                  <Form.Control
                    type="text"
                    name="comments"
                    value={formData.comments}
                    onChange={handleCommentsChange}
                    placeholder="Your comments here"
                    role="textbox"
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="mt-2">
                <FloatingLabel controlId="email" label="...and your email!">
                  <Form.Control
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    role="textbox"
                  />
                </FloatingLabel>
              </Form.Group>
              <Button
                className="mt-3"
                variant="secondary"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Spinner animation="border" role="status" size="sm" />
                ) : (
                  "Submit"
                )}
              </Button>
            </Container>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
