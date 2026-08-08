import express from "express";
import path from "path";
import http from "http"
import 'tsconfig-paths/register';

const app = express()
const cors = require('cors')
app.use(cors());

const port = 3000;

app.use(express.json({ limit: '50mb' }));

import enemyRoutes from "./src/routes/enemy"
import assetsRoutes from "./src/routes/assets"
import recalRuneRoutes from "./src/routes/recalRune"
import ccbRoutes from "./src/routes/ccb"
import ocrRoutes from "./src/routes/ocr"
app.use("/enemy", enemyRoutes)
app.use("/assets", assetsRoutes)
app.use("/recalRune", recalRuneRoutes)
app.use("/ccb", ccbRoutes)
app.use("/ocr", ocrRoutes)

app.use(express.static(path.join(__dirname, 'public')))
const server = http.createServer(app);
server.listen(port);
server.on('listening', () =>{
  console.log(`app listening on port ${port}`);
});
server.on('error', (error) =>{
  console.log(error);
});
module.exports = app;