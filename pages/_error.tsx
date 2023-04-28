import { NextPageContext } from "next";
import React from "react";
import { Container } from "react-bootstrap";

import { MainHeader } from "../src/components/MainHeader";

interface ErrorProps {
  statusCode?: number;
  message?: string;
}

function Error({ statusCode, message }: ErrorProps) {
  return (
    <div id="error-page">
      <MainHeader />
      <Container>
        <h1>Oops!</h1>
        {message ? (
          <p>{message}</p>
        ) : (
          <p>Sorry, an unexpected error has occurred.</p>
        )}
        {statusCode && <p>Error code: {statusCode}</p>}
      </Container>
    </div>
  );
}

Error.defaultProps = {
  statusCode: undefined,
  message: undefined,
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  let code: number;
  if (res) {
    code = res.statusCode;
  } else if (err) {
    code = err.statusCode || 404;
  } else {
    code = 404;
  }

  const message = err ? err.message : undefined;
  return { statusCode: code, message };
};

export default Error;