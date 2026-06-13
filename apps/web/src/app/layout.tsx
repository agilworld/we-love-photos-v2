import type { Metadata } from "next";
import localFont from "next/font/local";
import { getLocale, getMessages } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import "../styles/globals.css";
import Providers from "../providers";

const geistSans = localFont({
  src: "../../public/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "../../public/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title:
    "We Love Photos | Best Collection Photo from Pexel and Unsplash |Open Source Project",
  description:
    "Dedication for who those love and search photos for collection or commercial project. Best Photo Aggregrator from Pexel and Unsplash",
  keywords: "photos, sharing photo, free photos, download photo, search photo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers locale={locale} messages={messages}>
          {children}
          {process.env.NODE_ENV === "production" && (
            <Analytics mode={"production"} />
          )}
        </Providers>
      </body>
    </html>
  );
}
