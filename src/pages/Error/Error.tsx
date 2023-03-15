import React from "react";
import { Container } from "react-bootstrap";
import { useRouteError } from "react-router-dom";

import { MainHeader } from "../../components/MainHeader";

export function Error() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const error: any = useRouteError();

  return (
    <div id="error-page">
      <MainHeader />
      <Container>
        <h1>Oops!</h1>
        {(error && error.message && <p>{error.message}</p>) || (
          <p>Sorry, an unexpected error has occurred.</p>
        )}
        <div>
          {error && error.status && error.statusText && (
            <p>
              {error.status} {error.statusText}
            </p>
          )}
        </div>
      </Container>
    </div>
  );
}
