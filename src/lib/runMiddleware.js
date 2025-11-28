export const runMiddleware = async (req, res, fn) => {
  await fn(req, res, () => {});
};
