const BASE_URL_ORDER = "http://localhost:8080/api/orders";
const BASE_URL_ORDER_TRACKING = "http://localhost:8080/api/orderTracking";
const BASE_URL_ORDER_PRODUCT = "http://localhost:8080/api/order-products";

/*
carrito.forEach(product => {
    fetch(`${BASE_URL_ORDER_PRODUCT}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            orderId: orderIdValue,
            productId: product.id,
            orderQuantity: product.cantidad,
            purchasePrice: product.precio
        })
    })
        .then(response => {
            if (!response.ok) throw new Error('Error al registrar el producto');
            return response.json();
        })
        .then(data => console.log('Producto registrado:', data))
        .catch(error => console.error('Error:', error));
});
*/

export const createOrderData = async function (token, usersId, orderObjec, listProductos, ordenTraking) {
    // PRIMER POST (crear Orden)
    const response = await fetch(`${BASE_URL_ORDER}/${usersId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderObjec),
    });

    if (!response.ok) {
        throw new Error(`Error al crear el producto: ${response.status}`);
    }

    const data = await response.json();
    console.log("Order creado:", data);

    // SEGUNDO POST (asignar productos a la orden) 
    listProductos.forEach(product => {
        fetch(`${BASE_URL_ORDER_PRODUCT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                orderId: data.id,
                productId: product.id,
                orderQuantity: product.cantidad,
                purchasePrice: product.price
            })
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al registrar el producto');
                return response.json();
            })
            .then(data => console.log('Producto registrado:', data))
            .catch(error => console.error('Error:', error));
    });

    ordenTraking.orderId = data.id;

    // TERCER POST (crear el seguimiento de la orden)
    const response3 = await fetch(`${BASE_URL_ORDER_TRACKING}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(ordenTraking),
    });

    if (!response3.ok) {
        throw new Error(
            `Order ${data.id} creado, pero error al asignar orden Traking: ${response3.status}`
        );
    }
    return data;
};