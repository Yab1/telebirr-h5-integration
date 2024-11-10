const applyFabricToken = require("./apply-fabric-token");
const { requestCreateOrder } = require("./request-create-order");

module.exports = async function createOrder(req, res) {
  const applyFabricTokenResult = await applyFabricToken();
  const fabricToken = applyFabricTokenResult.token;

  const requestCreateOrderResult = await requestCreateOrder(req.body);
  console.log("requestCreateOrderResult:", requestCreateOrderResult);

  const prepaidId = requestCreateOrderResult.biz_content.prepay_id;

  return {
    token: fabricToken,
    prepaidId: prepaidId,
  };
};
