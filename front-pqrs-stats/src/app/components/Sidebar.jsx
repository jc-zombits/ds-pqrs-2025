"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // Importación añadida
import { 
  FiHome, 
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut
} from "react-icons/fi";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/graficas", icon: <FiHome size={20} />, label: "Inicio" },
    { href: "/graficas/estadisticas", icon: <FiBarChart2 size={20} />, label: "Estadísticas" },
    { href: "/graficas/perfil", icon: <FiUser size={20} />, label: "Perfil" },
    { href: "/graficas/configuracion", icon: <FiSettings size={20} />, label: "Configuración" },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-bl
from-[#d6d9e0]
via-[#99999b]
to-[#fbfbfc] shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo/Título */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-gray-800">PQRS Analytics</h1>
      </div>
      
      {/* Menú */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              pathname === item.href
                ? "bg-gray-500"
                : "text-gray-800 hover:bg-gray-500 hover:text-gray-200"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-gray-200">
      <button
            onClick={async () => {
                await signOut({ redirect: false }); // Evitar redirección automática
                window.location.href = "/login"; // Redireccionar manualmente (garantizada)
            }}
            className="flex items-center space-x-3 p-3 rounded-lg text-gray-200 bg-gray-700 hover:bg-gray-600 w-full transition-colors"
            >
            <FiLogOut size={20} />
            <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}