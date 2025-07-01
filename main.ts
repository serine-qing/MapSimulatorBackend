import express from "express";
import path from "path";

const app = express()
const cors = require('cors')   //引入cors解决跨域问题
app.use(cors());


const port = 3000;

app.use(express.json());

import enemyRoutes from "./src/routes/enemy"
app.use("/enemy", enemyRoutes)

//设置静态资源
app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () =>{
  console.log(`Example app listening on port ${port}`);
})

module.exports = app;