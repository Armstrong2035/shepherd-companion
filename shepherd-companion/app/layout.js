export const metadata = {
  title: "Shepherd Companion",
  description: "The companion app for Shepherd CRM for church teams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
