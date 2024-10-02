import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase : new URL("http://www.HomelyRealtors.com"),
  keywords: ["home","sale","rent","property", "homely realtors"],
  title: {
    default: "Homely Realtors",
    template: "Homely| %s"
  },
  openGraph: {
    title: 'Homely Realtors',
    description: "Home of your next home 😃.",
    images: ['https://i.pinimg.com/564x/14/50/8e/14508e3b0b317a5a0fbac7050666567b.jpg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Homely Realtors',
    description: 'Home of your next home 😃.',
    images: ['https://i.pinimg.com/564x/14/50/8e/14508e3b0b317a5a0fbac7050666567b.jpg']
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
