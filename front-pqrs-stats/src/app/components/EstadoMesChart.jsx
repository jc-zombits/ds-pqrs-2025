"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";
import Link from "next/link";

const EstadoMesChart = () => {
  const [originalData, setOriginalData] = useState(null);
  const [selectedEstados, setSelectedEstados] = useState([]);

  const meses = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
  ];

  useEffect(() => {
    axios.get("http://localhost:5000/api/data/stats/estado-mes")
      .then((res) => {
        console.log("📦 Datos crudos del backend:", res.data);
        setOriginalData(res.data);
        setSelectedEstados(res.data.datasets.map(d => d.estado));
      })
      .catch(err => {
        console.error("❌ Error al cargar los datos:", err);
      });
  }, []);

  if (!originalData) return <p>Cargando datos...</p>;

  // Preparar los datos para la gráfica
  const series = selectedEstados.map((estadoSel) => {
    const dataset = originalData.datasets.find(ds => ds.estado === estadoSel);
    return {
      name: estadoSel,
      data: dataset ? [...dataset.data] : [],
    };
  });

  // Preparar el resumen
  const resumen = selectedEstados.map((estadoSel) => {
    const dataset = originalData.datasets.find(ds => ds.estado === estadoSel);
    const total = dataset ? dataset.data.reduce((sum, val) => sum + val, 0) : 0;
    return { estado: estadoSel, total };
  });

  const options = {
    title: {
      text: "Trámites por estado y mes"
    },
    xAxis: {
      categories: meses
    },
    yAxis: {
      title: {
        text: "Cantidad"
      }
    },
    series: series
  };

  const handleEstadoToggle = (estado) => {
    setSelectedEstados(prev =>
      prev.includes(estado)
        ? prev.filter(e => e !== estado)
        : [...prev, estado]
    );
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-2xl">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Gráfica de Estados por Mes</h2>

      <div className="mb-4 text-orange-600">
        <span className="font-semibold mr-2 text-blue-400">Filtrar por estado:</span>
        {originalData.datasets.map(dataset => (
          <label key={dataset.estado} className="mr-4">
            <input
              type="checkbox"
              checked={selectedEstados.includes(dataset.estado)}
              onChange={() => handleEstadoToggle(dataset.estado)}
              className="mr-1"
            />
            {dataset.estado}
          </label>
        ))}
      </div>

      <HighchartsReact highcharts={Highcharts} options={options} />

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2 text-blue-600">Resumen:</h3>
        <ul className="list-disc ml-6 text-blue-400">
          {resumen.map((item) => (
            <li key={item.estado}>
              <span className="font-medium">{item.estado}:</span> {item.total} trámites en total
            </li>
          ))}
        </ul>
      </div>

      {/* Botón para ir al análisis completo */}
      <div className="mt-6 flex justify-end">
        <Link href="/graficas/estadisticas/grafica-estados">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-9 rounded shadow-md transition">
            Ver análisis completo →
          </button>
        </Link>
      </div>
    </div>
  );
};

export default EstadoMesChart;
