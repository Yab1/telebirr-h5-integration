const dotenv = require("dotenv");
const pmlib = require("./sign-util-lib");

dotenv.config();

// Fields not participating in signature
const excludeFields = [
  "sign",
  "sign_type",
  "header",
  "refund_info",
  "openType",
  "raw_request",
  "biz_content",
];

function signRequestObject(requestObject) {
  const filteredRequestObjectKeys = [];
  const filteredRequestObject = {};

  // Spread the properties of requestObject and its biz_content property (if it exists),
  // and convert it into an array of key-value pairs using Object.entries().
  Object.entries({
    ...requestObject,
    ...(requestObject.biz_content || {}),
  })
    // Filter out any entries whose key is in the excludeFields array
    .filter(([key]) => !excludeFields.includes(key))
    // For each key-value pair, add the key to the filteredRequestObjectKeys array and the key-value pair to the filteredRequestObject object
    .forEach(([key, value]) => {
      filteredRequestObjectKeys.push(key);
      filteredRequestObject[key] = value;
    });

  // sort by ascii
  filteredRequestObjectKeys.sort();

  // Mapping keys and values from filteredRequestObject to "key=value" format, resulting in an array like:
  // ["appid=1311232930739201", "business_type=BuyGoods", ...]
  const formattedKeyValuePairs = filteredRequestObjectKeys.map(
    (key) => `${key}=${filteredRequestObject[key]}`
  );

  // Joining the formatted key-value pairs with "&" to create a single query string,
  // resulting in a string like: "appid=1311232930739201&business_type=BuyGoods&..."
  const queryParamString = formattedKeyValuePairs.join("&");

  return signString(queryParamString, process.env.PRIVATE_KEY);
}

const signString = (queryParamString, privateKey) => {
  const sha256withrsa = new pmlib.rs.KJUR.crypto.Signature({
    alg: "SHA256withRSAandMGF1",
  });
  sha256withrsa.init(privateKey);
  sha256withrsa.updateString(queryParamString);
  const sign = pmlib.rs.hextob64(sha256withrsa.sign());
  return sign;
};

function createTimeStamp() {
  return Math.round(new Date() / 1000) + "";
}

// create a 32 length random string
function createNonceStr() {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let str = "";
  for (let i = 0; i < 32; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
}

module.exports = {
  signString: signString,
  signRequestObject: signRequestObject,
  createTimeStamp: createTimeStamp,
  createNonceStr: createNonceStr,
};
