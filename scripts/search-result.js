import { products } from "./data/products.js";
import { formatCurrency } from "./utils/money.js";

function isValid(word, ind) {
  let found = 0;
  products.forEach((product) => {
    product.searchKeywords[ind].forEach((name) => {
      if(name === word) found = 1;
    });
  });

  return found;
}

function noResultFoundHTML(inputString) {
  return `
    <div class="no-result-div">No result found for "<span class="no-result-found-text">${inputString}</span>".</div>
  `; 
}

export function generateSearchResultHTML() {
  const inputElem = JSON.parse(localStorage.getItem('inputString'));
  let inputString = document.querySelector('.js-search-input').value;
  if(inputElem) {
    inputString = inputElem;
    localStorage.removeItem('inputString');
  }
  inputString.toLowerCase();
  const words = inputString.split(' ');
  let name, color, gender;
  words.forEach((word) => {
    if(isValid(word, 0)) {
      name = word;
    }

    if(isValid(word, 1)) {
      color = word;
    }

    if(isValid(word, 2)) {
      gender = word;
    }
  });

  let keywords = [];

  if(name) {
    keywords.push([name, 0]);
  }

  if(color) {
    keywords.push([color, 1]);
  }

  if(gender) {
    keywords.push([gender, 2]);
  }

  if((!name && (color || gender)) || (inputString != '' && keywords.length === 0)) {
    return noResultFoundHTML(inputString);
  }

  let searchResultHTML = '';

  products.forEach((product) => {
    let count = 0;
    keywords.forEach((keyword) => {
      product.searchKeywords[keyword[1]].forEach((name) => {
        if(keyword[0] === name) {
          count++;
        }
      });
    });

    if(count === keywords.length) {
      searchResultHTML += `
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
      `;
    }
  });

  if(searchResultHTML === '') {
    return noResultFoundHTML(inputString);
  }

  return searchResultHTML;
}