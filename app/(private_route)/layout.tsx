import Navbar from "@components/navbar";

interface Props {
  children: React.ReactNode;
}

export default async function PrivateLayout({ children }: Props) {
  return (
    <div className="max-w-screen-xl mx-auto lg:p-0 p-4">
      <Navbar />
      {children}
    </div>
  );
}
