import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import { ChatBox } from "../src/components/Chat";
import { Header } from "../src/components/Header";
import { Loading } from "../src/components/Loading";
import { Database } from "../src/types/database";

function Main({ isAuthChecking }: { isAuthChecking: boolean }) {
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

        if (error) {
          console.error("Error fetching data: ", error);
        } else {
          setChats(data);
        }
      }
    }

    fetchData();
  }, [user]);

  useEffect(() => {
    if (!isAuthChecking && !user) {
      router.push("/login");
    }
  }, [user, isAuthChecking]);
  if (isAuthChecking || !user) return <Loading />;

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={3} sm={0} className={`d-none d-md-flex navbarContainer`}>
            <Header />
            <div>{chats && chats.length > 0 && "chats"}</div>
          </Col>
          <Col
            md={6}
            sm={12}
            className="d-flex flex-column h-100 justify-content-between"
          >
            <ChatBox />
          </Col>
          <Col md={3} sm={0} className="d-none d-md-flex" />
        </Row>
      </Container>
    </>
  );
}

export default Main;
