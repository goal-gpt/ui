import "./Profile.scss";

import React from "react";

import { MainHeader } from "../../components/MainHeader";

function Profile() {
  return (
    <>
      <MainHeader />
      <div className="profile">
        <p>Your lovely profile is here!</p>
      </div>
    </>
  );
}

export default Profile;
