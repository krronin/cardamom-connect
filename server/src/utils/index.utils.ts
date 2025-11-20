function generateUserId(gstNumber) {
  const gstNameChars = gstNumber
    .substring(gstNumber.length - 4, gstNumber.length)
    .toUpperCase();

  return "USER-" + gstNameChars;
};

function generateRandomPassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

function makeId() {
  return (Date.now().toString(36) + Math.random().toString(36).slice(2));
}

function stripPassword(user) {
  if (!user) return user;
  const { password, ...safe } = user;
  return safe;
}

export {
  generateRandomPassword,
  generateUserId,
  stripPassword,
  makeId
};