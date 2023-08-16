import { useUser } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import Script from "next/script";
import { createElement } from "react";

export const SubscribeForm = () => {
  const user = useUser();
  const router = useRouter();

  if (!user) {
    return (
      <>
        <p>You need to login to subscribe.</p>
        <button onClick={() => router.push(`/login`)}>Go to login</button>
      </>
    );
  }

  return (
    <>
      <Script async src="https://js.stripe.com/v3/buy-button.js"></Script>
      <div className="mt-1.5">
        {/* {createElement("stripe-buy-button", {
          "buy-button-id": "buy_btn_1NfqbLIZjiI9A9sbV8lI7Tas",
          "publishable-key":
            "pk_live_51MU39nIZjiI9A9sbd4nUdnSrnP4CTP3Jq7xbbzxZrmLq97c9T2uNvJ0Y1nU8oaqQ8QOCzNyoPAVY28QGO68ACjRK005eMRSBOv",
          "customer-email": user.email,
        })} */}
        {createElement("stripe-buy-button", {
          "buy-button-id": "buy_btn_1Nfr7RIZjiI9A9sbjyYt92qf",
          "publishable-key":
            "pk_test_51MU39nIZjiI9A9sbYTt8kca36ijB0Kxs3DVY2trWbGz56ZvaLAlWB6VYK7ai0gh0wN7Za0F0Uilheo7D9N4gnnTO00wpRJdeZM",
          "customer-email": user.email,
        })}
      </div>
    </>
  );
};
