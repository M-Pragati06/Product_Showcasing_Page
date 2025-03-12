let allProducts = []; 
let checkedCategories = []; 
let currentSortCriteria = 'default';
let uniqueBrands = [];
let selectedRatingFilter = 0;
let selectedAvailabilityFilter = 'all'; 

// Function to fetch product data from the Dummy JSON API
async function fetchProducts() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'flex'; 

    try {
        const response = await fetch('https://dummyjson.com/products?limit=1000');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allProducts = data.products; 
        console.log(allProducts)
        uniqueBrands = [...new Set(allProducts.map(product => product.brand))]; 
        populateBrandDropdown(uniqueBrands); 
        allProducts.forEach(product => {
            product.stock = Math.random() > 0.5 ? 'inStock' : 'outOfStock'; 
        });
        renderProducts(allProducts); 
    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        spinner.style.display = 'none'; 
    }
}


// Function to show suggestions based on the search input
function showSuggestions(value) {
    const suggestionsContainer = document.getElementById('suggestions');
    suggestionsContainer.innerHTML = ''; 

    if (value.length === 0) {
        return; 
    }

    const filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(value.toLowerCase())
    );

    filteredProducts.forEach(product => {
        const suggestionItem = document.createElement('div');
        suggestionItem.classList.add('suggestion-item');
        suggestionItem.innerHTML = highlightText(product.title, value); 
        suggestionItem.onclick = () => selectSuggestion(product.title);
        suggestionsContainer.appendChild(suggestionItem);
    });
}

// Function to handle selection of a suggestion
function selectSuggestion(productTitle) {
    document.getElementById('search-input').value = productTitle;
    document.getElementById('suggestions').innerHTML = ''; 
}

// Function to highlight matching text in the suggestion
function highlightText(text, searchTerm) {
    if (!searchTerm) return text; 
    const regex = new RegExp(`(${searchTerm})`, 'gi'); 
    return text.replace(regex, '<span class="highlight">$1</span>'); 
}

// Function to show only matching products based on the input value
function showMatchingProducts() {
    const inputValue = document.getElementById('search-input').value.toLowerCase();
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; 

    const filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(inputValue)
    );

    if (filteredProducts.length > 0) {
        filteredProducts.forEach(product => {
            const cardHTML = `
                <div class="col-12 col-md-4 col-lg-3 mb-4">
    <div class="card product-card card-style">
        <img src="${product.images[0]}" class="card-img-top" alt="Product Image" style="height: 200px; object-fit: cover;">
        <div class="card-body">
            <h5 class="card-title text-truncate">${product.title}</h5>
            <p class="card-text">$${product.price.toFixed(2)}</p>
            <div class="rating mb-2">
                ${getStars(product.rating)} 
            </div>
            <div class="description text-muted">
                ${truncateDescription(product.description, 10)}
            </div>
            
        </div>
        <div class="popup-info">
            <img src="${product.images[0]}" class="card-img-top" alt="Product Image" style="height: 150px; object-fit: cover;">
            
            <p class="card-title text-truncate">${product.title}</p>
            <p class="card-text">$${product.price.toFixed(2)}</p>
            <div class="description text-dark">
                ${truncateDescription(product.description, 10)}
            </div>
            <div class="rating mb-2">
                ${getStars(product.rating)} 
            </div>
            <div class="d-flex align-items-center mt-3">
                    <button class="btn add-btn me-2" onclick="addToCart('${product.id}')">Add to Cart</button>
                    <button class="btn" onclick="toggleWishlist('${product.id}')">
                        <i class="fas fa-heart" id="heart-${product.id}" style="color: ${isInWishlist(product.id) ? 'red' : 'black'};"></i>
                    </button>
                </div>
            </div>
            
        </div>
        </div>
            `;
            productContainer.innerHTML += cardHTML; 
        });
    } else {
 productContainer.innerHTML = '<p>No products found.</p>'; 
    }
}

