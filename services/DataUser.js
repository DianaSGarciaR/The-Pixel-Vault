export async function obtenerUsuario(userId) {
    const url = `http://localhost:8080/api/users/${userId}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return response.json();
}

