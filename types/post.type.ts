// interface Post {
//     id: string,
//     title: string,
//     content: string,
//     author: string
// }

interface Post {
    _id: {
        $oid: string
    },
    title: string,
    content: string,
    author: string
}

export { Post };