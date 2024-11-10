const dotenv = require("dotenv");
const axios = require("axios");
const { createNonceStr, signRequestObject } = require("../utils/tools");

dotenv.config();

async function requestCreateOrder(requestBody) {
  const { fabricToken } = requestBody;
  const requestObject = createRequestObject(requestBody);

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
}

async function createRawRequest() {}

function createRequestObject(requestBody) {
  const {
    title,
    total_amount,
    trans_currency,
    merchant_order_id,
    notify_url,
    redirect_url,
    timestamp,
  } = requestBody;

  const request = {
    nonce_str: createNonceStr(),
    biz_content: {
      // URLs for notifications and user redirection after transaction.
      notify_url: notify_url,
      redirect_url: redirect_url,

      // Product Information
      title: title,
      business_type: "BuyGoods",

      // Basic Transaction Details
      trans_currency: trans_currency,
      total_amount: total_amount,
      merch_order_id: merchant_order_id,
      trade_type: "Checkout",
      timeout_express: "120m",

      // Merchant Information
      appid: process.env.MERCHANT_APP_ID,
      merch_code: process.env.MERCHANT_CODE,
    },
    method: "payment.preorder",
    version: "1.0",
    sign_type: "SHA256WithRSA",
    timestamp: timestamp,
  };

  request.sign = signRequestObject(request);

  return request;
}

module.exports = {
  requestCreateOrder: requestCreateOrder,
  createRawRequest: createRawRequest,
};
