export const sendJSON = async (url: string, payload: any) => {
    return await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
        credentials: "include",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });
};
