import "./Profile.scss";

import React from "react";
import { Container } from "react-bootstrap";

import { MainHeader } from "../../components/MainHeader";

function Profile() {
  return (
    <>
      <MainHeader />
      <Container>
        <p>Your lovely profile is here!</p>
      </Container>
    </>
  );
}

export default Profile;
