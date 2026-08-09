import { ApiError } from "./api"

export { ApiError, NetworkError, isNetworkError, AUTH_EXPIRED_EVENT } from "./api"

export function isApiError(error: unknown): error is ApiError {
  return error instanceof Error && error.name === "ApiError"
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.name === "ApiError") {
    return error.message
  }
  if (error instanceof Error && error.name === "NetworkError") {
    return "Unable to connect to the OxideAuth API. Please check your connection and try again."
  }
  return "An unexpected error occurred."
}
