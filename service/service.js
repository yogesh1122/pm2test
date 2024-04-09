const axios = require('axios');
const ProductModel = require('../model/productModel');


async function fetchFakeAPI() {
    const data = await axios.get(`https://randomuser.me/api/`)
    return data;
}

async function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

async function userCreateObj() {
      const res = await fetchFakeAPI()
      // console.log( res.data.results) ;
      const { gender,name,email,location:{ city,postcode,state,street:{name:streetname }},login:{password},} = res.data.results[0]
      
      //let name =`${title} ${first} ${last}`
      let obj =  {
        "gender":gender,
        "name": name,
        "email":email,
        "password":password,
        "address": {
        "street": streetname,
        "city": city,
        "state": state,
        "postcode": postcode
      },
    }
     return obj;
}

async function verifyCartData(items){
//Optimize code  
let totalPrice = items.map((item) => item.quantity * item.price).reduce((acc, val) => acc + val, 0);
return totalPrice;
//long logic
  // let totalPrice=0;
  // for (const key in items) {
  //   if (Object.hasOwnProperty.call(items, key)) {
  //     const el = items[key];
  //     let objprice = el.quantity * el.price;    
  //     totalPrice += objprice
  //   }
  // }
}


//Product Servicess **

async function checkallproductPrice(pid) {
  let data = []
  await Promise.all(pid.map(async (it) => {
    let d = await ProductModel.findOne({ _id: it })
    data.push(d);
  }));
  return data;
}

function totalPrice(rs, userCart) {
  //#region 
   //     let totalPrice=0;
   //     //  console.log("PID data from cart",userCart.items);
   //     //  console.log("Rs data from DB",rs);
   //     console.log("userCArt :-",userCart);
   //     console.log("rs :- ", rs);
   //     for (let i = 0; i < userCart.items.length; i++) {
   //       const { product_id, qty } = userCart.items[i];
   //       const product = rs.find(p => p._id === product_id); 
   //       console.log('product',product);
   //       if (product) {
   //         totalPrice += (product.price * qty);
   //       }
   //       console.log(totalPrice);
   //      return totalPrice; 
   // } 
   //#endregion 
   // userCart and rs array as defined in the question
   const userCartItems = userCart.items;

   // create a new array by iterating over userCart items
   const calculatedPrices = userCartItems.map((item) => {
     const productId = item.product_id;

     // find the corresponding product in the rs array
     const product = rs.find((p) => p._id.toString() === productId.toString());

     // if a matching product is found, calculate the price and return it
     if (product) {
       const quantity = item.quantity;
       const price = product.price;
       const totalPrice = quantity * price;

       return { _id: product._id, totalPrice };
     }

     // if no matching product is found, return null
     return null;
   });

   // use reduce function to sum the total price for all items
   const totalPrice = calculatedPrices.reduce(
     (accumulator, item) => (item ? accumulator + item.totalPrice : accumulator),
     0
   );
     
   return totalPrice.toFixed(2);

 }


module.exports = { 
    fetchFakeAPI,
    getRandomNumber,
    verifyCartData,
    checkallproductPrice,
    totalPrice
 }