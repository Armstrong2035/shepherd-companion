import { Inter } from "next/font/google";
import ClientRootLayout from "./ClientRootLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Shepherd CRM Companion",
  description: "The companion app for Shepherd CRM for church teams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  );
}
