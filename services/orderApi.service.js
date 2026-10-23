
carrito.forEach(product => {
    fetch('http://localhost:8080/api/order-products', {
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