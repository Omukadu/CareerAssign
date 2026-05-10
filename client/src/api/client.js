import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

const MODE = String(import.meta.env.VITE_MODE || "local").toLowerCase();
const ENC_KEY = import.meta.env.VITE_API_ENC_KEY;

function b64ToBytes(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveAesKey(secret) {
  const enc = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", enc.encode(String(secret)));
  return crypto.subtle.importKey("raw", hash, { name: "AES-GCM" }, false, [
    "decrypt",
  ]);
}

async function decryptEnvelope(env) {
  const key = await deriveAesKey(ENC_KEY);
  let ivB64, tagB64, dataB64;
  let alg;

  // New packed format: data = alg.iv.tag.ciphertext
  if (typeof env.data === "string" && env.data.includes(".")) {
    const parts = env.data.split(".");
    if (parts.length >= 4) {
      alg = parts[0];
      ivB64 = parts[1];
      tagB64 = parts[2];
      dataB64 = parts.slice(3).join("."); // defensive, in case delimiter appears unexpectedly
    } else if (parts.length >= 3) {
      // Older packed format: iv.tag.ciphertext
      ivB64 = parts[0];
      tagB64 = parts[1];
      dataB64 = parts.slice(2).join(".");
    }
  }

  // Backward-compatible format: separate iv/tag/data keys
  if (!ivB64 || !tagB64 || !dataB64) {
    alg = env.alg;
    ivB64 = env.iv;
    tagB64 = env.tag;
    dataB64 = env.data;
  }

  if (alg && alg !== "A256GCM") throw new Error("Unsupported encryption alg");

  const iv = b64ToBytes(ivB64);
  const tag = b64ToBytes(tagB64);
  const data = b64ToBytes(dataB64);
  // WebCrypto expects ciphertext||tag
  const combined = new Uint8Array(data.length + tag.length);
  combined.set(data, 0);
  combined.set(tag, data.length);
  const plainBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    combined,
  );
  const text = new TextDecoder().decode(plainBuf);
  return JSON.parse(text);
}

async function encryptPayload(payload) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.digest("SHA-256", enc.encode(String(ENC_KEY)));
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "AES-GCM" },
    false,
    ["encrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plain = enc.encode(JSON.stringify(payload));
  const cipherBuf = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, cryptoKey, plain);
  const cipherBytes = new Uint8Array(cipherBuf);
  const tag = cipherBytes.slice(cipherBytes.length - 16);
  const data = cipherBytes.slice(0, cipherBytes.length - 16);

  const toB64 = (bytes) => {
    let s = "";
    for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s);
  };

  const ivB64 = toB64(iv);
  const tagB64 = toB64(tag);
  const dataB64 = toB64(data);

  return { __enc: 1, data: `A256GCM.${ivB64}.${tagB64}.${dataB64}` };
}

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  // Encrypt JSON payloads when not local. Never block a request if encryption fails.
  try {
    const method = String(cfg.method || "get").toLowerCase();
    const isBodyMethod = ["post", "put", "patch", "delete"].includes(method);
    const isPlainObject =
      cfg.data &&
      typeof cfg.data === "object" &&
      !(cfg.data instanceof FormData) &&
      !(cfg.data instanceof Blob) &&
      !(cfg.data instanceof ArrayBuffer);

    if (
      MODE !== "local" &&
      ENC_KEY &&
      isBodyMethod &&
      isPlainObject &&
      !(cfg.data && cfg.data.__enc)
    ) {
      return encryptPayload(cfg.data).then((encBody) => {
        cfg.data = encBody;
        return cfg;
      });
    }
  } catch (_e) {
    // ignore
  }
  return cfg;
});

api.interceptors.response.use(
  async (r) => {
    // If server is encrypting JSON responses, decrypt safely here.
    try {
      if (
        MODE !== "local" &&
        ENC_KEY &&
        r?.data &&
        typeof r.data === "object" &&
        r.data.__enc
      ) {
        r.data = await decryptEnvelope(r.data);
      }
    } catch (_e) {
      // Never break the app if decrypt fails; just pass through.
    }
    return r;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      if (
        !location.pathname.startsWith("/login") &&
        !location.pathname.startsWith("/register")
      ) {
        location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
