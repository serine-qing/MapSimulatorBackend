export{}//TODO 百思不得其解

const express = require('express')
const app = express()
const cors = require('cors')   //引入cors解决跨域问题
app.use(cors());

const path = require('path')
const port = 3000;

app.use(express.json());

const enemyRoutes = require("./src/routes/enemy")
app.use("/enemy", enemyRoutes)

//设置静态资源
app.use(express.static(path.join(__dirname, 'public')))

app.listen(port, () =>{
  console.log(`Example app listening on port ${port}`);
})

module.exports = app;