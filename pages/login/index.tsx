import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Container, Navbar, Row } from "react-bootstrap";

// const logo = "/eras-logo.png";
// import logo from "/eras-logo.png";

function Login() {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const user = useUser();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      router.push("/");
      return;
    }
    setLoading(false);
    const passwordLabel = document.querySelector(
      "label[for=password].supabase-auth-ui_ui-label"
    ) as HTMLLabelElement;
    if (passwordLabel) {
      passwordLabel.innerHTML = "Your password";
    }
  }, []);
  if (loading) return <></>;

  return (
    <>
      <Navbar
        variant="white"
        className="d-flex flex-column justify-content"
        role="navigation"
      >
        <Navbar.Brand as={Link} className="align-self-center" href="/">
          <Image
            alt="eras logo: yellow lines gradually reaching the horizon"
            className="d-inline-block align-top"
            src={"/eras-logo.png"}
            height={140}
            width={200}
          />
        </Navbar.Brand>
      </Navbar>

      <Container>
        <Row className="mt-3">
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
