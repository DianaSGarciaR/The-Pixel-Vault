const BASE_URL = "http://localhost:8080/api/users";
export const createArtist = async function (usertObject) {
    try {
        const response = await fetch(`${BASE_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usertObject),
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