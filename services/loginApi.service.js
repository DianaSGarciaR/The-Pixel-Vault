const BASE_URL = "http://localhost:8080/api/auth";
const BASE_URL_USER = "http://localhost:8080/api/users";


export const createUser = async function (usertObject) {
    try {
        const response = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usertObject)
        });
        if (!response.ok)
            throw Error("Error al crear el user: ", response.status);
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Fallo en la peticion: ", error.message);
    }
};

export const loginUser = async function (loginObject) {
    try {
        const response = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginObject)
        });
        if (!response.ok)
            throw Error("Error al inicar sesion: ", response.status);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fallo en la peticion: ", error.message);
    }
}

export const getUserByEmail = async function (token, email) {
    try {
        const response = await fetch(`${BASE_URL_USER}/email/${email}`, {
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
}