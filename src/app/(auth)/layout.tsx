import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-primary">
      <div className="relative">
        <Image fill src={'/images/logo.png'} alt="logo image" />
        <div className="absolute top-0 left-0 z-20 bg-black/35 h-full w-full backdrop-blur">

        </div>


      </div>
      <div className="flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
