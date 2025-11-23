import ratelimit from "../config/uptash.js";

const rateLimiter = async function (req, res, next) {
  //per user => john, jane, dani
  //or based on ip adress
  try {
    const { success } = await ratelimit.limit("my-rate-limit");

    if (!success) {
      return res.status(429).json({
        message: "too many requests, please try again later",
      });
    }

    next();
  } catch (err) {
    console.log("Rate limit error: ", err);
    next(err);
  }
};

export default rateLimiter;
