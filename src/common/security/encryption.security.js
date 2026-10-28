import crypto from "node:crypto";
import { ENC_KEY, IV_LENGTH } from "../../config.js";

const HEX_RE = /^[0-9a-f]+$/i;

export const encryption = async (plaintext) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipherIv = crypto.createCipheriv("aes-256-cbc", ENC_KEY, iv);

  let cipherText = cipherIv.update(plaintext, "utf-8", "hex");
  cipherText += cipherIv.final("hex");

  return `${iv.toString("hex")}::${cipherText}`;
};

export const decryption = (cipherText) => {
  if (typeof cipherText !== "string" || !cipherText) return undefined;

  const parts = cipherText.split("::");

  if (parts.length !== 2) return cipherText;

  const [hexIV, encryptedData] = parts;

  if (
    hexIV.length !== IV_LENGTH * 2 ||
    !HEX_RE.test(hexIV) ||
    !encryptedData ||
    encryptedData.length % 32 !== 0 ||
    !HEX_RE.test(encryptedData)
  ) {
    return cipherText;
  }

  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      ENC_KEY,
      Buffer.from(hexIV, "hex"),
    );
    return (
      decipher.update(encryptedData, "hex", "utf-8") + decipher.final("utf-8")
    );
  } catch (err) {
    console.error("[decryption] failed:", err.code || err.message);
    return undefined;
  }
};
