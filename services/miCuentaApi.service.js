const BASE_URL = "http://localhost:8080/api/orders";

export const getAllOrdersByIdUser = async function (token, usersId) {
    try {
        const response = await fetch(`${BASE_URL}/users/${usersId}/orders`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
        });
        if (!response.ok)
            throw Error("Error al obtener lista de ordenes: ", response.status);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fallo en la peticion: ", error.message);
    }
};