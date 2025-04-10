"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  FiHome, 
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiPieChart
} from "react-icons/fi";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [openStats, setOpenStats] = useState(false); // ← Añadido para el menú desplegable

  const navItems = [
    { href: "/graficas", icon: <FiHome size={20} />, label: "Inicio" },
    // Eliminamos temporalmente Estadísticas aquí para que lo controlen dinámicamente abajo
    { href: "/graficas/perfil", icon: <FiUser size={20} />, label: "Perfil" },
    { href: "/graficas/configuracion", icon: <FiSettings size={20} />, label: "Configuración" },
  ];

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-bl
    from-[#d6d9e0]
    via-[#eeeef1]
    to-[#fbfbfc] shadow-lg border-r border-gray-200 flex flex-col">
      
      {/* Logo/Título */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-gray-800">PQRS Analytics</h1>
      </div>
      
      {/* Menú */}
      <nav className="flex-1 p-4 space-y-2">

        {/* Opción Inicio */}
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

        {/* Opción Estadísticas con Submenú */}
        <div>
          <button
            onClick={() => setOpenStats(!openStats)}
            className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
              pathname.startsWith("/graficas/estadisticas")
                ? "bg-gray-500 text-white"
                : "text-gray-800 hover:bg-gray-500 hover:text-gray-200"
            }`}
          >
            <span className="flex items-center space-x-3">
              <FiBarChart2 size={20} />
              <span className="font-medium">Estadísticas</span>
            </span>
            <FiChevronDown size={16} className={`transition-transform ${openStats ? "rotate-180" : ""}`} />
          </button>

          {openStats && (
            <div className="ml-8 mt-2 space-y-1 text-sm">
              <Link
                href="/graficas/estadisticas/grafica-estados"
                className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                  pathname === "/graficas/estadisticas/grafica-estados"
                    ? "bg-gray-400 text-white"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                <FiPieChart size={16} />
                <span>Gráfica de estados por mes</span>
              </Link>
              {/* Puedes agregar más subitems aquí */}
            </div>
          )}
        </div>
      </nav>
      
      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={async () => {
              await signOut({ redirect: false });
              window.location.href = "/login";
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
