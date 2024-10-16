document.addEventListener('DOMContentLoaded', function() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('id');  // Get product ID from URL

    fetch('products.json')
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
});
