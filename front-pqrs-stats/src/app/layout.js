import Providers from "./providers";
import Sidebar from "./components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "PQRS Dashboard",
  description: "Panel de control de estadísticas PQRS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-sans bg-gray-50">
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}