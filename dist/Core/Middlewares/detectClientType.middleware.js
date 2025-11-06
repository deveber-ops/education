function detectClientTypeMiddleware(req, res, next) {
  const accept = (req.headers["accept"] || "").toLowerCase();
  if (accept.includes("application/json")) req.clientType = "api";
  else if (accept.includes("text/html")) req.clientType = "browser";
  else if (accept.includes("application/xml") || accept.includes("text/xml")) req.clientType = "xml";
  else if (accept.includes("text/plain")) req.clientType = "text";
  else if (accept.includes("application/pdf")) req.clientType = "pdf";
  else if (accept.includes("image/")) req.clientType = "image";
  else if (accept.includes("application/octet-stream")) req.clientType = "binary";
  else if (accept.includes("multipart/form-data") || accept.includes("application/x-www-form-urlencoded")) req.clientType = "form";
  else req.clientType = "unknown";
  next();
}
export {
  detectClientTypeMiddleware
};
