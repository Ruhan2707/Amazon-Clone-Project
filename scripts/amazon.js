import {cart, addToCart, updateCartQuantity} from './data/cart.js';
import {products} from './data/products.js';
import { formatCurrency } from './utils/money.js';
import { generateSearchResultHTML } from './search-result.js';

function renderShoppingGrid() {
  let productsHTML = '';
  products.forEach(product => {
    productsHTML += `
    <div class="product-card">
      <div class="product-img-container">
        <img src="${product.image}" class="product-img">
      </div>
      <div class="product-detail">
        <p class="detail-text">${product.name}</p>
      </div>
      <div class="rating-container">
        <img src="images/ratings/rating-${product.rating.stars * 10}.png" class="product-rating">
        <span class="review-count">${product.rating.count}</span>
      </div>
      <div class="price-container">
        <span class="price">$${formatCurrency(product.priceCents)}</span>
      </div>
      
      <div class="quantity-container">
        <select class="input-quantity js-input-quantity-${product.id}">
          <option button="1">1</option>
          <option button="2">2</option>
          <option button="3">3</option>
          <option button="4">4</option>
          <option button="5">5</option>
          <option button="6">6</option>
          <option button="7">7</option>
          <option button="8">8</option>
          <option button="9">9</option>
          <option button="10">10</option>
        </select>
      </div>
      <div class="added-container js-added-container-${product.id}">
        
      </div>
      <div class="add-to-cart-container">
        <button class="add-to-cart-button js-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
      </div>
    </div>
    `
  });

  if(JSON.parse(localStorage.getItem('inputString'))) {
    document.querySelector('.js-shopping-grid').innerHTML = generateSearchResultHTML();
  }
  else {
    document.querySelector('.js-shopping-grid').innerHTML = productsHTML;
  }

  function runSelectors() {
    document.querySelector('.js-cart-quantity').innerHTML = JSON.parse(localStorage.getItem('cartQuantity')) || 0;

    document.querySelectorAll('.js-add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
        const id = button.dataset.productId;
        addToCart(id);
        updateCartQuantity();
        document.querySelector(`.js-added-container-${id}`).innerHTML = `
          <img src="images/icons/checkmark.png" class="added-img">
          <span class="added-text">Added</span>
        `;
        setTimeout(() => {
          document.querySelector(`.js-added-container-${id}`).innerHTML = ``;
        }, 2500);
      });
    });
  }

  runSelectors();

  document.querySelector('.js-header-search-button').addEventListener('click', () => {
    document.querySelector('.js-shopping-grid').innerHTML = generateSearchResultHTML();
    runSelectors();
  });

  document.querySelector('.js-search-input').addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
      document.querySelector('.js-shopping-grid').innerHTML = generateSearchResultHTML();
      runSelectors();
    }
  });
}

renderShoppingGrid();