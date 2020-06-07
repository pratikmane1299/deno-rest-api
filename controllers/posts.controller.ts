import { posts } from './../dbConnect.ts';
import RequestError from './../utils/requestError.ts';

const getAllPosts = async ({ response }: { response: any }) => {
    let allPosts;
    try {
        allPosts = await posts.find();
    } catch (err) {
        throw err;
    }

    if (allPosts.length === 0) {
        const error = new Error('Posts not found') as RequestError;
        error.status = 404;
        throw error;

    } else {
        response.status = 200;
        response.body = {
            success: true,
            posts: allPosts
        };
    }
}

const getSinglePost = async ({ params, response }: { params: { id: string }, response: any }) => {

    let post;

    try {
        post = await getPostById(params.id);
    } catch (err) {
        throw err;
    }

    if (post) {
        response.status = 200
        response.body = {
            success: true,
            post
        }
    } else {
        const error = new Error('Post for the given id not found') as RequestError
        error.status = 400;

        throw error;
    }
}

const addPost = async ({ request, response }: { request: any, response: any }) => {
    try {
        const body = await request.body();

        if (!request.hasBody) {
            const error = new Error('Post data not found in request') as RequestError;
            error.status = 400
            throw error
        } else {
            const post = body.value;

            const id = await posts.insertOne({
                title: post.title,
                content: post.content,
                author: post.author
            });

            response.status = 201;
            response.body = {
                success: true,
                post: { ...post, ...id }
            };
        }
    } catch (err) {
        throw err;
    }
}

const updatePost = async ({ request, response, params }: { request: any, response: any, params: { id: string } }) => {
    try {
        if (!request.hasBody) {
            const error = new Error('Post data not found in request') as RequestError;
            error.status = 400;

            throw error;
        } else {
            const body = await request.body();
            let post = await getPostById(params.id);
            if (!post) {
                const error = new Error('Post with id not found') as RequestError;
                error.status = 400;
                throw error;
            } else {
                const data: { title?: string, content?: string, author?: string } = body.value;

                const { matchedCount, modifiedCount, upsertedId } = await posts.updateOne({ _id: { "$oid": params.id } }, data);

                response.status = 204;
                response.body = {
                    success: true,
                    message: 'Post updated'
                };
            }
        }
    } catch (err) {
        throw err;
    }
}

const deletePost = async ({ params, response }: { params: { id: string }, response: any }) => {
    try {
        const post = await getPostById(params.id);

        if (!post) {
            const error = new Error('Post for the given id not found') as RequestError
            error.status = 400;
            throw error;

        } else {

            await posts.deleteOne({ _id: { "$oid": params.id } });
            response.status = 204;
            response.body = {
                success: true,
                message: 'Post deleted'
            };
        }
    } catch (err) {
        throw err;
    }
}

const getPostById = (id: string) => {
    return posts.findOne({ _id: { "$oid": id } });
}

export { getAllPosts, getSinglePost, addPost, updatePost, deletePost }