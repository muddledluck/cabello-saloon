import * as crypto from "crypto";

function generateSecureRandomToken() {
  return crypto.randomBytes(32).toString("hex");
}

export default generateSecureRandomToken;
