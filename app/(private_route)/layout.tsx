import { authConfig } from "@/auth";
import Navbar from "@components/navbar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import EmailVerificationBanner from "@components/EmailVerificationBanner";

interface Props {
  children: React.ReactNode;
}

export default async function PrivateLayout({ children }: Props) {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/auth/users/signin");

  return (
    <div className="max-w-screen-xl mx-auto lg:p-0 p-4">
      <Navbar />
      <EmailVerificationBanner />
      {children}
    </div>
  );
}
