const dotenv = require("dotenv");
const {
  createNonceStr,
  createTimeStamp,
  signRequestObject,
} = require("../utils/tools");

dotenv.config();

module.exports = function createRawRequest(prepayId) {
  if (!prepayId) throw new Error("prepayId is required");

  const request = {
    appid: process.env.MERCHANT_APP_ID,
    merch_code: process.env.MERCHANT_CODE,
    nonce_str: createNonceStr(),
    prepay_id: prepayId,
    timestamp: createTimeStamp(),
  };

  // Generate the signature
  const sign = signRequestObject(request);

  // Convert map object to query string format with the signature
  const createQueryParam = (key, value) =>
    `${key}=${encodeURIComponent(value)}`;

  const rawRequest = Object.entries(request)
    .map(([key, value]) => createQueryParam(key, value))
    .concat([createQueryParam("sign", sign), "sign_type=SHA256WithRSA"])
    .join("&");

  return rawRequest;
};
