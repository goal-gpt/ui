import React from "react";
import CookieConsent from "react-cookie-consent";

export function Cookie() {
  return (
    // TODO: implement onHover for the button
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="erasConsent"
      containerClasses="bg-neutral-light text-neutral-light-contrast"
      contentClasses="mx-4"
      buttonClasses="bg-primary text-primary-contrast px-4 mx-4 w-24"
      expires={150}
      style={{ fontSize: "0.95rem" }}
    >
      This website uses cookies and storage to help you with your financial
      journey. By using this website, you agree to our use of cookies and
      storage.
    </CookieConsent>
  );
}
