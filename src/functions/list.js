const MongoQS = require("mongo-querystring");
const Context = require("../domain/context.js");
const { ImageSet } = require("../domain/image.js");

const qs = new MongoQS();

module.exports.handler = async function(event, context) {
  const mongo = await Context.connect();
  const requestParams = event.queryStringParameters;
  
  let query = qs.parse(requestParams);
  let sort = { supplyIndex: -1 };
  
  if(requestParams.sortFields && requestParams.sortDirection) {
    sort = {};
    const fields = requestParams.sortFields.split('|');
    
    fields.forEach(element => {
      sort[element] = requestParams.sortDirection
    });

    delete query['sortFields'];
    delete query['sortDirection'];
  }
  
  const images = await ImageSet.find(query).sort(sort);
  
  await mongo.disconnect();

  return {
    statusCode: 200,
    body: JSON.stringify(images)
  };
}

 