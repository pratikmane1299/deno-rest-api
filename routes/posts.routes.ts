import { Router } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const router = new Router();

let posts = [
    {
        id: "1",
        title: 'First Post',
        content: 'This is my first post',
        author: 'Bobby'
    },
    {
        id: "2",
        title: 'Second Post',
        content: 'This is my first post',
        author: 'Sadio'
    },
    {
        id: "3",
        title: 'Third Post',
        content: 'This is my first post',
        author: 'Momo'
    }
];

router
    .get('/api/v1/posts', ({ response }: { response: any}) => {
        response.body = {
            success: true,
            posts
        }
    })
    .get('/api/v1/posts/:id', ({ params, response }: { params: { id: string}, response: any}) => {
        const post = posts.find(p => p.id === params.id);

        if (post) {
            response.status = 200
            response.body = {
                success: true,
                post
            }
        } else {
            response.status = 400
            response.body = {
                success: false,
                message: 'Post for the given id not found'
            }
        }
    })
    .post('/api/v1/posts', async ({ request, response }: { request: any, response: any}) => {
        const body = await request.body();

        if (!request.hasBody) {
            response.status = 400;
            response.body = {
                success: false,
                message: 'Post data not found in request'
            }
        } else {
            const post = body.value;
            post.id = v4.generate();
            posts.push(post);

            response.status = 201;
            response.body = {
                success: true,
                post
            }
        }
    })
    .put('/api/v1/posts/:id', async ({ request, response, params }: { request: any, response: any, params: { id: string } }) => {
        if (!request.hasBody) {
            response.status = 401;
            response.body = {
                success: false,
                message: 'Post data not found in request'
            }
        } else {
            const body = await request.body();
            let post = posts.find(p => p.id === params.id);
            if (!post) {
                    response.status = 400;
                    response.body = {
                    success: false,
                    message: 'Post with id not found'
                }
            } else {
                const data: { title?: string, content?: string, author?: string } = body.value; 

                posts = posts.map(p => p.id === params.id ? { ...p, ...data} : p)
                post = posts.find(p => p.id === params.id);
                response.body = {
                    success: true,
                    post
                }
            }
        }
    })
    .delete('/api/v1/posts/:id', ({ params, response }: { params: { id: string }, response: any }) => {
        const post = posts.find(p => p.id === params.id);

        if (!post) {
            response.status = 400
            response.body = {
                success: false,
                message: 'Post for the given id not found'
            }
        } else {
            posts = posts.filter(p => p.id !== params.id);
            response.status = 200;
            response.body = {
                success: true,
                message: 'Post with the given id deleted'
            }
        }
    })
export default router;