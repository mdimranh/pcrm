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
  const setThemeScript = `
    (function() {
      try {
        function getCookie(name) {
          var m = document.cookie.match('(^|;)\\\\s*' + name + '\\\\s*=\\\\s*([^;]+)');
          return m ? decodeURIComponent(m[2]) : null;
        }
        var stored = getCookie('theme');
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var shouldDark = false;
        if (stored) {
          var s = String(stored).trim().toLowerCase();
          if (s === 'dark' || s === '1' || s === 'true') shouldDark = true;
          else if (s === 'light' || s === '0' || s === 'false') shouldDark = false;
          else if (s === 'system') shouldDark = prefersDark;
          else shouldDark = prefersDark;
        } else {
          shouldDark = prefersDark;
        }
        document.documentElement.classList.toggle('dark', !!shouldDark);
      } catch (e) {}
    })();
  `;
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
