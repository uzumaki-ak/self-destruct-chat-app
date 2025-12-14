"use client";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  const roomId = params.roomId as String;

  return <p>hello sophia {roomId}</p>;
};

export default Page;
