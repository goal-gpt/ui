import React, { ChangeEvent, FormEvent, useState } from "react";
import { Col, FloatingLabel, Form, Row, Spinner } from "react-bootstrap";
import {
  HandThumbsDown,
  HandThumbsDownFill,
  HandThumbsUp,
  HandThumbsUpFill,
} from "react-bootstrap-icons";

import { logger, sendEmailJS } from "../../utils";
import { Button } from "../Button";

export interface FeedbackFormProps {
  quiz: string | undefined;
}

type Rating = "up" | "down" | "none";

interface FormData {
  rating: Rating;
  comments: string;
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

export function FeedbackForm({ quiz }: FeedbackFormProps) {
  const [formData, setFormData] = useState<FormData>({
    rating: "none",
    comments: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const THUMB_SIZE = 32;

  const sendEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await sendEmailJS({ ...formData, quiz });
      logger.info("SUCCESS!", response.status, response.text);
      setFormData({ rating: "none", comments: "" });
    } catch (err) {
      logger.info("FAILED...", err);
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

  return (
    <Form onSubmit={sendEmail}>
      <Form.Group>
        <Row className="mb-3">
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
          label="Share your feedback on this quiz"
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
    </Form>
  );
}
