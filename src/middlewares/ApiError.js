class ApiError extends Error {
  /**
   * Crée une erreur API
   * @param {number} statusCode - Code HTTP numérique
   * @param {string} message - Message d'erreur
   * @param {any} [details] - Détails supplémentaires
   */
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    
    // Capture la stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

module.exports = ApiError;