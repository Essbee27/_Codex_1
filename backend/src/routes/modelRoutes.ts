import { Router } from "express";
import { ModelController } from "../controllers/modelController.js";
import { validateQuery, searchQuerySchema } from "../middlewares/requestValidation.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export function modelRoutes(controller: ModelController): Router {
  const router = Router();

  router.get("/search", validateQuery(searchQuerySchema), asyncHandler(controller.search));
  router.get("/:id", asyncHandler(controller.getById));

  return router;
}
