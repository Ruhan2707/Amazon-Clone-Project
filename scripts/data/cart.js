export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(id) {
  const inputElem = document.querySelector(`.js-input-quantity-${id}`);
  const updateElem = document.querySelector(`.js-update-input-${id}`);
  let quantity;
  if(updateElem) {
    quantity = Number(updateElem.value);
    let isMatching;
    cart.forEach((cartItem) => {
      if(cartItem.id === id) {
        cartItem.quantity = quantity;
      }
    });
  }
  else {
    if(inputElem) quantity = Number(inputElem.value);
    else quantity = 1;

    let isMatching;
    cart.forEach((value) => {
      if(value.id === id) {
        isMatching = value;
      }
    });

    if(isMatching) {
      isMatching.quantity += quantity;
    }
    else {
      cart.push({
        id,
        quantity,
        deliveryId: '1'
      });
    }
  }
  

  updateCartQuantity();
  saveToStorage();
}

export function updateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((value) => {
    cartQuantity += value.quantity;
  });
  localStorage.setItem('cartQuantity', JSON.stringify(cartQuantity));

  let cartQuantityElement = document.querySelector('.js-cart-quantity')
  if(cartQuantityElement)  cartQuantityElement.innerHTML = cartQuantity;
  
  let itemCountElement = document.querySelector('.js-item-count')
  if(itemCountElement)  itemCountElement.innerHTML = cartQuantity;

  let cartItemGridElement = document.querySelector('.js-cart-item-grid');
  if(cartItemGridElement && cartQuantity === 0) {
    cartItemGridElement.innerHTML = `
    <div class="view-products-container">
      <p class="cart-empty-text">Your cart is empty.</p>
      <a class="view-product-button-link" href="amazon.html">
        <div class="view-product-button">View Products</div>
      </a>
    </div>
    `;
  }
}

export function deleteFromCart(id) {
  let newCart = [];
  cart.forEach((cartItem) => {
    if(cartItem.id === id) return ;
    newCart.push(cartItem);
  });

  cart = newCart;
  saveToStorage();
  updateCartQuantity();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if(cartItem.id === productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryId = deliveryOptionId;

  saveToStorage();
}