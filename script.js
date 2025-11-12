//Banner_slider->
let bannerIndex = 0;
const bannerContainer = document.getElementById("bannerContainer");
const banners = bannerContainer.children;

document.getElementById("nextBtn").onclick =()=> changeSlide(1);
document.getElementById("prevBtn").onclick =()=> changeSlide(-1);

function changeSlide(dir){
  bannerIndex = (bannerIndex +dir+ banners.length) % banners.length;
  bannerContainer.style.transform = `translateX(-${bannerIndex * 100}%)`;
}

// Auto-slide->
let bannerInterval = setInterval(() => changeSlide(1), 4000);

//Pause on hover->
bannerContainer.addEventListener("mouseenter",()=>clearInterval(bannerInterval));
bannerContainer.addEventListener("mouseleave",()=>{
  bannerInterval = setInterval(()=>changeSlide(1),4000);
});

// Swipe support for mobile
let startX= 0;
bannerContainer.addEventListener("touchstart",e=>startX=e.touches[0].clientX);
bannerContainer.addEventListener("touchend",e=>{
  const endX=e.changedTouches[0].clientX;
  if(endX-startX>50)changeSlide(-1);
  else if(startX-endX>50) changeSlide(1);
});




// Fetch Products->
const productContainer = document.getElementById("productContainer");
let cart=[];
let balance=1000;
const balanceDisplay = document.getElementById("balance");

// Update navbar balance
function updateBalance(amount=0){
  balance += amount;
  balanceDisplay.innerText = `Balance: ${balance} BDT`;
}

// Load products
async function loadProducts(){
  const res = await fetch("https://fakestoreapi.com/products");
  const data = await res.json();
  showProducts(data.slice(0,9));
}

function showProducts(products){
  products.forEach(p=>{
    const div = document.createElement("div");
    div.className ="bg-white shadow p-3 rounded text-center";
    div.innerHTML = `
      <img src="${p.image}" class="h-40 mx-auto object-contain mb-2">
      <h3 class="font-semibold">${p.title.slice(0, 25)}...</h3>
      <p class="text-blue-600 font-bold">${p.price} BDT</p>
      <p>⭐ ${p.rating.rate}</p>
      <button class="bg-blue-500 text-white px-3 py-1 mt-2 rounded">Add to Cart</button>
    `;
    div.querySelector("button").onclick = () => addToCart(p);
    productContainer.appendChild(div);
  });
}

// Cart System->
function addToCart(p) {
  if(p.price > balance){
    alert("❌ Not enough balance! Please add more money.");
    return;
  }
  balance -= p.price; // decrease balance immediately
  cart.push(p);
  renderCart();
  updateBalance(0); // refresh navbar
}

function removeFromCart(index){
  const item = cart[index];
  balance += item.price; // refund balance
  cart.splice(index,1);
  renderCart();
  updateBalance(0); // refresh navbar
}

function renderCart(){
  const cartItems = document.getElementById("cartItems");
  cartItems.innerHTML = "";
  cart.forEach((item,i)=>{
    const div = document.createElement("div");
    div.className = "flex justify-between bg-white p-2 rounded shadow";
    div.innerHTML = `
      <span>${item.title.slice(0, 20)}...</span>
      <span>${item.price} BDT</span>
      <button class="text-red-500" onclick="removeFromCart(${i})">Remove</button>
    `;
    cartItems.appendChild(div);
  });
  updateTotals();
}

function updateTotals() {
  let subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  const delivery = 50;
  const discount = Number(document.getElementById("discount").innerText);
  const total = subtotal+delivery-discount;

  document.getElementById("subtotal").innerText = subtotal.toFixed(2);
  document.getElementById("total").innerText = total.toFixed(2);
}

// Coupon->
document.getElementById("applyCoupon").onclick = () => {
  const code = document.getElementById("coupon").value.trim().toUpperCase();
  if (code === "SMART10") {
    const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
    const discount = subtotal * 0.1;
    document.getElementById("discount").innerText = discount.toFixed(2);
    updateTotals();
    alert("✅ SMART10 applied! 10% discount added.");
  } else {
    alert("❌ You Entered Invalid coupon code.");
  }
};

//Balance->
document.getElementById("addMoneyBtn").onclick=()=>{
  updateBalance(1000);
};

// Reviews->
async function loadReviews() {
  const res = await fetch("reviews.json");
  const data = await res.json();

  const reviewContainer = document.getElementById("reviewContainer");
  let index = 0;

  function showReview(i) {
    const r = data[i];
    reviewContainer.innerHTML = `
      <div class="p-4">
        <p class="italic">"${r.comment}"</p>
        <p class="font-bold mt-2">${r.name}</p>
        <p>⭐ ${r.rating} — ${r.date}</p>
      </div>
    `;
  }

  showReview(index);
  setInterval(() => {
    index = (index+1) % data.length;
    showReview(index);
  }, 4000);
}

//Contact Form ->
document.getElementById("contactForm").onsubmit = (e) => {
  e.preventDefault();
  document.getElementById("thankYouMsg").classList.remove("hidden");
  e.target.reset();
};

//Back to the Top->
document.getElementById("backToTop").onclick = () =>
  window.scrollTo({ top: 0, behavior: "smooth" });

//Dark/Light Mode->
const darkModeBtn = document.createElement("button");
darkModeBtn.innerText = "🌙";
darkModeBtn.className = "fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded shadow z-50";
document.body.appendChild(darkModeBtn);

let darkMode=false;
darkModeBtn.onclick=()=>{
  darkMode = !darkMode;
  if(darkMode){
    document.body.classList.add("bg-gray-900","text-white");
    document.body.classList.remove("bg-gray-50","text-gray-800");
    darkModeBtn.innerText = "☀️";
  }else{
    document.body.classList.add("bg-gray-50","text-gray-800");
    document.body.classList.remove("bg-gray-900","text-white");
    darkModeBtn.innerText = "🌙";
  }
};

//Init->
loadProducts();
loadReviews();
updateBalance(0);

//mobile shoppingcart popup->
const mobileCartBtn = document.getElementById("mobileCartBtn");
const mobileCartPopup = document.getElementById("mobileCartPopup");
const closeMobileCart = document.getElementById("closeMobileCart");

mobileCartBtn.onclick = () => {
  mobileCartPopup.classList.remove("hidden");
  renderMobileCart();
};

closeMobileCart.onclick = () => {
  mobileCartPopup.classList.add("hidden");
};

function renderMobileCart() {
  const container = document.getElementById("mobileCartItems");
  container.innerHTML = "";
  cart.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "flex justify-between bg-gray-50 p-2 rounded shadow";
    div.innerHTML = `
      <span>${item.title.slice(0, 18)}...</span>
      <span>${item.price} BDT</span>
    `;
    container.appendChild(div);
  });

  let subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  const delivery = 50;
  const discount = 0;
  const total = subtotal + delivery - discount;

  document.getElementById("mSubtotal").innerText = subtotal.toFixed(2);
  document.getElementById("mDelivery").innerText = delivery;
  document.getElementById("mDiscount").innerText = discount;
  document.getElementById("mTotal").innerText = total.toFixed(2);
}







