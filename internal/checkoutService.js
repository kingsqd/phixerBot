const shopifyConstants = require('./shopifyConstants.js');
const BlueBird = require('bluebird');
const EventEmitter = require('events');

let checkoutService = class CheckoutBot extends EventEmitter {
  constructor() {
    super();
    this.Name = "";
    this.Profile = "";
    this.Http = BlueBird.promisify(require('req-fast'));
    this.Agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36";
    this.Cookies = {};
    this.Proxy = undefined;// Profile.Proxy[0];
    this.PaymentTokenUrl = "https://elb.deposit.shopifycs.com/sessions";

    this.UserInfo = {
      "utf8": "\u2713",
      "_method": "patch",
      "authenticity_token": "",
      "previous_step": "contact_information",
      "step": "shipping_method",
      // "checkout[email]": Profile.Email,
      "checkout[buyer_accepts_marketing]": "0",
      // "checkout[shipping_address][first_name]": Profile.FirstName,
      // "checkout[shipping_address][last_name]": Profile.LastName,
      // "checkout[shipping_address][company]": "",
      // "checkout[shipping_address][address1]": Profile.Address1,
      // "checkout[shipping_address][address2]": Profile.Address2,
      // "checkout[shipping_address][city]": Profile.City,
      // "checkout[shipping_address][country]": Profile.Country,
      // "checkout[shipping_address][province]": Profile.Province,
      // "checkout[shipping_address][zip]": Profile.PostalCode,
      // "checkout[shipping_address][phone]": Profile.Phone,
      "checkout[remember_me]": "0",
      "checkout[client_details][browser_width]": "1710",
      "checkout[client_details][browser_height]": "1289",
      "checkout[client_details][javascript_enabled]": "1",
      "button": ""
    }
  }

  async AddToCart(variantId) {
    let addToCartUrl = shopifyConstants.featureUrl + 'cart/' + variantId + ':1';

    try {
      let cartRequestResult = await this.Http({
        uri: addToCartUrl,
        trackCookie: true,
        method: "GET",
        cookies: this.Cookies,
        proxy: this.Proxy,
        agent: this.Agent,
        headers: {
          accept: "application/json, text/html, text/*, application/*"
        }
      });
      console.log('CART REQUEST LOGS ==============================================================================================\n');
      console.log(cartRequestResult.body);
      await this.ProcessCookies(cartRequestResult.cookies);
      console.log('COOKIES FOUND: ' + this.Cookies);
      let PostParams =
          {
              "id": variantId,
              "quantity": 1
          };
      var addToCartRequest = this.BaseUrl + "cart/add.js";
      let addToCartResult = await this.Http({
          uri: addToCartRequest,
          trackCookie: true,
          method: "POST",
          proxy: this.Proxy,
          cookies: this.Cookies,
          agent: this.Agent,
          data: PostParams,
          headers: {
              accept: "application/json, text/html, text/*, application/*"
          }
      });
      console.log('ADDING TO CART LOGS ==============================================================================================\n');
      if (addToCartResult) {
        console.log('ADDING TO CART LOGS ==============================================================================================\n');
        var addedToCart = JSON.parse(addToCartResult.body);
        console.log(addedToCart);
        await this.ProcessCookies(addToCartResult.cookies)
        if (addedToCart && addedToCart.id) {
            return addedToCart.id;
        }
        return addedToCart;
      }
      return null;
      

    } catch (Error) {
      if (Error.statusCode == 430) {
        console.log("Ip was blocked");
    } else {
        console.log(Error);
    }
    return null;

    }
  }

  async ProcessCookies(newCookies) {
    if (!newCookies) return;
    var Keys = Object.keys(newCookies);
    console.log(Keys);
    for (var i = 0; i < Keys.length; i++) {
        this.Cookies[Keys[i]] = newCookies[Keys[i]];
    }
  }

  Debug(Error) {
    this.emit('Debug', `${this.Name}:`, Error);
    console.debug(Error);
  }

  Message(Text) {
    this.emit('Message', `${this.Name}: ${Text}`);
    console.log(Text);
  }
  
}

 module.exports = checkoutService;