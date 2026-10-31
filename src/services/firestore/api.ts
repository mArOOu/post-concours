import { verifyAdminIdToken } from "@/lib/auth/admin";
import { FirestoreServiceError } from "./shared";

export class ApiRouteError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiRouteError";
    this.status = status;
  }
}

function getIdTokenFromRequest(request: Request) {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7).trim();
  }

  return request.headers.get("x-firebase-id-token");
}

export async function requireAdminRequest(request: Request) {
  const idToken = getIdTokenFromRequest(request);

  if (!idToken) {
    throw new ApiRouteError(401, "Missing Firebase ID token.");
  }

  const adminPrincipal = await verifyAdminIdToken(idToken);

  if (!adminPrincipal) {
    throw new ApiRouteError(403, "Admin access denied.");
  }

  return adminPrincipal;
}

export function getStatusFromError(error: unknown) {
  if (error instanceof ApiRouteError) {
    return error.status;
  }

  if (error instanceof FirestoreServiceError) {
    switch (error.code) {
      case "not-found":
        return 404;
      case "already-exists":
        return 409;
      case "invalid-argument":
        return 400;
      default:
        return 500;
    }
  }

  return 500;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unexpected server error.";
}
