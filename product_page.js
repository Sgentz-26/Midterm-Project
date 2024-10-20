document.addEventListener('DOMContentLoaded', function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
        document.getElementById('product-manufacturer').textContent = product.manufacturer || 'Unknown Manufacturer';
        document.getElementById('product-price').textContent = product.price;
        document.getElementById('product-description').textContent = product.description || 'No description available';

        const productImage = document.getElementById('product-image');
        const carouselPrev = document.getElementById('carousel-prev');
        const carouselNext = document.getElementById('carousel-next');
        const thumbnailContainer = document.getElementById('thumbnail-container');
        const ratingContainer = document.getElementById('product-rating');

        ratingContainer.innerHTML = '';
        for (let i = 0; i < Math.floor(product.rating); i++) {
            ratingContainer.innerHTML += '⭐';
        }

        let currentIndex = 0;

        // Handle multiple images
        if (product.images && product.images.length > 1) {
            // Display the first image
            productImage.src = product.images[currentIndex];

            // Create thumbnails
            thumbnailContainer.innerHTML = '';
            product.images.forEach((imgSrc, index) => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.classList.add('thumbnail');
                img.addEventListener('click', () => {
                    productImage.src = imgSrc;
                    currentIndex = index; // Update current index
                });
                thumbnailContainer.appendChild(img);
            });

            // Show navigation arrows if more than one image
            carouselPrev.style.display = 'block';
            carouselNext.style.display = 'block';

            // Add event listeners for previous and next buttons
            carouselPrev.addEventListener('click', () => {
                currentIndex = (currentIndex === 0) ? product.images.length - 1 : currentIndex - 1;
                productImage.src = product.images[currentIndex];
            });

            carouselNext.addEventListener('click', () => {
                currentIndex = (currentIndex === product.images.length - 1) ? 0 : currentIndex + 1;
                productImage.src = product.images[currentIndex];
            });
        } else {
            // Single image - hide carousel arrows
            productImage.src = product.image || product.images[0];
            carouselPrev.style.display = 'none';
            carouselNext.style.display = 'none';
        }

        const addToCartButton = document.querySelector('.add-to-cart-btn');

        // Add click event to the "Add to Cart" button
        addToCartButton.addEventListener('click', function() {
            addToCart(product, addToCartButton);
        });
    }

    // Function to add the product to the cart
    function addToCart(product, button) {
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
        updateCartTotal();

        // Add success class and change text
        button.textContent = "Added to Cart!";
        button.classList.add('success');

        // Revert back after 2 seconds
        setTimeout(() => {
            button.classList.remove('success');
            button.textContent = "Add to Cart";
        }, 1500);
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
