document.addEventListener("DOMContentLoaded", function() {
    let products = [];

    // Fetch product data from JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            products = data;

            // Add event listener to the search button after products are loaded
            document.getElementById('searchButton').addEventListener('click', function() {
                performSearch();
            });

            // Add event listener to the search input for the "Enter" key
            document.getElementById('searchInput').addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    performSearch();
                }
            });
        });

    // Function to perform the search
    function performSearch() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

        // If no search term, do nothing
        if (!searchTerm) return;

        // Filter products by search term
        const filteredProducts = products.filter(product => {
            const titleMatch = product.title.toLowerCase().includes(searchTerm);
            const tagMatch = product.tags.some(tag => tag.toLowerCase().includes(searchTerm));
            return titleMatch || tagMatch;
        });

        // Redirect to category page with search results
        if (filteredProducts.length > 0) {
            displaySearchResults(filteredProducts);
        } else {
            alert("No products found for your search.");
        }
    }

    // Function to display search results
    function displaySearchResults(filteredProducts) {
        sessionStorage.setItem('filteredProducts', JSON.stringify(filteredProducts));
        window.location.href = "category.html";
    }
});
