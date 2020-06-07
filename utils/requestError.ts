interface RequestError extends Error {
    status: number;
}

export default RequestError;