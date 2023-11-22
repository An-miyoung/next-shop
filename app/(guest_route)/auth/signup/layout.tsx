interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className=" h-screen flex items-center justify-center">{children}</div>
  );
}
