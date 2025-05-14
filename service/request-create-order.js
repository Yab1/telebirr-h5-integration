const dotenv = require("dotenv");
const axios = require("axios");
const {
  createNonceStr,
  createTimeStamp,
  signRequestObject,
} = require("../utils/tools");

dotenv.config();

async function requestCreateOrder(requestBody, fabricToken) {
  const requestObject = createRequestObject(requestBody);

  console.log("REQUEST OBJECT:", requestObject);

  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/payment/v1/merchant/preOrder`,
      requestObject,
      {
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": process.env.FABRIC_APP_ID,
          Authorization: fabricToken,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error creating order:",
      error.response?.data || error.message
    );
    throw error.response;
  }
}

function createRequestObject(requestBody) {
  const {
    refNo,
    title,
    total_amount,
    trans_currency,
    notify_url,
    redirect_url,
  } = requestBody;

  const request = {
    nonce_str: createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
    timestamp: createTimeStamp(),
    biz_content: {
      // URLs for notifications and user redirection after transaction.
      notify_url: notify_url,
      redirect_url: redirect_url,

      // Product Information
      title: title,

      // Basic Transaction Details
      trans_currency: trans_currency,
      total_amount: total_amount,
      merch_order_id: refNo,
      trade_type: "Checkout",
      timeout_express: "120m",

      // Merchant Information
      appid: process.env.MERCHANT_APP_ID,
      merch_code: process.env.MERCHANT_CODE,

      // Payee Information
      payee_identifier: process.env.MERCHANT_CODE,
      payee_identifier_type: "04",
      payee_type: "5000",
    },
  };

  request.sign = signRequestObject(request);
  request.sign_type = "SHA256WithRSA";

  // console.log("REQUEST:", request);

  return request;
}

module.exports = {
  requestCreateOrder: requestCreateOrder,
};
