import { Application } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import router from './routes/posts.routes.ts'
import errorHandler from './middlewares/errorHandler.ts';

const app = new Application();
const env = config();

app.use(errorHandler);

app.use(router.routes());
app.use(router.allowedMethods());

console.log('server running on port 3000')

await app.listen({ port: +env.PORT });

