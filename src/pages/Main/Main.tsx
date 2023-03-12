import "./Main.scss";

import React from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

import { CardList } from "../../components/Card";
import { MainHeader } from "../../components/MainHeader";

function Main() {
  const { category } = useParams();

  return (
    <div className="main" role="main">
      <MainHeader />
      <Container>
        <CardList category={category || ""} />
      </Container>
    </div>
  );
}

export default Main;
