const pool = require('../db');

const getDataStats = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM public.pqrs_2025'); // ← Cambia "tu_tabla"
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener datos:', error); // Mostrar error real
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Nueva consulta, estadísticas por estado
const getEstadoMesStats = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT estado, mes, COUNT(*) AS cantidad
          FROM public.pqrs_2025
          GROUP BY estado, mes
          ORDER BY estado, mes
      `);

      // Inicializamos la estructura
      const labels = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
      const estados = ['ABIERTO', 'FINALIZADO'];

      const datasets = estados.map(estado => {
          // Para cada mes del 1 al 12, buscamos si hay un registro con ese estado y mes
          const data = labels.map(mes => {
              const found = result.rows.find(row => row.estado === estado && row.mes.toString() === mes);
              return found ? parseInt(found.cantidad) : 0;
          });
          return { estado, data };
      });

      res.json({ labels, datasets });
  } catch (error) {
      console.error('Error al obtener estadísticas por estado y mes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// nueva consulta - oportunidad
const getOportunidadPorDia = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT
              mes,
              fecha_de_ingreso::date AS fecha,
              COUNT(*) FILTER (WHERE oportunidad = 'OPORTUNO') AS oportuno,
              COUNT(*) FILTER (WHERE oportunidad = 'NO OPORTUNO') AS no_oportuno,
              COUNT(*) FILTER (WHERE oportunidad = 'A TIEMPO') AS a_tiempo
          FROM public.pqrs_2025
          GROUP BY mes, fecha
          ORDER BY mes, fecha;
      `);

      res.json(result.rows);
  } catch (error) {
      console.error("Error al obtener estadísticas por oportunidad:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Nueva consuñta - tema por mes
const getTemaMesStats = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT 
              mes,
              tema,
              COUNT(*) AS cantidad
          FROM public.pqrs_2025
          GROUP BY mes, tema
          ORDER BY mes ASC, cantidad DESC;
      `);

      // Reorganizamos los datos por mes
      const data = {};

      result.rows.forEach(row => {
          const { mes, tema, cantidad } = row;
          if (!data[mes]) {
              data[mes] = [];
          }
          data[mes].push({ tema, cantidad: parseInt(cantidad) });
      });

      res.json(data);
  } catch (error) {
      console.error("Error al obtener estadísticas por tema y mes:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
};

// nueva consulta - tema-estado
const getTemaEstadoStats = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT tema, estado, COUNT(*) as cantidad
          FROM public.pqrs_2025
          GROUP BY tema, estado
          ORDER BY tema, estado
      `);
      res.json(result.rows);
  } catch (error) {
      console.error("Error al obtener estadísticas por tema y estado:", error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// nueva consulta - mes-fecha de ingreso (cantidad)
const getIngresosPorDiaPorMes = async (req, res) => {
  try {
      const result = await pool.query(`
          SELECT mes, TO_CHAR(fecha_de_ingreso, 'YYYY-MM-DD') AS fecha_de_ingreso, COUNT(*) AS cantidad
          FROM public.pqrs_2025
          GROUP BY mes, fecha_de_ingreso
          ORDER BY mes, fecha_de_ingreso
      `);
      res.json(result.rows);
  } catch (error) {
      console.error("Error al obtener ingresos por día por mes:", error);
      res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// nueva consulta - ultimo estado en ruta por mes y tema
const getEstadoRutaPorMesYTema = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        mes,
        tema,
        ultimo_estado_en_ruta,
        COUNT(*) AS cantidad
      FROM public.pqrs_2025
      GROUP BY mes, tema, ultimo_estado_en_ruta
      ORDER BY mes, tema, ultimo_estado_en_ruta
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener estadísticas por mes, tema y estado en ruta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


module.exports = { getDataStats, getEstadoMesStats, getOportunidadPorDia, getTemaMesStats, getTemaEstadoStats, getIngresosPorDiaPorMes, getEstadoRutaPorMesYTema };
