import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel - Image Tools Management",
  description: "Administrative panel for managing Image Tools feature requests and user feedback. Secure access required.",
  robots: "noindex, nofollow" // Don't index admin pages
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 