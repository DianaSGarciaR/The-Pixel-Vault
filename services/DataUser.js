export async function obtenerUsuario(token, userId) {
    const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error(`Error HTTP al obtener usuario: ${response.status}`);
    }

    return response.json();
}
