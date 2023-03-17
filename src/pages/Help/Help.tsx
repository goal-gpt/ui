import "./Help.scss";

import React from "react";
import { Container } from "react-bootstrap";

import { MainHeader } from "../../components/MainHeader";

function Help() {
  return (
    <div className="help">
      <MainHeader />
      <Container>
        <p>Get your help here!</p>
      </Container>
    </div>
  );
}

export default Help;
