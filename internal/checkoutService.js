const axios = require('axios');
const shopifyConstants = require('./shopifyConstants.js');

const addToCart = (id) => {
    var url = shopifyConstants.featureUrl + 'cart/add.js?id=' + id + '&quantity=1';
    axios.post(url)
    .then(response => {
      console.log(response);
      startCheckout();
    })
    .catch(error => {
      console.log(error);
    });
  }
  
  function startCheckout() {
    var url = shopifyConstants.featureUrl + 'checkout';
    axios.get(url)
    .then(response => {
      // TODO finish checkout flow
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
  }

  exports.addProductToCart = addToCart;