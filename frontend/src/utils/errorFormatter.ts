// Centralized Error Formatter for UniSync Campus Platform
// Transforms raw HTTP status codes, network exceptions, and backend stack traces
// into clear, human-friendly, institutional messages with actionable instructions.

export interface FormattedError {
  title: string;
  message: string;
  statusCode?: number;
}

/**
 * Format any thrown error or response into a polite, user-friendly message.
 */
export function formatErrorMessage(error: any): string {
  if (!error) {
    return 'An unexpected issue occurred. Please try again.';
  }

  // If already a clean error string, sanitize and format it
  if (typeof error === 'string') {
    return cleanRawErrorString(error);
  }

  // Extract status code and raw messages
  const status = error.status || error.statusCode || error.response?.status;
  const rawMsg = error.message || error.error || error.data?.message || '';

  // 1. Network / Offline / Connection Failures
  if (
    rawMsg.includes('Failed to fetch') ||
    rawMsg.includes('NetworkError') ||
    rawMsg.includes('net::ERR_') ||
    rawMsg.includes('ECONNREFUSED')
  ) {
    return 'Unable to reach the campus server. Please verify your network connection and ensure the server is active.';
  }

  // 2. HTTP Status Code Mapping
  switch (status) {
    case 400:
      // Validation error handling
      if (error.errors && Array.isArray(error.errors)) {
        const fieldErrors = error.errors.map((e: any) => `${e.field || 'Field'}: ${e.message}`).join(', ');
        return `Please correct the following fields: ${fieldErrors}`;
      }
      if (rawMsg && !isGenericHttpCodeMessage(rawMsg)) {
        return cleanRawErrorString(rawMsg);
      }
      return 'The information submitted was incomplete or invalid. Please check the form and try again.';

    case 401:
      if (rawMsg.toLowerCase().includes('password')) {
        return 'Incorrect password. Please verify your credentials and try again.';
      }
      if (rawMsg.toLowerCase().includes('not registered') || rawMsg.toLowerCase().includes('not found')) {
        return 'No registered account found with this university email address.';
      }
      if (rawMsg.toLowerCase().includes('expired')) {
        return 'Your 50-minute session has expired. Please sign in again to continue.';
      }
      return 'Invalid credentials or session expired. Please sign in with your university account.';

    case 403:
      return 'Access restricted. You do not have the required permissions to perform this action or view this portal.';

    case 404:
      return 'The requested event, venue, or campus record could not be found.';

    case 409:
      if (rawMsg && !isGenericHttpCodeMessage(rawMsg)) {
        return cleanRawErrorString(rawMsg);
      }
      return 'A conflict occurred. A record with these details already exists in the campus database.';

    case 422:
      return 'The request could not be processed due to validation errors. Please check your inputs.';

    case 429:
      return 'Traffic limit reached (1,500 requests per 15 minutes). Please wait a few moments before trying again.';

    case 500:
    case 502:
    case 503:
    case 504:
      return 'The campus server encountered a temporary processing error. Our technical team has been notified. Please try again shortly.';

    default:
      break;
  }

  // 3. Fallback to sanitized message if available
  if (rawMsg && !isGenericHttpCodeMessage(rawMsg)) {
    return cleanRawErrorString(rawMsg);
  }

  return 'An unexpected issue occurred while processing your request. Please try again.';
}

/**
 * Check if the raw message is simply an unformatted HTTP status string like "Request failed with status 500".
 */
function isGenericHttpCodeMessage(msg: string): boolean {
  const lower = msg.toLowerCase();
  return (
    lower.startsWith('request failed with status') ||
    lower.startsWith('status code ') ||
    lower.includes('internal server error') ||
    lower.includes('bad gateway') ||
    lower.includes('service unavailable')
  );
}

/**
 * Clean technical jargon, SQL errors, or system paths from raw messages.
 */
function cleanRawErrorString(msg: string): string {
  // Strip MySQL database error codes
  if (msg.includes('ER_') || msg.includes('SQLSTATE') || msg.includes('Access denied for user')) {
    return 'Database operation failed. Please ensure the campus database is running and accessible.';
  }
  // Strip duplicate entry SQL errors
  if (msg.includes('Duplicate entry')) {
    return 'A record with this information already exists in the system.';
  }
  // Strip TypeError / ReferenceError traces
  if (msg.includes('TypeError:') || msg.includes('ReferenceError:') || msg.includes('is not a function')) {
    return 'A data rendering exception occurred. The system has safely recovered.';
  }

  // Capitalize first character and trim trailing dots
  const trimmed = msg.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
