import "./Main.scss";

import React from "react";
import { Container } from "react-bootstrap";

import { CardList } from "../../components/Card";
import { MainHeader } from "../../components/MainHeader";
import { cardItemData } from "../../services/cardItemData";

function Main() {
  return (
    <div className="main" role="main">
      <MainHeader />
      <Container>
        <CardList cardItemData={cardItemData} />
      </Container>
    </div>
  );
}

export default Main;
