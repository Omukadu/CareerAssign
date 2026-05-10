const crypto = require("crypto");

function isLocalMode() {
  return String(process.env.MODE || "local").toLowerCase() === "local";
}

function deriveKey(secret) {
  // Accept any length secret but always derive 32 bytes.
  return crypto.createHash("sha256").update(String(secret)).digest();
}

function encryptString(plainText, secret) {
  const key = deriveKey(secret);
  const iv = crypto.randomBytes(12); // GCM recommended IV length
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const ivB64 = iv.toString("base64");
  const tagB64 = tag.toString("base64");
  const dataB64 = enc.toString("base64");
  return {
    __enc: 1,
    // Packed format: alg.iv.tag.ciphertext (all base64 except alg). Split on '.' on client.
    data: `A256GCM.${ivB64}.${tagB64}.${dataB64}`,
  };
}

module.exports = function encryptJsonMiddleware(req, res, next) {
  // Only encrypt when NOT local and a secret exists.
  if (isLocalMode()) return next();
  const secret = process.env.API_ENC_KEY;
  if (!secret) return next();

  const originalJson = res.json.bind(res);
  res.json = (payload) => {
    try {
      // If it's already encrypted, don't double wrap.
      if (payload && typeof payload === "object" && payload.__enc) {
        return originalJson(payload);
      }
      const text = JSON.stringify(payload);
      return originalJson(encryptString(text, secret));
    } catch (_e) {
      // Never let encryption break an API response.
      return originalJson(payload);
    }
  };

  next();
};