// Function to get stars based on product rating
function getStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return '★'.repeat(fullStars) + (halfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

// Function to truncate the product description
function truncateDescription(description, maxWords) {
    const words = description.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : description;
}




// Function to populate the brand dropdown
function populateBrandDropdown(brands) {
    const brandSelect = document.querySelector('.form-select');
    brandSelect.innerHTML = '<option selected>Choose a brand...</option>'; // Reset the dropdown

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand; 
        option.textContent = brand; 
        brandSelect.appendChild(option); 
    });
}


let wishlist = []; // Array to store wishlist items

// Function to toggle wishlist status
function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    if (index === -1) {
        // If the product is not in the wishlist, add it
        wishlist.push(productId);
        document.getElementById(`heart-${productId}`).style.color = 'red';
    } else {
        // If the product is already in the wishlist, remove it
        wishlist.splice(index, 1);
        document.getElementById(`heart-${productId}`).style.color = 'black'; 
    }
}

// Function to check if a product is in the wishlist
function isInWishlist(productId) {
    return wishlist.includes(productId);
}


// Function to render products
function renderProducts(products) {
    const productContainer = document.getElementById('productContainer');
    productContainer.innerHTML = ''; 

    products.forEach(product => {
        const cardHTML = `
            <div class="col-12 col-md-4 col-lg-3 mb-4">
    <div class="card product-card card-style">
        <img src="${product.images[0]}" class="card-img-top" alt="Product Image" style="height: 200px; object-fit: cover;">
        <div class="card-body">
            <h5 class="card-title text-truncate">${product.title}</h5>
            <p class="card-text">$${product.price.toFixed(2)}</p>
            <div class="rating mb-2">
                ${getStars(product.rating)} 
            </div>
            <div class="description text-muted">
                ${truncateDescription(product.description, 10)}
            </div>
            
        </div>
        <div class="popup-info">
            <img src="${product.images[0]}" class="card-img-top" alt="Product Image" style="height: 150px; object-fit: cover;">
            
            <p class="card-title text-truncate">${product.title}</p>
            <p class="card-text">$${product.price.toFixed(2)}</p>
            <div class="description text-dark">
                ${truncateDescription(product.description, 10)}
            </div>
            <div class="rating mb-2">
                ${getStars(product.rating)} 
            </div>
            <div class="d-flex align-items-center mt-3">
                    <button class="btn add-btn me-2" onclick="addToCart('${product.id}')">Add to Cart</button>
                    <button class="btn" onclick="toggleWishlist('${product.id}')">
                        <i class="fas fa-heart" id="heart-${product.id}" style="color: ${isInWishlist(product.id) ? 'red' : 'black'};"></i>
                    </button>
                </div>
            </div>
            
        </div>
        </div>
        `;
        productContainer.innerHTML += cardHTML;
        
    });
}




// Function to generate star rating
function getStars(rate) {
    const fullStars = Math.floor(rate);
    const halfStar = rate % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : '';
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return '<i class="fas fa-star"></i>'.repeat(fullStars) + halfStar + '<i class="fas fa-star text-secondary"></i>'.repeat(emptyStars);
}

const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        const popup = card.querySelector('.popup-info');
        popup.style.display = 'block';
    });

    card.addEventListener('mouseleave', () => {
        const popup = card.querySelector('.popup-info');
        popup.style.display = 'none';
    });
});





// Function to filter products based on selected categories
function filterProductsByCategories() {
    if (checkedCategories.length === 0) {
        return allProducts; 
    }
    return allProducts.filter(product => 
        checkedCategories.includes(product.category)
    );
}

// Function to filter products based on selected price
function filterProductsByPrice(products, maxPrice) {
    return products.filter(product => product.price <= maxPrice); 
}

