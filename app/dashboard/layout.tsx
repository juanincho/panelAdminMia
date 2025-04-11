export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-transparent">
      <main className="p-8 bg-transparent">{children}</main>
    </div>
  );
}
