import { authConfig } from "@/auth";
import Navbar from "../components/navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: Props) {
  return (
    <div className="max-w-screen-xl mx-auto lg:p-0 p-4">
      <Navbar />
      {children}
    </div>
  );
}
