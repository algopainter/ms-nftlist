const Context = require("../domain/context.js");
const { ImageSet } = require("../domain/image.js");

module.exports.handler = async function(event, context) {
  await Context.connect();
  const images = await ImageSet.find().sort({ supplyIndex: -1 });

  return {
    statusCode: 200,
    body: JSON.stringify(images)
  };
}

 