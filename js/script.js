// fetch('https://dummyjson.com/products')
// .then(res => res.json())
// .then(json => {
//   console.log(json);
//   json.products.forEach(element => {
//     element.images.forEach(item=>{
//       let img=document.createElement('img');
//       img.src=item;
//       document.body.appendChild(img)

//     })
//   });
//   // json.products.forEach(element => {
//   //   let img=document.createElement('img');
//   //   img.src=element.thumbnail;
//   //   document.body.appendChild(img)

//   // })
// })
const prodContainer = document.querySelector(".products");
const categories = document.querySelector(".categories");
const overlay = document.querySelector(".overlay");
const iconCart = document.querySelector(".icon-cart");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close");
const listCartHTML = document.querySelector(".list-cart");
const iconCartSpan = document.querySelector(".icon-cart span");

let shirt = [],
  sweatshirt = [],
  trousers = [],
  tShirt = [];
let products = [],
  cart = [],
  wishlist = [];
async function fetchAllDate() {
  await fetch("../shirts.json")
    .then((res) => res.json())
    .then((json) => (shirt = json));

  await fetch("../t-shirts.json")
    .then((res) => res.json())
    .then((json) => (tShirt = json));

  await fetch("../sweatshirt.json")
    .then((res) => res.json())
    .then((json) => (sweatshirt = json));

  await fetch("../trousers.json")
    .then((res) => res.json())
    .then((json) => (trousers = json));

  products = [...shirt, ...sweatshirt, ...tShirt, ...trousers];
}
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}
const addProductHTML = (prod) => {
  prodContainer.innerHTML = "";
  prod.forEach((elem) => {
    let icon="regular";
    if (wishlist.length>0)
      icon =wishlist.findIndex((val) => val === elem.id) > -1 ? "solid" : "regular";
    prodContainer.insertAdjacentHTML(
      "beforeend",
      `
    <div class="item" id=${elem.id}>
    <div class="image">
      <img src=${elem.image} alt="">
        <i class="fa-${icon} fa-heart wishlist"></i>
        <div class="box">
          <div class="btns">
            <a href="#"><span>Quick View</span></a>
            <a href="#" class="add-to-cart"><span> Add to Cart </span></a>
            </div>
        </div>
    </div>
    <div class="content">
      <div>${elem.name}</div>
      <div>${elem.price}.00 LE</div>
    </div>
  </div>
    `
    );
  });
};
const addCartToHTML = () => {
  listCartHTML.innerHTML = "";
  let totalQuantity = 0;
  if (cart.length > 0) {
    cart.forEach((item) => {
      totalQuantity += item.quantity;
      let positionProduct = products.findIndex(
        (value) => value.id == item.productId
      );
      let info = products[positionProduct];
      listCartHTML.insertAdjacentHTML(
        "beforeend",
        `
      <div class="item" data-id=${info.id}>
          <div class="image">
                <img src="${info.image}">
          </div>
          <div class="name">
              ${info.name}
          </div>
          <div class="totalPrice">${info.price * item.quantity}LE</div>
          <div class="quantity">
            <span class="minus"><</span>
            <span>${item.quantity}</span>
            <span class="plus">></span>
          </div>
      </div>
      `
      );
    });
  }
  iconCartSpan.innerText = totalQuantity;
};
const addToCart = (id) => {
  let indexProdInCart = cart.findIndex((val) => val.productId === id);
  if (cart.length === 0) {
    cart = [
      {
        productId: id,
        quantity: 1,
      },
    ];
  } else if (indexProdInCart < 0) {
    cart.push({
      productId: id,
      quantity: 1,
    });
  } else cart[indexProdInCart].quantity++;
  addCartToHTML();
  addCartToMemory();
};
const addCartToMemory = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};
const changeQuantityCart = (id, type) => {
  let positionItemInCart = cart.findIndex((value) => value.productId == id);
  if (positionItemInCart > -1) {
    if (type === "plus") cart[positionItemInCart].quantity++;
    else if (type === "minus") {
      let changeQuantity = cart[positionItemInCart].quantity - 1;
      if (changeQuantity > 0) {
        cart[positionItemInCart].quantity = changeQuantity;
      } else {
        cart.splice(positionItemInCart, 1);
      }
    }
    addCartToHTML();
    addCartToMemory();
  }
};
const updateWishlist = (id) => {
  if (!wishlist) {
    wishlist=[id]
  }
  else
  {
    let indexProd = wishlist.findIndex((val) => val === id);
    if (indexProd === -1) wishlist.push(id);
    else wishlist.splice(indexProd, 1);
  }
  addWishlistToMemory();
};
const addWishlistToMemory = () => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};
overlay.addEventListener("click", () => {
  overlay.classList.remove("show");
  cartTab.classList.remove("showCart");
});
iconCart.addEventListener("click", (e) => {
  cartTab.classList.toggle("showCart");
  overlay.classList.add("show");
});
closeBtn.addEventListener("click", (e) => {
  cartTab.classList.remove("showCart");
  overlay.classList.remove("show");
});
listCartHTML.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("minus") ||
    e.target.classList.contains("plus")
  ) {
    let id = e.target.closest(".item").dataset.id;
    let type = e.target.classList.contains("plus") ? "plus" : "minus";
    changeQuantityCart(id, type);
  }
});
prodContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    addToCart(e.target.closest(".item").id);
  } else if (e.target.classList.contains("wishlist")) {
    if (e.target.classList.contains("fa-regular")) {
      e.target.classList.remove("fa-regular");
      e.target.classList.add("fa-solid");
    } else {
      e.target.classList.add("fa-regular");
      e.target.classList.remove("fa-solid");
    }
    updateWishlist(e.target.closest(".item").id);
  }
});

const init = async () => {
  await fetchAllDate();

  wishlist = JSON.parse(localStorage.getItem("wishlist"));
  addProductHTML(shuffle(products));
  if (localStorage.getItem("cart")) {
    cart = JSON.parse(localStorage.getItem("cart"));
    addCartToHTML();
  }
};
init();
/////////////////////////////////////
// categories.addEventListener('change',e=>{
//   let allRadio=e.target.closest('form').querySelectorAll('input');
//   allRadio.forEach(elem=>{
//     elem.checked=false;
//   });
//   if(e.target.value==="shirts"){
//     addProductHTML(shuffle(shirt))  }
//   else if(e.target.value==="t-shirts"){
//     addProductHTML(shuffle(tShirt))
//   }
//   else if(e.target.value==="sweatshirt"){
//     addProductHTML(shuffle(sweatshirt))
//   }
//   else if(e.target.value==="trousers"){
//     addProductHTML(shuffle(trousers))
//   }
//   else if(e.target.value ==='all'){
//     addProductHTML(shuffle(products));
//   }
//   e.target.checked=true;
// })

document.querySelector(".num-asc").addEventListener("click", (e) => {
  products.sort((a, b) => a.price - b.price);
  addProductHTML(products);
});
document.querySelector(".num-desc").addEventListener("click", (e) => {
  products.sort((a, b) => b.price - a.price);
  addProductHTML(products);
});
document.querySelector(".alpha-asc").addEventListener("click", (e) => {
  addProductHTML(products.sort((a, b) => a.name.localeCompare(b.name)));
});
document
  .querySelector(".alpha-desc")
  .addEventListener("click", (e) =>
    addProductHTML(products.sort((a, b) => b.name.localeCompare(a.name)))
  );
//////////////////////////////////////////
