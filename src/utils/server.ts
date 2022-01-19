import express from "express";
import cors from "cors";
import morgan from "morgan";
import deserializedUser from "../middleware/deserializedUser";
import routes from "../routes";
function createServer() {
  const app = express();
  app.use(cors());
  app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });
  app.use(express.json());

  app.use(morgan("dev"));
  app.use(deserializedUser);
  routes(app);

  return app;
}

export default createServer;
