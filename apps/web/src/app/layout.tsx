import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/store/Provider";

export const metadata: Metadata = {
  title: "WelfareApp",
  description: "Citizen welfare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
