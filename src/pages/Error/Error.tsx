import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

function Error() {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <div>
        {(isRouteErrorResponse(error) && (
          <p>
            {error.status} {error.statusText}
          </p>
        )) || <p>Error message unknown!</p>}
      </div>
    </div>
  );
}

export default Error;
