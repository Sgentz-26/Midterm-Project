document.addEventListener("DOMContentLoaded", function() {
    const itemsToShow = 5; // Number of products to show at once
    let productWidth;
    
    // Fetch product data from JSON file
    fetch('data.json')
      .then(response => response.json())
      .then(products => {
        const carousel = document.getElementById('carouselItems');
        
        // Add products to the carousel
        products.forEach(product => {
          const productCard = createProductCard(product);
          carousel.appendChild(productCard);
        });
  
        // Set the width of the product based on container width
        productWidth = document.querySelector('.product-card').offsetWidth;
  
        // Event listeners for prev/next buttons
        document.querySelector('.carousel-next').addEventListener('click', () => {
          slideCarousel('next', productWidth);
        });
  
        document.querySelector('.carousel-prev').addEventListener('click', () => {
          slideCarousel('prev', productWidth);
        });
      });
  
    // Function to create a product card
    function createProductCard(product) {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.style.cursor = "pointer";

      // Create the clickable link inside the product card
      const link = document.createElement('a');
      link.href = `product_page.html?id=${product.id}`;
      link.style.textDecoration = 'none';  // Remove underline
      link.style.color = 'inherit';        // Inherit text color

      // Add image, title, price, and rating to the product card
      link.innerHTML = `
        <img src="${product.images[0]}" alt="${product.title}">
        <h5>${product.title}</h5>
        <p><strong>${product.price}</strong></p>
        <p>Rating: ${product.rating} ⭐</p>
      `;

      card.appendChild(link);  // Add link to the product card
      return card;
    }


    // Function to slide the carousel and recycle items
    function slideCarousel(direction, productWidth) {
      const carousel = document.getElementById('carouselItems');
      const items = carousel.querySelectorAll('.product-card');
  
      if (direction === 'next') {
        // Move the first item to the end (wrap around)
        const firstItem = items[0];
        carousel.style.transition = "transform 0.5s ease";
        carousel.style.transform = `translateX(-${productWidth + 20}px)`; // Slide left
        
        // After the transition ends, move the first item to the end
        setTimeout(() => {
          carousel.style.transition = "none"; // Disable transition to reset position
          carousel.appendChild(firstItem); // Move first item to the end
          carousel.style.transform = `translateX(0)`; // Reset the carousel position
        }, 500); // Match the transition duration
      } else if (direction === 'prev') {
        // Move the last item to the front (wrap around)
        const lastItem = items[items.length - 1];
        carousel.style.transition = "none"; // Disable transition to reposition instantly
        carousel.style.transform = `translateX(-${productWidth + 20}px)`;
        carousel.insertBefore(lastItem, items[0]); // Move last item to the front
        
        // Re-enable transition and slide back to the initial position
        setTimeout(() => {
          carousel.style.transition = "transform 0.5s ease"; // Smooth transition
          carousel.style.transform = `translateX(0)`; // Slide right
        }, 50); // Tiny delay to ensure DOM reflow before transition
      }
    }
  });
  