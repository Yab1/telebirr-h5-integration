const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const createOrder = require("./service/create-order-service");

const app = express();
const server = http.createServer(app);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");

  next();
});

app.post("/create/order", async (req, res) => {
  console.log("***********START RES****************");
  try {
    const response = await createOrder(req, res);
    res.status(200).send(response);
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
  console.log("************END RES***************");
});

const serverPort = process.env.PORT || 8000;
server.listen(serverPort, () => {
  console.log(`Server started, port: ${serverPort}`);
});
