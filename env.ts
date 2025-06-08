export const JWT_SECRET =
  process.env.JWT_SECRET ??
  (() => {
    throw new Error("Missing JWT_SECRET environment variable");
  })();
