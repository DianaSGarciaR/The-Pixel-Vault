const API_URL = 'http://localhost:8080/api/products';

// Función para obtener todos los productos del backend
export const obtenerProductos = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('No se pudo conectar con el servidor');
        }
        return await response.json();
    } catch (error) {
        console.error("Error en el servicio de productos:", error);
        return [];
    }
};

