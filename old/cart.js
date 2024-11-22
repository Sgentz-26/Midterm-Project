document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to update cart display
    function updateCart() {
        cartItemsContainer.innerHTML = ''; // Clear the cart table
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = (parseFloat(item.price.replace('$', '')) * item.quantity).toFixed(2);
            total += parseFloat(itemTotal);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.title}</td>
                <td>${item.price}</td>
                <td>
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}">
                </td>
                <td>$${itemTotal}</td>
                <td><button class="btn btn-danger btn-sm remove-item" data-index="${index}">Remove</button></td>
            `;

            cartItemsContainer.appendChild(row);
        });

        cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    // Event: Change quantity
    cartItemsContainer.addEventListener('input', function(e) {
        if (e.target.classList.contains('quantity-input')) {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity = parseInt(e.target.value);
            saveCart();
        }
    });

    // Event: Remove item
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1); // Remove item from cart
            saveCart();
        }
    });

    // Initial load of cart
    updateCart();
});
