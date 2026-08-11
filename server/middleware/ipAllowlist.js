/**
 * Optional extra layer for the login endpoint. A MAC address cannot be seen
 * by any website (it never leaves your local network), so this uses IP
 * address instead — the closest real equivalent.
 *
 * OFF by default, because most home/mobile connections have IP addresses
 * that change, and this would lock you out. To turn it on, set an
 * environment variable before starting the server:
 *
 *   ALLOWED_LOGIN_IPS=1.2.3.4,5.6.7.8 npm start
 *
 * Only requests from those exact IPs will be allowed to reach /api/auth/login.
 * Leave ALLOWED_LOGIN_IPS unset to allow login attempts from anywhere
 * (still protected by username + password).
 */
function ipAllowlist(req, res, next) {
  const allowed = process.env.ALLOWED_LOGIN_IPS;
  if (!allowed) return next(); // feature disabled

  const allowedList = allowed.split(",").map((ip) => ip.trim());
  // req.ip respects Express's trust proxy setting; falls back to socket address
  const requestIp = (req.ip || req.connection.remoteAddress || "").replace("::ffff:", "");

  if (allowedList.includes(requestIp)) {
    return next();
  }

  return res.status(403).json({
    ok: false,
    error: "Login is not permitted from this network.",
  });
}

module.exports = ipAllowlist;
