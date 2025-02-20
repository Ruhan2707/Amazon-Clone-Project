import {deleteFromCart, updateDeliveryOption, addToCart} from './data/cart.js';
import {products, getProduct} from './data/products.js';
import { formatCurrency } from './utils/money.js';
import { deliveryOptions, getDeliveryOption } from './data/deliveryOptions.js';
import dayjs from ' https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { renderPaymentSummary } from './orderPaymentSummary.js';

let cart;
getCart();
function getCart() {
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}

function renderItemCount() {
  const itemCount = JSON.parse(localStorage.getItem('cartQuantity')) || 0;
  document.querySelector('.js-item-count').innerHTML = itemCount;

  if(itemCount === 0) {
    document.querySelector('.js-cart-item-grid').innerHTML = `
      <div class="view-products-container">
        <p class="cart-empty-text">Your cart is empty.</p>
        <a class="view-product-button-link" href="index.html">
          <div class="view-product-button">View Products</div>
        </a>
      </div>
        `;
  }
}

function renderCartItems() {
  getCart();
  let cartSummaryHTML = '';
  cart.forEach((cartItem) => {
    const matchingItem = getProduct(cartItem.id);
    const deliveryOption = getDeliveryOption(cartItem.deliveryId);
    const todayDate = dayjs();
    const deliveryDate = todayDate.add(deliveryOption.deliveryDays, 'days');
    const deliveryString = deliveryDate.format('dddd, MMMM D');

    cartSummaryHTML += `
    <div class="cart-item-card js-cart-item-card-${matchingItem.id}">
      <div class="delivery-date-container">
        <p class="delivery-date-text">Delivery date: ${deliveryString}</p>
      </div>

      <div class="delivery-item-info-container">
        <div class="item-img-container">
          <img src="${matchingItem.image}" class="item-img">
        </div>

        <div class="item-info-container">
          <div class="item-name">${matchingItem.name}</div>
          <div class="item-price">$${formatCurrency(matchingItem.priceCents)}</div>
          <div class="quantity-container">
            <div class="item-quantity">Quantity: ${cartItem.quantity}</div>
            <button class="update-button js-update-button" data-product-id="${matchingItem.id}">Update</button>
            <div class="update-quantity js-update-quantity-${matchingItem.id}">
              <input type="number" min="1" max="50" value="1" step="1" class="js-update-input-${matchingItem.id}">
              <button class="save-button js-save-button-${matchingItem.id}">Save</button>
            </div>
            <button class="delete-button js-delete-button" data-product-id="${matchingItem.id}">Delete</button>
          </div>
        </div>

        <div class="item-delivery-options-container">
          <div class="delivery-option-heading">Choose a delivery option:</div>
          <div class="delivery-options-container">
            ${deliveryOptionsHTML(matchingItem, cartItem)}
          </div>
        </div>
      </div>
    </div>
    `;
  });

  document.querySelector('.js-cart-item-grid').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-button').forEach((button) => {
    button.addEventListener('click', () => {
      (document.querySelector(`.js-cart-item-card-${button.dataset.productId}`)).remove();
      deleteFromCart(button.dataset.productId);
      renderPaymentSummary();
    });
  });
  
  document.querySelectorAll('.js-delivery-option').forEach((option) => {
    option.addEventListener('click', () => {
      const {productId, deliveryOptionId} = option.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      console.log(cart);
      renderCartItems();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-update-button').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      button.style.display = "none";
      document.querySelector(`.js-update-quantity-${productId}`).style.display = "block";
      document.querySelector(`.js-save-button-${productId}`).addEventListener('click', () => {
        addToCart(productId);
        renderCartItems();
        renderPaymentSummary();
        document.querySelector(`.js-update-quantity-${productId}`).style.display = "none";
        button.style.display = "block";
      });
    });
  });
}

function deliveryOptionsHTML(matchingItem, cartItem) {
  
  let deliveryOptionHTML = '';

  deliveryOptions.forEach((deliveryOption) => {
    const todayDate = dayjs();
    const deliveryDate = todayDate.add(deliveryOption.deliveryDays, 'days');
    const deliveryString = deliveryDate.format('dddd, MMMM D');
    const price = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)}`;
    const isChecked = (deliveryOption.id === cartItem.deliveryId) ? 'checked' : '';
    deliveryOptionHTML += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingItem.id}"
        data-delivery-option-id="${deliveryOption.id}"">
          <input type="radio" ${isChecked} class="choose-delivery" name="choose-delivery-${matchingItem.id}">
          <div class="date-shipping-container">
            <p class="shipping-date">
              ${deliveryString}
            </p>
            <p class="shipping-cost">
              ${price} - Shipping
            </p>
          </div>
      </div>
    `
  });

  return deliveryOptionHTML;
}

renderCartItems();
renderItemCount();
renderPaymentSummary();
