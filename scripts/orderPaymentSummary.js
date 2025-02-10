import { getDeliveryOption } from "./data/deliveryOptions.js";
import { getProduct } from "./data/products.js";
import { cart } from "./data/cart.js";
import { formatCurrency } from "./utils/money.js";
import { placeOrder } from "./order.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
    const product = getProduct(cartItem.id);
    const deliveryOption = getDeliveryOption(cartItem.deliveryId);

    productPriceCents += (cartItem.quantity * product.priceCents);
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const TaxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + TaxCents;

  const itemCount = JSON.parse(localStorage.getItem('cartQuantity')) || 0;
  
  const orderSummaryHTML = `
  <div class="price-summary-container">
    <div class="order-summary-text">Order Summary</div>
    <div class="price-details">
      <div class="payment-summary-row">
        <div class="row-name">
          Items(${itemCount})
        </div>
        <div class="row-cost">
          $${formatCurrency(productPriceCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div class="row-name">
          Shipping & handling:
        </div>
        <div class="row-cost">
          $${formatCurrency(shippingPriceCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div class="row-name">
        </div>
        <div class="row-line">
        </div>
      </div>
    
      <div class="payment-summary-row">
        <div class="row-name">
          Total before tax:
        </div>
        <div class="row-cost">
          $${formatCurrency(totalBeforeTaxCents)}
        </div>
      </div>

      <div class="payment-summary-row">
        <div class="row-name">
          Estimated tax (10%):
        </div>
        <div class="row-cost">
          $${formatCurrency(TaxCents)}
        </div>
      </div>
    </div>
  </div>
  <div class="payment-buttons">
    <div class="payment-summary-row">
      <div class="order-total-name">
        Order total: 
      </div>
      <div class="order-total-cost">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <a class="place-your-order-button js-place-your-order-button" href="order.html">Place Your Order</a>
    
  </div>
  `;

  document.querySelector('.js-cart-price-container').innerHTML = orderSummaryHTML;
  if(totalCents !== 0) {
    document.querySelector('.js-place-your-order-button').addEventListener('click', () => {
      placeOrder(totalCents);
    });
  }
}
