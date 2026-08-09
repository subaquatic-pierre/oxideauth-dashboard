import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
      <div className="flex items-center gap-2">
        <div className="relative w-[300px] h-[300px]">
          <Image
            src="/logoIconText.png"
            alt="OxideAuth"
            // width={200}
            // height={40}
            style={{
              objectFit: "contain",
            }}
            fill
            // className="h-10 w-auto"
            priority
          />
        </div>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
