import React from "react";
import CookieConsent from "react-cookie-consent";

export function Cookie() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="myAwesomeCookieName2"
      style={{ background: "#2B373B" }}
      buttonStyle={{ color: "#4e503b", fontSize: "13px" }}
      expires={150}
    >
      This website uses cookies to store your quizzes. We don&apos;t use them
      for anything else!
    </CookieConsent>
  );
}
