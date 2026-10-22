export async function obtenerUsuario() {
    const url = 'http://localhost:8080/api/users/3';
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return response.json();
}

