import "./globals.css";

export const metadata = {
  title: "Dra Carolina Aguirre - Paunova Skin & Age Clinic",
  description: "Paunova Premium Web integrado desde Stitch como fuente visual oficial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
