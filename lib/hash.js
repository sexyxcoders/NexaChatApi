import CryptoJS from "crypto-js";

export function hashSession(session) {
  return CryptoJS.SHA256(session).toString();
}