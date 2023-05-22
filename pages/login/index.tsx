import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";

// import { logger, toast, TOAST_ERROR, TOAST_INFO } from "../../src/utils";

// import { Button } from "../../src/components/Button";
function Login() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      <Container>
        <Row className="mt-5">
          <Col xl={4} lg={3} md={2} xs={1} />
          <Col xl={4} lg={6} md={8} xs={10}>
            <Auth
              supabaseClient={supabaseClient}
              providers={["google"]}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: "var(--bs-primary)",
                      brandAccent: "var(--bs-primary-semi-light)",
                      brandButtonText: "var(--bs-primary-contrast)",
                      defaultButtonBackground: "var(--bs-secondary)",
                      defaultButtonBackgroundHover:
                        "var(--bs-secondary-semi-light)",
                      defaultButtonBorder: "transparent",
                      defaultButtonText: "var(--bs-secondary-contrast)",
                      dividerBackground: "var(--bs-tertiary)",
                      inputBackground: "transparent",
                      inputBorder: "silver",
                      inputBorderHover: "gray",
                      inputBorderFocus: "gray",
                      inputText: "var(--bs-neutral-dark)",
                      inputLabelText: "var(--bs-neutral-light)",
                      inputPlaceholder: "gray",
                      messageText: "var(--bs-neutral-dark)",
                      messageTextDanger: "var(--bs-tertiary)",
                      anchorTextColor: "var(--bs-neutral-dark)",
                      anchorTextHoverColor: "gray",
                    },
                    fonts: {
                      bodyFontFamily: `"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
                      buttonFontFamily: `"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
                      inputFontFamily: `"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
                      labelFontFamily: `"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
                    },
                  },
                },
              }}
            />
          </Col>
          <Col xl={4} lg={3} md={2} xs={1} />
        </Row>
      </Container>
    </>
  );
}

export default Login;
