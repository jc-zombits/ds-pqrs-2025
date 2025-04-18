const express = require('express');
const router = express.Router();
const { getDataStats, getEstadoMesStats, getOportunidadPorDia, getTemaMesStats, getTemaEstadoStats, getIngresosPorDiaPorMes, getEstadoRutaPorMesYTema } = require('../controllers/dataController');

router.get('/', getDataStats);

// ✅ Nueva ruta: estadísticas por estado y mes
router.get("/stats/estado-mes", getEstadoMesStats);

// nueva ruta oportunidad
router.get("/stats/oportunidad-dia", getOportunidadPorDia);

// nueva ruta por tema-mes
router.get("/stats/tema-mes", getTemaMesStats);

// Nueva ruta por tema-estado
router.get('/stats/tema-estado', getTemaEstadoStats);   

// nueva ruta por mes-fecha de ingreso (cantidad)
router.get('/stats/ingresos-dia-mes', getIngresosPorDiaPorMes);

// nueva ruta - ultimo estado en ruta por mes y tema
router.get("/stats/estado-ruta-tema-mes", getEstadoRutaPorMesYTema);


module.exports = router;
