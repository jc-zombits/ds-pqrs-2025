"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const meses = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const TemasPorMesChart = () => {
  const [data, setData] = useState({});
  const [mesSeleccionado, setMesSeleccionado] = useState("1");
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/data/stats/tema-mes")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      });
  }, []);

  useEffect(() => {
    if (!data[mesSeleccionado]) return;

    const temas = data[mesSeleccionado].map((item) => item.tema);
    const cantidades = data[mesSeleccionado].map((item) => item.cantidad);

    setChartOptions({
      chart: {
        type: "bar"
      },
      title: {
        text: `Temas más frecuentes en ${meses.find(m => m.value === mesSeleccionado).label}`
      },
      xAxis: {
        categories: temas,
        title: {
          text: "Temas"
        },
        labels: {
          style: {
            fontSize: "10px"
          }
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: "Cantidad"
        }
      },
      series: [
        {
          name: "Cantidad",
          data: cantidades
        }
      ],
      tooltip: {
        pointFormat: "<b>{point.y}</b> casos"
      },
      credits: {
        enabled: false
      }
    });
  }, [data, mesSeleccionado]);

  return (
    <div className="mt-6 p-4 border rounded-lg shadow bg-white text-blue-400">
      <h2 className="text-lg font-semibold mb-4">Gráfico de Temas por Mes</h2>

      <div className="mb-4">
        <label htmlFor="mes" className="block text-sm font-medium mb-1">Seleccionar mes:</label>
        <select
          id="mes"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        >
          {meses.map((mes) => (
            <option key={mes.value} value={mes.value}>{mes.label}</option>
          ))}
        </select>
      </div>

      {chartOptions.series ? (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      ) : (
        <p>Cargando gráfico...</p>
      )}
    </div>
  );
};

export default TemasPorMesChart;
