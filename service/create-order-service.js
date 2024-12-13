const applyFabricToken = require("./apply-fabric-token");
const { requestCreateOrder } = require("./request-create-order");
const createRawRequest = require("./create-raw-request");

module.exports = async function createOrder(req, res) {
  try {
    // Step 1: Obtain the fabric token
    const applyFabricTokenResult = await applyFabricToken();
    const fabricToken = applyFabricTokenResult.token;

    if (!fabricToken) {
      throw new Error("Failed to retrieve fabric token");
    }

    // Step 2: Create order with the fabric token
    const requestCreateOrderResult = await requestCreateOrder(
      req.body,
      fabricToken
    );

    if (!requestCreateOrderResult || !requestCreateOrderResult.biz_content) {
      throw new Error("Failed to create order");
    }

    // Step 3: Generate raw request using the prepay_id from the order result
    const prepaidId = requestCreateOrderResult.biz_content.prepay_id;
    const rawRequest = createRawRequest(prepaidId);

    // Step 4: Return the successful response
    return { rawRequest };
  } catch (error) {
    return error;
  }
};
