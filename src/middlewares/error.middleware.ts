import { HttpException } from "@/exceptions";
import { logger } from "@/utils";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
   error: HttpException,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   try {
      const status: number = error.status || 500;
      const message: string = error.message || "Something went wrong";
      logger.error(
         `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message : ${message}`
      );

      return res.status(status).json({ message });
   } catch (error) {
      return res.status(500).json({
         message: " Internal Server Error",
         statusCode: 500,
      });
   }
};
