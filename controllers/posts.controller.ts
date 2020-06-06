import { v4 } from "https://deno.land/std/uuid/mod.ts";
import Post from './../types/post.type.ts';
import { db, posts } from './../dbConnect.ts';

//let posts: Post[] = [];

const getAllPosts = async ({ response }: { response: any }) => {

    const allPosts = await posts.find();

    if (allPosts.length === 0) {
        response.status = 404;
        response.body = {
            success: false,
            message: 'Posts not found'
        }
    } else {
        response.status = 200;
        response.body = {
            success: true,
            posts: allPosts
        }
    }

}

const getSinglePost = async ({ params, response }: { params: { id: string }, response: any }) => {

    const post = await getPostById(params.id);

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
    /* const body = await request.body();

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
    } */

    const body = await request.body();

    if (!request.hasBody) {
        response.status = 400;
        response.body = {
            success: false,
            message: 'Post data not found in request'
        }
    } else {
        const post = body.value;

        const id = posts.insertOne({
            title: post.title,
            content: post.content,
            author: post.author
        })

        response.status = 201;
        response.body = {
            success: true,
            post: { ...post, ...id }
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
        let post = await getPostById(params.id);
        if (!post) {
            response.status = 400;
            response.body = {
                success: false,
                message: 'Post with id not found'
            }
        } else {
            const data: { title?: string, content?: string, author?: string } = body.value;

            const { matchedCount, modifiedCount, upsertedId } = await posts.updateOne({ _id: { "$oid": params.id }}, data);
            
            post = await getPostById(params.id);
            
            response.status = 200;
            response.body = {
                success: true,
                post
            }
        }
    }
}

const deletePost = async ({ params, response }: { params: { id: string }, response: any }) => {
    const post = await getPostById(params.id);

    if (!post) {
        response.status = 400
        response.body = {
            success: false,
            message: 'Post for the given id not found'
        }
    } else {

        const deleteCount = await posts.deleteOne({ _id: { "$oid": params.id } });

        if (deleteCount === 1) {
            response.status = 200;
            response.body = {
                success: true,
                message: 'Post with the given id deleted'
            }
        } else {
            response.status = 500;
            response.body = {
                success: true,
                message: 'Internal server error'
            }
        }
    }
}

const getPostById = (id: string) => {
    return posts.findOne({ _id: { "$oid": id } });
}

export { getAllPosts, getSinglePost, addPost, updatePost, deletePost }