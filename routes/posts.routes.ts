import { Router } from "https://deno.land/x/oak/mod.ts";

import { getAllPosts, getSinglePost, addPost, updatePost, deletePost } from './../controllers/posts.controller.ts';

const router = new Router();

router
    .get('/api/v1/posts', getAllPosts)
    .get('/api/v1/posts/:id', getSinglePost)
    .post('/api/v1/posts', addPost)
    .put('/api/v1/posts/:id', updatePost)
    .delete('/api/v1/posts/:id', deletePost)
export default router;