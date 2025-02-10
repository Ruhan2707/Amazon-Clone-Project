import {cart, addToCart} from './data/cart.js';
import {getProduct} from './data/products.js';
import {formatCurrency} from './utils/money.js';
import dayjs from ' https://unpkg.com/dayjs@1.11.10/esm/index.js'; 
import { getDeliveryOption } from './data/deliveryOptions.js';

let currentOrders = JSON.parse(localStorage.getItem('currentOrders')) || [];
let itemCount = JSON.parse(localStorage.getItem('cartQuantity')) || 0;
let countElement = document.querySelector('.js-cart-quantity');
if(countElement) countElement.innerHTML = itemCount;

export function placeOrder(totalCents) {
  let productDetails = [];
  cart.forEach((cartItem) => {
    const item = cartItem;
    productDetails.push(item);
  });

  let currentOrder = {
    totalCents,
    productDetails
  };

  currentOrders.push(currentOrder);
  localStorage.setItem('currentOrders', JSON.stringify(currentOrders));
  localStorage.removeItem('cart');
  localStorage.removeItem('cartQuantity');
}

function getOrderIdCharacter() {
  const hexaCharacters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
  let index = Math.round((Math.random() * 100)) % 16;
  return hexaCharacters[index];
}

function getOrderId() {
  let orderIdTemplate = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
  let orderId = '';
  let length = orderIdTemplate.length;
  for(let i = 0; i < length; i++) {
    if(orderIdTemplate[i] === 'x') {
      orderId += String(getOrderIdCharacter());
    }
    else {
      orderId += '-';
    }
  }
  return orderId;
}

function addOrder(currentOrder) {
  const todayDate = dayjs();
  let orderSummaryHTML = `
  <div class="orders-grid">
    <div class="order-heading">
      <div class="order-delivery-date">
        <span class="order-placed-text">Order Placed: </span>
        <span>${todayDate.format('MMMM D')}</span>
      </div>

      <div class="order-total">
        <span class="order-total-text">Total: </span>
        <span>$${formatCurrency(currentOrder.totalCents)}</span>
      </div>

      <div class="order-id">
        <span class="order-id-text">Order ID: </span>
        <span class="order-id-no">${getOrderId()}</span>
      </div>
    </div>
    `;

    currentOrder.productDetails.forEach((cartItem) => {
    const product = getProduct(cartItem.id);
    const deliveryOption = getDeliveryOption(cartItem.deliveryId);
    const deliveryDate = todayDate.add(deliveryOption.deliveryDays, 'days');
    const deliveryString = deliveryDate.format('MMMM D');

    orderSummaryHTML += `
    <div class="order-details">
      <div class="item-img-container">
        <img src="${product.image}" class="item-img">
      </div>

      <div class="item-order-details">
        <span class="item-name">${product.name}</span>
        <span>
          Arriving On: <span>${deliveryString}</span>
        </span>
        <span>
          Quantity: <span>${cartItem.quantity}</span>
        </span>

        <button class="buy-it-again-button display-buy-it-again-button js-buy-it-again-button" 
          data-product-id="${product.id}">
          <img src="images/icons/buy-again.png" class="buy-again-img">
          <span class="buy-it-again-text">Buy it again</span>
        </button>
      </div>

      <div class="buy-it-again-button-container">
        
        <button class="buy-it-again-button js-buy-it-again-button"
          data-product-id="${product.id}">
          <img src="images/icons/buy-again.png" class="buy-again-img">
          <span class="buy-it-again-text">Buy it again</span>
        </button>
      </div>
    </div>`;
  });

  orderSummaryHTML += `
  </div>
  `;

  return orderSummaryHTML;
}

function renderOrderSection() {
  let gridSummaryHTML = '';

  if(currentOrders.length !== 0) {
    currentOrders.forEach((currentOrder) => {
      gridSummaryHTML += addOrder(currentOrder);
    });
  }
  else {
    gridSummaryHTML = `
      <div class="no-order-placed-text">No Orders Placed</div>
      <a class="buy-items-button" href="amazon.html">
        <span class="buy-items-text">Buy Items<span>
      </a>
    `;
  }

  const gridElem =  document.querySelector('.js-orders-grid-container');
  if(gridElem) gridElem.innerHTML += gridSummaryHTML;
}

renderOrderSection();
document.querySelectorAll('.js-buy-it-again-button').forEach((button) => {

  button.addEventListener('click', () => {
    button.innerHTML = `
      <img src="images/icons/tick-mark.svg" class="tick-mark-img">
      <span class="buy-it-again-text">Added</span>
    `;

    addToCart(button.dataset.productId);
    
    setTimeout(() => {
      button.innerHTML = `
        <img src="images/icons/buy-again.png" class="buy-again-img">
        <span class="buy-it-again-text">Buy it again</span>
      `;
    }, 2500);
  });
});

const searchButtonElem = document.querySelector('.js-header-search-button');
const searchInputElem = document.querySelector('.js-search-input');

if(searchButtonElem) {
  searchButtonElem.addEventListener('click', () => {
    const inputString = document.querySelector('.js-search-input').value;
    if(inputString !== '') localStorage.setItem('inputString', JSON.stringify(inputString));
    location.replace('./amazon.html');
  });
}

if(searchInputElem) {
  searchInputElem.addEventListener('keydown', (event) => {
    if(event.key === 'Enter') {
      const inputString = document.querySelector('.js-search-input').value;
      if(inputString !== '') localStorage.setItem('inputString', JSON.stringify(inputString));
      location.replace('./amazon.html');
    }
  });
}

