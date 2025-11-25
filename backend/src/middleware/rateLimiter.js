import ratelimit from "../config/uptash.js";
import logger from "../config/logger.js";

const rateLimiter = async function (req, res, next) {
  //per user => john, jane, dani
  //or based on ip adress
  try {
    const ip = req.ip; //or req.headers["x-forwarded-for"]
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return res.status(429).json({
        message: "too many requests, please try again later",
      });
    }

    next();
  } catch (err) {
    logger.error("Rate limit error:", { error: err.message, stack: err.stack });
    next(err);
  }
};

export default rateLimiter;
