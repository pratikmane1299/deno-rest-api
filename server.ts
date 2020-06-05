import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

router.get('/', ({ response }: { response: any }) => {
   response.body = 'Hello World!' 
});

console.log('server running on port 3000')

await app.listen({ port: 3000 })

