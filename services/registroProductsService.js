const BASE_URL = "http://localhost:8080/api/";

export const createProduct = async function (token,productObject,type,category) {
  // PRIMER POST (crear producto)
  const response = await fetch(`${BASE_URL}products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(productObject),
  });

  if (!response.ok) {
    throw new Error(`Error al crear el producto: ${response.status}`);
  }

  const data = await response.json();
  console.log("Producto creado:", data);

  // SEGUNDO POST (asignar a categoría) — solo se ejecuta si el primero OK
  const response2 = await fetch(
    `${BASE_URL}products/${data.id}/categories/${type}`,{
      method: "POST",
      headers: {Authorization: `Bearer ${token}`}
      }
  );

  if (!response2.ok) {
    throw new Error(
      `Producto ${data.id} creado, pero error al asignar categoría: ${response2.status}`
    );
  }

  // TERCER POST (asignar a categoría) — solo se ejecuta si el primero OK
  const response3 = await fetch(
    `${BASE_URL}products/${data.id}/categories/${category}`,{
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!response3.ok) {
    throw new Error(
      `Producto ${data.id} creado, pero error al asignar categoría: ${response3.status}`
    );
  }
  return data;
};