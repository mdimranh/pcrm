import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <>{children}</>;
}
