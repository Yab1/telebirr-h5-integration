const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

module.exports = async function applyFabricToken() {
  try {
    const response = await axios.post(
      `${process.env.BASE_URL}/payment/v1/token`,
      { appSecret: process.env.APP_SECRET },
      {
        headers: {
          "Content-Type": "application/json",
          "X-APP-Key": process.env.FABRIC_APP_ID,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
