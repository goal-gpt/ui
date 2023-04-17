import React from "react";
import CookieConsent from "react-cookie-consent";

export function Cookie() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      cookieName="erasConsent"
      containerClasses="bg-neutral-light text-neutral-light-contrast"
      contentClasses="mx-4"
      // buttonWrapperClasses="w-100"
      buttonClasses="bg-primary text-primary-contrast px-4 mx-4 w-24"
      expires={150}
    >
      This website uses cookies and Local Storage to store your quizzes, nothing
      else! If you clear your browser&apos;s history then your quizzes will be
      deleted.
    </CookieConsent>
  );
}
