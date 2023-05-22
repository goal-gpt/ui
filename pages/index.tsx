import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { ChatBox } from "../src/components/Chat";
import { Database } from "../src/types/database";

function Main() {
  const supabaseClient = useSupabaseClient<Database>();
  const user = useUser();
  const router = useRouter();

  const [chats, setChats] = useState<
    Database["public"]["Tables"]["chat"]["Row"][]
  >([]);

  useEffect(() => {
    async function fetchData() {
      if (user) {
        const { data, error } = await supabaseClient.from("chat").select("*");

        if (error) console.error("Error fetching data: ", error);
        else setChats(data);
      } else {
        router.push("/login");
      }
    }
    fetchData();
  }, [user]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={3} md={2} sm={0}>
            {chats.length > 0 ?? chats[0].id}
          </Col>
          <Col lg={6} md={8} sm={12}>
            <ChatBox />
          </Col>
          <Col lg={3} md={2} sm={0} />
        </Row>
      </Container>
    </>
  );
}

export default Main;
