import { v4 } from "https://deno.land/std/uuid/mod.ts";
import Post from './../types/post.type.ts';

let posts: Post[] = [];

const getAllPosts = ({ response }: { response: any }) => {

    if (posts.length === 0) {
        response.status = 404;
        response.body = {
            success: false,
            message: 'Posts not found'
        }
    } else {
        response.status = 200;
        response.body = {
            success: true,
            posts
        }
    }
    
}

const getSinglePost = ({ params, response }: { params: { id: string }, response: any }) => {
    const post = getPostById(params.id);

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
}

const addPost = async ({ request, response }: { request: any, response: any }) => {
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
}

const updatePost = async ({ request, response, params }: { request: any, response: any, params: { id: string } }) => {
    if (!request.hasBody) {
        response.status = 401;
        response.body = {
            success: false,
            message: 'Post data not found in request'
        }
    } else {
        const body = await request.body();
        let post = getPostById(params.id);
        if (!post) {
            response.status = 400;
            response.body = {
                success: false,
                message: 'Post with id not found'
            }
        } else {
            const data: { title?: string, content?: string, author?: string } = body.value;

            posts = posts.map(p => p.id === params.id ? { ...p, ...data } : p)
            post = getPostById(params.id);
            
            response.status = 200;
            response.body = {
                success: true,
                post
            }
        }
    }
}

const deletePost = ({ params, response }: { params: { id: string }, response: any }) => {
    const post = getPostById(params.id);

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
}

const getPostById = (id: string) => {
    return posts.find(p => p.id === id);
}

export { getAllPosts, getSinglePost, addPost, updatePost, deletePost }