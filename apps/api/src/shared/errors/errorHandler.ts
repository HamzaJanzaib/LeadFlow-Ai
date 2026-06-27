import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "./AppError";
import { ZodError } from "zod";

export function errorHandler(
  error: any,
  request: any,
  reply: any,
) {
  request.log.error(
    { err: error, url: request.url, method: request.method },
    "Request error",
  );

  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(422).send({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "Request validation failed",
        details: error.flatten().fieldErrors,
      },
    });
  }

  // Our application errors
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      },
    });
  }

  // Fastify validation errors (from schema)
  if ("statusCode" in error && error.statusCode === 400) {
    return reply.status(400).send({
      success: false,
      error: {
        code: "BAD_REQUEST",
        message: error.message,
      },
    });
  }

  // Prisma known request error
  if (error.constructor.name === "PrismaClientKnownRequestError") {
    const prismaError = error as any;
    if (prismaError.code === "P2002") {
      return reply.status(409).send({
        success: false,
        error: {
          code: "CONFLICT",
          message: "A record with this value already exists",
          details: prismaError.meta,
        },
      });
    }
    if (prismaError.code === "P2025") {
      return reply.status(404).send({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Record not found",
        },
      });
    }
  }

  // Generic 500
  return reply.status(500).send({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message:
        process.env.NODE_ENV === "production"
          ? "An unexpected error occurred"
          : error.message,
    },
  });
}
