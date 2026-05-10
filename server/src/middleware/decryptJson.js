const crypto = require("crypto");

function isLocalMode() {
  return String(process.env.MODE || "local").toLowerCase() === "local";
}

function deriveKey(secret) {
  return crypto.createHash("sha256").update(String(secret)).digest();
}

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function unpackEnvelope(body) {
  if (!body || typeof body !== "object") return null;
  if (!body.__enc) return null;

  // New packed format: data = alg.iv.tag.ciphertext
  if (typeof body.data === "string" && body.data.includes(".")) {
    const parts = body.data.split(".");
    if (parts.length >= 4) {
      const alg = parts[0];
      const iv = parts[1];
      const tag = parts[2];
      const data = parts.slice(3).join(".");
      return { alg, iv, tag, data };
    }
    if (parts.length >= 3) {
      // Older packed: iv.tag.ciphertext
      const iv = parts[0];
      const tag = parts[1];
      const data = parts.slice(2).join(".");
      return { alg: body.alg || "A256GCM", iv, tag, data };
    }
  }

  // Old shape: { alg, iv, tag, data }
  if (body.iv && body.tag && body.data) {
    return { alg: body.alg || "A256GCM", iv: body.iv, tag: body.tag, data: body.data };
  }

  return null;
}

function decryptToObject(env, secret) {
  if (!env || env.alg !== "A256GCM") return null;
  const key = deriveKey(secret);
  const iv = Buffer.from(env.iv, "base64");
  const tag = Buffer.from(env.tag, "base64");
  const data = Buffer.from(env.data, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
  return safeParseJson(plain);
}

module.exports = function decryptJsonMiddleware(req, _res, next) {
  // Only attempt decrypt when NOT local and secret exists.
  if (isLocalMode()) return next();
  const secret = process.env.API_ENC_KEY;
  if (!secret) return next();

  try {
    const env = unpackEnvelope(req.body);
    if (!env) return next();

    const obj = decryptToObject(env, secret);
    if (obj && typeof obj === "object") {
      req.body = obj;
    }
  } catch (_e) {
    // Never break the request if decrypt fails.
  }

  next();
};

