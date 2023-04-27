import dynamic from "next/dynamic";

const CardItem = dynamic(() => import("./CardItem"), {
  ssr: false,
});

export default CardItem;
