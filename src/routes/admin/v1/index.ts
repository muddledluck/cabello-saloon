import { Router } from "express";
import SMTPRoutes from "./smtp.routes";

const AdminRoutes = Router();
const routes = [SMTPRoutes];

// TODO: Add validation on routes (middelware)
for (let i = 0; i < routes.length; i++) {
  AdminRoutes.use("/admin", routes[i]);
}

export default AdminRoutes;
