
const products = [
  {id:1,name:"Specialized Epic 8 EVO",category:"MTB",tag:"XC / Trail",price:"Consultar",desc:"Velocidad de XC con mayor control y capacidad para terrenos técnicos.",specs:["Carbono","Suspensión total","Configuración personalizada"]},
  {id:2,name:"Specialized Epic World Cup",category:"MTB",tag:"XC Race",price:"Consultar",desc:"Respuesta inmediata, eficiencia y precisión para competición.",specs:["XC Racing","Geometría competitiva","Armado profesional"]},
  {id:3,name:"Specialized Tarmac SL8",category:"Ruta",tag:"Ruta",price:"Consultar",desc:"Aerodinámica, bajo peso y rendimiento integral para ruta.",specs:["Carbono","Ruta","Ajuste de posición"]},
  {id:4,name:"Specialized Crux",category:"Gravel",tag:"Gravel",price:"Consultar",desc:"Ligera, rápida y versátil para caminos mixtos y aventura.",specs:["Gravel","Alta versatilidad","Talles disponibles"]},
  {id:5,name:"Specialized Turbo Levo",category:"E-Bike",tag:"E-MTB",price:"Consultar",desc:"Asistencia potente y control para ampliar cada salida.",specs:["E-Bike","Trail","Soporte posventa"]},
  {id:6,name:"Armado personalizado",category:"MTB",tag:"A la carta",price:"A medida",desc:"Elegí cuadro, transmisión, ruedas y componentes según tu objetivo.",specs:["Configuración","Selección de componentes","Entrega lista para rodar"]}
];

let cart = [];

const grid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const backdrop = document.getElementById("backdrop");
const cartItems = document.getElementById("cartItems");
const modal = document.getElementById("productModal");
const modalContent = document.getElementById("modalContent");

function renderProducts(filter="Todos"){
  const list = filter === "Todos" ? products : products.filter(p=>p.category===filter);
  grid.innerHTML = list.map(p=>`
    <article class="product-card">
      <div class="product-image">${p.category}</div>
      <div class="product-body">
        <div class="product-topline"><span>${p.tag}</span><span>${p.price}</span></div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-actions">
          <button onclick="openProduct(${p.id})">Ver detalles</button>
          <button class="add" onclick="addToCart(${p.id})">Agregar</button>
        </div>
      </div>
    </article>`).join("");
}

function setFilter(filter){
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter===filter));
  renderProducts(filter);
}

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>setFilter(btn.dataset.filter)));
document.querySelectorAll("[data-filter-link]").forEach(link=>link.addEventListener("click",()=>setFilter(link.dataset.filterLink)));

window.openProduct = id => {
  const p = products.find(x=>x.id===id);
  modalContent.innerHTML = `<div class="modal-product">
    <p class="eyebrow">${p.tag}</p>
    <h2>${p.name}</h2>
    <p>${p.desc}</p>
    <div class="modal-specs">${p.specs.map(s=>`<div>${s}</div>`).join("")}</div>
    <button class="btn btn-primary" onclick="addToCart(${p.id});closeModal()">Agregar a mi selección</button>
  </div>`;
  modal.classList.add("show");backdrop.classList.add("show");
};

window.closeModal = ()=>{modal.classList.remove("show");if(!cartDrawer.classList.contains("open"))backdrop.classList.remove("show")};
document.getElementById("closeModal").onclick=closeModal;

window.addToCart = id => {
  const p = products.find(x=>x.id===id);
  if(!cart.some(x=>x.id===id)) cart.push(p);
  updateCart();
  toast("Producto agregado a tu selección");
};

function updateCart(){
  cartCount.textContent=cart.length;
  cartItems.innerHTML = cart.length ? cart.map(p=>`
    <div class="cart-line"><div><strong>${p.name}</strong><br><small>${p.tag}</small></div>
    <button onclick="removeFromCart(${p.id})">Quitar</button></div>`).join("") : "<p>Tu selección está vacía.</p>";
  const text = encodeURIComponent("Hola Saenz Bikes, quiero consultar por: " + cart.map(p=>p.name).join(", "));
  document.getElementById("cartWhatsApp").href=`https://wa.me/5492235857654?text=${text}`;
}

window.removeFromCart = id => {cart=cart.filter(x=>x.id!==id);updateCart()};

function openCart(){cartDrawer.classList.add("open");backdrop.classList.add("show")}
function closeCart(){cartDrawer.classList.remove("open");if(!modal.classList.contains("show"))backdrop.classList.remove("show")}
document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
backdrop.onclick=()=>{closeCart();closeModal()};

document.getElementById("bikeFinder").addEventListener("submit",e=>{
  e.preventDefault();
  const use=document.getElementById("finderUse").value;
  const priority=document.getElementById("finderPriority").value;
  const budget=document.getElementById("finderBudget").value;
  const msg=encodeURIComponent(`Hola Saenz Bikes, busco una bicicleta. Uso: ${use}. Prioridad: ${priority}. Presupuesto: ${budget}.`);
  window.open(`https://wa.me/5492235857654?text=${msg}`,"_blank");
});

document.getElementById("newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();toast("Suscripción registrada en esta demostración");e.target.reset()
});

document.getElementById("searchBtn").onclick=()=>toast("Buscador preparado para integrar con el catálogo");

function toast(message){
  const t=document.createElement("div");t.className="toast";t.textContent=message;document.body.appendChild(t);
  setTimeout(()=>t.remove(),2200);
}

renderProducts();
updateCart();
