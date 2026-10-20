const BASE_URL = "http://localhost:8080/api/";


export const createProduct = async function (productObject) {
  try {
    const response = await fetch(`${BASE_URL}/categories/1/products`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(productObject),
    });
    if (!response.ok)
      throw Error("Error al crear el producto: ", response.status);
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Fallo en la peticion: ", error.message);
  }
};