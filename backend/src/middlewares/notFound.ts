import { Request, Response } from "express";
import { errorResponse } from "../utils/apiResponse.js";

export function notFoundHandler(_req: Request, res: Response) {
  return res.status(404).json(errorResponse("Route not found", "ROUTE_NOT_FOUND"));
}
