import { Request, Response } from "express";
import { successResponse } from "../utils/apiResponse.js";

export function healthController(_req: Request, res: Response) {
  return res.status(200).json(successResponse({ status: "ok" }));
}
