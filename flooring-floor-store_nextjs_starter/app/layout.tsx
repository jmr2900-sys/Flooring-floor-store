export const metadata = {
  title: "Flooring Floor Store",
  description: "Premium flooring at outlet pricing in Lansing, MI",
};
import "./globals.css";
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
