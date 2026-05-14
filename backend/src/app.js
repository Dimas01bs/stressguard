const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { env } = require("./config/env");
const routes = require("./routes");
const { attachRequestId } = require("./middleware/request-id.middleware");
const { notFoundHandler } = require("./middleware/not-found.middleware");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendOrigin,
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(attachRequestId);
app.use(
  morgan(":method :url :status :response-time ms reqId=:req[x-request-id]")
);

app.use(env.apiPrefix, routes);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = { app };
