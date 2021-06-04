import Context from "../domain/context.js";
import { ImageSet } from "../domain/image.js";

const handler = async function(event, context) {
  await Context.connect();
  const images = await ImageSet.find().sort({ supplyIndex: -1 });

  return {
    statusCode: 200,
    body: JSON.stringify(images)
  };
}

export { handler };