export function generateUserId(gstNumber) {
  const gstNameChars = gstNumber
    .substring(gstNumber.length - 4, gstNumber.length)
    .toUpperCase();

  return "USER-" + gstNameChars;
};

export function generateRandomPassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};