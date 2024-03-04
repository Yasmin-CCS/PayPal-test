import express from "express";
import "dotenv/config";
import path from "path";
import { createOrder, captureOrder } from "./functions/functions.js";

const { PORT } = process.env;
const server = express();

// Allowing the node to send the front-end to the browser for execution

server.use(express.static("src"));

server.get("/", (response) => {
  response.sendFile(path.resolve("./src/index.html"));
});

// Setting the port that Node will listen to

server.listen(PORT);

// Allowing Node to parse JSON files
server.use(express.json());

// Creating the route for capturing the body coming from HTML for order creation
server.post("/createorder", async (request, response) => {
  try {
    // Extracting the body from the request
    const body  = request.body;
    // Collecting the responses and storing them in variables
    const { jsonResponse, httpStatusCode } = await createOrder(body);

    // Linking them to their appropriate location within the new response
    response.status(httpStatusCode).json(jsonResponse);

  } catch (error) {
    console.error(error);
  }
});

server.post("/captureorder/:orderID", async (request, response) => {
  try {
    // Extracting the orderId from the sent params
    const { orderID } = request.params;

    // Collecting the responses and storing them in variables
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);

    // Linking them to their appropriate location within the new response
    response.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error(error);
  }
});

