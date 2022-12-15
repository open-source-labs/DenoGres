export const key = await crypto.subtle.generateKey(
  { name: "HMAC", hash: "SHA-512" },
  false,
  ["sign", "verify"],
);
