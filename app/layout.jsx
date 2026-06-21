import "./globals.css";
import { ToastProvider } from "@/components/ui";

export const metadata = {
  title: "HerbSphere",
  description: "AI-powered digital platform for herbal and aromatics businesses.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
