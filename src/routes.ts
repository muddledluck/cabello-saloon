import { Express, Request, Response } from "express";
import AdminRoutes from "./routes/admin/v1";
import SessionRoutes from "./routes/session.routes";
import UserRoutes from "./routes/user.routes";

function routes(app: Express) {
  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.send("API is Working");
  });

  app.use("/api", UserRoutes);
  app.use("/api", SessionRoutes);

  // Admin routes
  app.use("/api/v1", AdminRoutes);
}

export default routes;
