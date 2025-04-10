"use client";
import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const meses = [
  { value: "all", label: "Todos los meses" },
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
  { value: "12", label: "Diciembre" }
];

const OportunidadPorDiaChart = () => {
  const [chartOptions, setChartOptions] = useState({});
  const [resumen, setResumen] = useState(null);
  const [dataOriginal, setDataOriginal] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState("all");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/data/stats/oportunidad-dia")
      .then((response) => {
        setDataOriginal(response.data);
      })
      .catch((error) => {
        console.error("Error cargando los datos:", error);
      });
  }, []);

  useEffect(() => {
    const dataFiltrada =
      mesSeleccionado === "all"
        ? dataOriginal
        : dataOriginal.filter((item) => item.mes === parseInt(mesSeleccionado));

    const fechas = dataFiltrada.map((item) =>
      new Date(item.fecha).toISOString().split("T")[0]
    );

    const oportunoData = dataFiltrada.map((item) => parseInt(item.oportuno));
    const noOportunoData = dataFiltrada.map((item) => parseInt(item.no_oportuno));
    const aTiempoData = dataFiltrada.map((item) => parseInt(item.a_tiempo));

    const resumenData = {
      oportuno: oportunoData.reduce((a, b) => a + b, 0),
      noOportuno: noOportunoData.reduce((a, b) => a + b, 0),
      aTiempo: aTiempoData.reduce((a, b) => a + b, 0),
    };

    setResumen(resumenData);

    setChartOptions({
      title: { text: "Oportunidades por Día" },
      xAxis: {
        categories: fechas,
        title: { text: "Fecha" },
        labels: {
          rotation: -45,
          style: { fontSize: "10px" },
        },
      },
      yAxis: {
        min: 0,
        title: { text: "Cantidad" },
      },
      series: [
        {
          name: "Oportuno",
          data: oportunoData,
          color: "#2b908f",
        },
        {
          name: "No Oportuno",
          data: noOportunoData,
          color: "#f45b5b",
        },
        {
          name: "A Tiempo",
          data: aTiempoData,
          color: "#90ee7e",
        },
      ],
      chart: {
        type: "line",
        zoomType: "x",
      },
      tooltip: {
        shared: true,
        crosshairs: true,
      },
      credits: {
        enabled: false,
      },
    });
  }, [dataOriginal, mesSeleccionado]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-2xl text-blue-400">
      <h2 className="text-lg font-semibold mb-4">Gráfico de Oportunidades por Día</h2>

      <div className="mb-4">
        <label htmlFor="mes" className="block text-sm font-medium mb-1 text-blue-400">
          Filtrar por mes:
        </label>
        <select
          id="mes"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="border p-2 rounded w-full md:w-64"
        >
          {meses.map((mes) => (
            <option key={mes.value} value={mes.value}>
              {mes.label}
            </option>
          ))}
        </select>
      </div>

      {chartOptions.series ? (
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      ) : (
        <p>Cargando gráfico...</p>
      )}

      {resumen && (
        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Resumen Total</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>Oportuno:</strong> {resumen.oportuno}
            </li>
            <li>
              <strong>No Oportuno:</strong> {resumen.noOportuno}
            </li>
            <li>
              <strong>A Tiempo:</strong> {resumen.aTiempo}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default OportunidadPorDiaChart;
