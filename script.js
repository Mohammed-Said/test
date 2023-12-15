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
const prodContainer=document.querySelector('.products');
const categories=document.querySelector('.categories');
document.getElementById('all').checked=true;

let shirt=[],sweatshirt=[],trousers=[],tShirt=[];
let products=[];
async function fetchAllDate() {
  
  await fetch("shirts.json")
    .then((res) => res.json())
    .then((json) => shirt=json );

  await fetch("t-shirts.json")
    .then((res) => res.json())
    .then((json) => tShirt=json);

  await fetch("sweatshirt.json")
    .then((res) => res.json())
    .then((json) => sweatshirt=json );

  await fetch("trousers.json")
    .then((res) => res.json())
    .then((json) => trousers=json );

  products=[...shirt,...sweatshirt,...tShirt,...trousers];
  addProductHTML(shuffle(products));
}
function shuffle(array) {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}
const addProductHTML=(prod)=>{
  prodContainer.innerHTML="";
  prod.forEach(elem => {
    prodContainer.insertAdjacentHTML('beforeend',`
    <div class="item" id=${elem.id}>
    <div class="image">
      <img src=${elem.image} alt="">
        <i class="fa-regular fa-heart heart"></i>
        <div class="box">
          <div class="btns">
            <a href="#"><span>Quick View</span></a>
            <a href="#" class="add-to-cart"><span> select options </span></a>
            </div>
        </div>
    </div>
    <div class="content">
      <div>${elem.name}</div>
      <div>${elem.price}.00 LE</div>
    </div>
  </div>
    `)
  });
}
const init=()=>{
  document.getElementById('all').checked=true;
  fetchAllDate();
}
init();
/////////////////////////////////////
categories.addEventListener('change',e=>{
  let allRadio=e.target.closest('form').querySelectorAll('input');
  allRadio.forEach(elem=>{
    elem.checked=false;
  });
  if(e.target.value==="shirts"){
    addProductHTML(shuffle(shirt))  }
  else if(e.target.value==="t-shirts"){
    addProductHTML(shuffle(tShirt))
  }
  else if(e.target.value==="sweatshirt"){
    addProductHTML(shuffle(sweatshirt))
  }
  else if(e.target.value==="trousers"){
    addProductHTML(shuffle(trousers))
  }
  else if(e.target.value ==='all'){
    addProductHTML(shuffle(products));
  }
  e.target.checked=true;
})

