import { handler } from './src/functions/list.js'

(async () => {
  const result = await handler(null, null);
  console.log(result);
})();