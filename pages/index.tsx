import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { ChatBox } from "../src/components/Chat";
import { Header } from "../src/components/Header";
import { Plan } from "../src/components/Plan";
import { Database } from "../src/types/database";

function Main() {
  const supabaseClient = useSupabaseClient<Database>();
  const user = useUser();
  const router = useRouter();
  const { q: queryParam } = router.query || { q: "" };
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam || "";

  const [chats, setChats] = useState<
    Database["public"]["Tables"]["chat"]["Row"][]
  >([]);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const { data, error } = await supabaseClient.from("chat").select("*");

        if (error) {
          console.error("Error fetching data: ", error);
        } else {
          setChats(data);
        }
      }
    }

    fetchData();
  }, [user]);

  return (
    <>
      <NextSeo title="your personal finance companion" />
      <Container fluid>
        <Row>
          <Col md={2} sm={0} className={`d-none d-md-flex navbarContainer`}>
            <Header />
            <div>{chats && chats.length > 0 && "chats"}</div>
          </Col>
          {/* <Col md={1} sm={0} className="d-none d-md-flex" /> */}
          <Col
            md={6}
            sm={12}
            className="d-flex flex-column justify-content-between"
          >
            <ChatBox query={query} />
          </Col>
          <Col md={4} sm={0} className="d-none d-md-flex">
            <Plan />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Main;
