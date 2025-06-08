import bcrypt from "bcrypt";

const rawPassword = "password";

bcrypt.hash(rawPassword, 10).then(console.log).catch(console.error);
