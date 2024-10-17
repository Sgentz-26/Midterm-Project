document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category'); // Get category from the URL
    const productGrid = document.getElementById('productGrid'); // Select the product grid container
    const sortSelect = document.getElementById('sort-select'); // Select the sorting dropdown

    let productsToDisplay = [];

    // Clear search results when loading the category page to avoid showing stale search data
    const searchResults = JSON.parse(sessionStorage.getItem('filteredProducts'));
    
    if (!category && searchResults && searchResults.length > 0) {
        // Only show search results if no category is selected, meaning user just performed a search
        productsToDisplay = searchResults;
        displayProducts(productsToDisplay, 'Search Results');
        sessionStorage.removeItem('filteredProducts'); // Clear search results once displayed
    } else if (category) {
        // Load products based on category
        document.getElementById('category-title').innerText = category;
        document.title = category;

        // Fetch product data from the JSON file
        fetch('products.json')
            .then(response => response.json())
            .then(products => {
                // Filter products based on category
                productsToDisplay = products.filter(product => product.category === category);
                displayProducts(productsToDisplay);
            });
    } else {
        // If no category or search results, show "No Products Found"
        document.getElementById('category-title').innerText = 'No Products Found';
        document.title = 'No Products Found';
    }

    // Add event listener for the sort dropdown
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(sortSelect.value, productsToDisplay);
        });
    }

    // Function to sort products
    function sortProducts(sortType, products) {
        let sortedProducts;
        switch (sortType) {
            case 'price-low-to-high':
                sortedProducts = products.sort((a, b) => parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', '')));
                break;
            case 'price-high-to-low':
                sortedProducts = products.sort((a, b) => parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', '')));
                break;
            case 'rating-low-to-high':
                sortedProducts = products.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
                break;
            case 'rating-high-to-low':
                sortedProducts = products.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
                break;
            default:
                sortedProducts = products; // Default sort (unsorted)
                break;
        }
        displayProducts(sortedProducts); // Redisplay sorted products
    }

    // Function to display products
    function displayProducts(products, title = category) {
        // Clear the product grid
        productGrid.innerHTML = '';

        // Update the category title
        document.getElementById('category-title').innerText = title;
        document.title = title;

        // Add products to the grid
        products.forEach(product => {
            const productCard = createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }

    // Function to create a product card
    function createProductCard(product) {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h5>${product.title}</h5>
            <p><strong>${product.price}</strong></p>
            <p>Rating: ${product.rating} ⭐</p>
            <a href="product_page.html?id=${product.id}">View Product</a>
        `;

        return card;
    }
});