// Function to filter products based on selected brand
function filterProductsByBrand(products, selectedBrand) {
    if (selectedBrand === "Choose a brand...") {
        return products; 
    }
    return products.filter(product => product.brand === selectedBrand); 
}

// Function to filter products based on selected rating
function filterProductsByRating(products) {
    return products.filter(product => Math.round(product.rating) >= selectedRatingFilter); 
}

// Function to filter products based on selected availability
function filterProductsByAvailability(products) {
    if (selectedAvailabilityFilter === 'all') {
        return products; 
    }
    return products.filter(product => product.stock === selectedAvailabilityFilter); 
}

// Function to apply all filters and sorting
async function applyFilters() {
    let products = filterProductsByCategories(); 
    const priceRange = document.getElementById('priceRange').value;
    products = filterProductsByPrice(products, priceRange); 
    const brandSelect = document.querySelector('.form-select');
    const selectedBrand = brandSelect.value;
    products = filterProductsByBrand(products, selectedBrand); 
    products = filterProductsByRating(products); 
    products = filterProductsByAvailability(products); 
    products = sortProducts(products, currentSortCriteria); 
    renderProducts(products); 
}

// Add event listener to the brand dropdown
document.querySelector('.form-select').addEventListener('change', function() {
    applyFilters(); 
});

// Add event listeners to rating filter
document.querySelectorAll('input[name="rating"]').forEach(item => {
    item.addEventListener('change', (event) => {
        selectedRatingFilter = parseInt(event.target.value);
        applyFilters(); 
    });
});

// Add event listeners for the availability radio buttons
document.querySelectorAll('input[name="availability"]').forEach(item => {
    item.addEventListener('change', (event) => {
        selectedAvailabilityFilter = event.target.value; 
        applyFilters(); 
    });
});

// Function to sort products
function sortProducts(products, criteria) {
    let sortedProducts;
    switch (criteria) {
        case 'low-to-high':
            sortedProducts = [...products].sort((a, b) => a.price - b.price);
            break;
        case 'high-to-low':
            sortedProducts = [...products].sort((a, b) => b.price - a.price);
            break;
        case 'popularity':
            sortedProducts = [...products].sort((a, b) => b.rating - a.rating); 
            break;
        case 'new-arrivals':
            sortedProducts = [...products].sort((a, b) => new Date(b.meta.createdAt) - new Date(a.meta.createdAt)); // Sort by date
            break;
        default:
            sortedProducts = products; 
    }
    return sortedProducts; 
}

// Add event listeners to dropdown items for categories
document.querySelectorAll('.list-group-item input[data-category]').forEach(item => {
    item.addEventListener('change', (event) => {
        const category = item.getAttribute('data-category'); 

        if (item.checked) {
            // If the checkbox is checked, add the category to the array
            if (!checkedCategories.includes(category)) {
                checkedCategories.push(category);
            }
        } else {
            // If the checkbox is unchecked, remove the category from the array
            checkedCategories = checkedCategories.filter(cat => cat !== category);
        }

        // Apply filters after category change
        applyFilters();
    });
});

// Event listener for the price range input
const priceRangeInput = document.getElementById("priceRange");
const priceValueDisplay = document.getElementById("priceValue");

priceRangeInput.addEventListener("input", function () {
    const selectedPrice = parseInt(this.value); 
    priceValueDisplay.textContent = selectedPrice; 
    applyFilters();
});

// Add event listeners to dropdown items for sorting
document.querySelectorAll('.dropdown-item[data-sort]').forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        currentSortCriteria = event.target.getAttribute('data-sort'); 
        applyFilters(); 
    });
});




// Initialize cart from localStorage (if available)
let cart = JSON.parse(localStorage.getItem('cart')) || []; // Use an empty array if no cart data is in localStorage

