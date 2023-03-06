const express = require('express');
const cors = require('cors');
const sql = require('mssql');


const app = express();
app.use(cors());

const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'master',
  user: 'prueba',
  password: 'admin',
  options: {
    trustedConnection: true,
    trustServerCertificate: true
  }
}

app.get('/', (req, res) => {
  res.send('Hola desde el servidor de Node.js');
});


app.post('/postdata',express.json(), async (req, res) => {
  const { despacho, entrega, amabilidad, satisfaccion, recomendar, observaciones } = req.body
  const randomNum = Math.random().toString(36).substring(2, 8);
  const fechaActual = new Date();
 
    try {
    await sql.connect(config);
    const request = new sql.Request();
    const result = await request
    .input('idencuesta', sql.NVarChar, randomNum)
    .input('fecha_encuesta', sql.Date, fechaActual)
    .input('id_sucursal', sql.Int, 1)
    .input('despacho', sql.NVarChar, despacho)
    .input('entrega', sql.NVarChar, entrega)
    .input('amabilidad', sql.Int, amabilidad)
    .input('satisfaccion', sql.Int, satisfaccion)
    .input('recomendar', sql.Int, recomendar)
    .input('observaciones', sql.NVarChar, observaciones)
    .query( `INSERT INTO encuesta
       (id_encuesta, fecha_encuesta, id_sucursal, p1_despacho, p1_factura, p2_amabilidad,
        p3_satisfaccion, p4_recomendacion, p5_observaciones)
          VALUES (@idencuesta, @fecha_encuesta, @id_sucursal, @despacho, 
            @entrega, @amabilidad, @satisfaccion, @recomendar, @observaciones) `);
        } catch (error) {
          console.error(error);
          res.status(500).send('Error en el servidor');
          }
});


app.listen(3000, () => {
  console.log('El servidor está escuchando en el puerto 3000');
});