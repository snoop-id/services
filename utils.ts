import axios from "axios";

export function internalRequest(
    method: "GET" | "POST" | "PUT" | "DELETE",
    endpoint: string,
    token: string,
    data?: Record<string, any>
) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios(
                `http://localhost:${process.env.PORT}${endpoint}`,
                {
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data,
                }
            );

            resolve(response.data);
        } catch (error) {
            console.error(error);
            reject();
        }
    });
}