// Function to add product to cart and show modal
function addToCart(productId) {
    // Convert productId to string and compare it to the string ID in allProducts
    const product = allProducts.find(item => String(item.id) === String(productId));

    if (product) {
        // Check if the product already exists in the cart, if yes, increase quantity
        const existingProductIndex = cart.findIndex(item => String(item.id) === String(product.id));
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            // If the product is not in the cart, add it with quantity 1
            product.quantity = 1;
            cart.push(product);
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Update cart item count in the navbar
        updateCartCount();

        alert("Product added to cart");

        // Display the cart modal with the added product
        showCartModal();
    } else {
        console.error("Product not found with id:", productId);
    }
}

// Function to update the cart item count in the navbar
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((total, product) => total + product.quantity, 0); // Total items in cart
    cartCount.innerText = totalItems;
}

// Function to display cart contents inside the modal
function showCartModal() {
    const cartDetails = document.getElementById('cartDetails');
    cartDetails.innerHTML = ''; // Clear previous cart contents
    let totalPrice = 0; // Initialize total price

    if (cart.length > 0) {
        cart.forEach(product => {
            const productTotal = product.price * product.quantity; // Calculate product total price
            totalPrice += productTotal; // Add to total price

            const cartItemHTML = `
                <tr class="cart-item">
                    <td><img src="${product.images[0]}" class="cart-item-img" alt="${product.title}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td><span class="cart-item-title">${product.title}</span></td>
                    <td><span class="cart-item-price">$${product.price.toFixed(2)}</span></td>
                    <td>
                        <input 
                            type="number" 
                            value="${product.quantity}" 
                            min="1" 
                            class="cart-item-quantity" 
                            style="width: 60px; padding: 5px;"
                            oninput="updateQuantity(${product.id}, this.value)">
                    </td>
                    <td><span class="cart-item-total">$${productTotal.toFixed(2)}</span></td>
                    <td><a href="#" class="delete" onClick="removeFromCart(${product.id})"><i class="fas fa-trash text-danger"></i></a></td>
                </tr>
            `;
            cartDetails.innerHTML += cartItemHTML;
        });

        // Show the total price in the modal
        const totalHTML = `
            <tr class="total-row">
                <td colspan="4" class="text-end"><strong>Total:</strong></td>
                <td colspan="2"><strong>$${totalPrice.toFixed(2)}</strong></td>
            </tr>
        `;
        cartDetails.innerHTML += totalHTML;
    } else {
        cartDetails.innerHTML = '<p>Your cart is empty.</p>';
    }

    // Bootstrap modal initialization
    const cartModal = new bootstrap.Modal(document.getElementById('addToCartModal'));
    // Open the modal only if it's not already visible
    if (!cartModal._isShown) {
        cartModal.show();
    }
}

// Function to remove a product from the cart
function removeFromCart(productId) {
    // Remove the product from the cart array
    cart = cart.filter(item => String(item.id) !== String(productId));

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart item count in navbar
    updateCartCount();

    // Refresh the modal to reflect changes
    showCartModal();
}

// Function to update the quantity of a product in the cart
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return; // Prevent setting quantity to less than 1

    const product = cart.find(item => String(item.id) === String(productId));
    if (product) {
        product.quantity = newQuantity; // Update the quantity
        // Save updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        // Refresh the modal to reflect changes
        showCartModal();
    }
}

// Function to clear the cart
function clearCart() {
    // Clear the cart array and remove from localStorage
    cart = [];
    localStorage.removeItem('cart');
    updateCartCount(); // Update the cart count in navbar

    // Refresh the modal to show empty cart
    showCartModal();
}

// Event listener for the cart icon click
document.getElementById('cartIcon').addEventListener('click', function() {
    // Show the cart modal when the cart icon is clicked
    showCartModal();
});

// Initialize cart on page load
updateCartCount(); // Update the cart item count when the page loads
    

// Initial fetch of products
fetchProducts();

document.addEventListener("DOMContentLoaded", function() {
        var myModal = new bootstrap.Modal(document.getElementById('newsletterModal'));
        myModal.show();
    });



