document.addEventListener('DOMContentLoaded', function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');  // Get product ID from URL

    let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart from localStorage or initialize as empty

    fetch('data.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id == productId);
            if (product) {
                displayProductDetails(product);
            } else {
                console.error('Product not found');
            }
        });

    function displayProductDetails(product) {
        document.title = product.title;
        document.getElementById('product-title').textContent = product.title;
        document.getElementById('product-manufacturer').textContent = product.manufacturer || 'Manufacturer';  // Add manufacturer if available
        document.getElementById('product-price').textContent = product.price;
        document.getElementById('product-description').textContent = product.description || 'No description available';
        
        const productImage = document.getElementById('product-image');
        productImage.src = product.image;
        
        const ratingContainer = document.getElementById('product-rating');
        ratingContainer.innerHTML = '';
        for (let i = 0; i < Math.floor(product.rating); i++) {
            ratingContainer.innerHTML += '⭐';
        }
    }
    // Function to add the product to the cart
    function addToCart(product) {
        const existingProduct = cart.find(item => item.id == product.id);

        if (existingProduct) {
            existingProduct.quantity += 1; // Increment quantity if product is already in the cart
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                quantity: 1  // Start with a quantity of 1
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));  // Save cart to localStorage
        alert(`${product.title} has been added to your cart!`);
        updateCartTotal();  // Update cart total
    }

    // Function to update the cart total in localStorage
    function updateCartTotal() {
        let total = 0;
        cart.forEach(item => {
            total += parseFloat(item.price.replace('$', '')) * item.quantity;
        });
        localStorage.setItem('cartTotal', total.toFixed(2));  // Save total to localStorage
    }

});
