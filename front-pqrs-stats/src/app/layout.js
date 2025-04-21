import Providers from "./providers";
import "./globals.css";
import ClientLayout from "./components/ClientLayout";

export const metadata = {
  title: "PQRS Dashboard",
  description: "Panel de control de estadísticas PQRS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans bg-gray-50">
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
