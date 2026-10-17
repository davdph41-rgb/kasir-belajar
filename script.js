const products=[
{id:1,name:"Coffee",price:15000},
{id:2,name:"Burger",price:25000},
{id:3,name:"Fries",price:12000}
];

let cart=[];

const productList=document.getElementById("productList");
const cartList=document.getElementById("cartList");
const totalEl=document.getElementById("total");
const paymentEl=document.getElementById("payment");
const changeEl=document.getElementById("change");
const backendResult=document.getElementById("backendResult");

const rupiah=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

function showProducts(){
productList.innerHTML=products.map(p=>`
<div class="product">
<span>${p.name} — ${rupiah(p.price)}</span>
<button onclick="addToCart(${p.id})">Tambah</button>
</div>`).join("");
}

function addToCart(id){
const product=products.find(p=>p.id===id);
const item=cart.find(p=>p.id===id);
item?item.qty++:cart.push({...product,qty:1});
showCart();
}

function removeFromCart(id){
cart=cart.filter(p=>p.id!==id);
showCart();
}

function showCart(){
if(!cart.length){
cartList.innerHTML='<p class="empty">Belum ada produk.</p>';
}else{
cartList.innerHTML=cart.map(p=>`
<div class="cart-item">
<span>${p.name} × ${p.qty}</span>
<span>${rupiah(p.price*p.qty)} <button class="remove" onclick="removeFromCart(${p.id})">Hapus</button></span>
</div>`).join("");
}

const total=cart.reduce((sum,p)=>sum+p.price*p.qty,0);
totalEl.textContent=rupiah(total);
updateChange();
}

function updateChange(){
const total=cart.reduce((sum,p)=>sum+p.price*p.qty,0);
const payment=Number(paymentEl.value)||0;
changeEl.textContent=rupiah(Math.max(0,payment-total));
}

paymentEl.addEventListener("input",updateChange);

document.getElementById("payBtn").addEventListener("click",()=>{
const total=cart.reduce((sum,p)=>sum+p.price*p.qty,0);
const payment=Number(paymentEl.value)||0;

if(!cart.length)return alert("Keranjang masih kosong.");
if(payment<total)return alert("Uang pembayaran belum cukup.");

alert("Pembayaran simulasi berhasil!");
cart=[];
paymentEl.value="";
showCart();
});

async function testBackend(){
backendResult.textContent="Mengirim data...";

try{
const response=await fetch("/api/order",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
product:"Coffee",
price:15000,
qty:2
})
});

const data=await response.json();
backendResult.textContent=JSON.stringify(data,null,2);
}catch(error){
backendResult.textContent="Gagal terhubung ke backend.";
console.error(error);
}
}

document.getElementById("testBackend").addEventListener("click",testBackend);

showProducts();
showCart();
