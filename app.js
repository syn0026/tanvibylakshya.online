// ==========================================
// WHATSAPP DYNAMIC INQUIRY ROUTING
// ==========================================
function inquireProduct(productName, productPrice) {
  // Put your actual business WhatsApp number here (Country code + number, no plus or spaces)
  const WHATSAPP_NUMBER = '916282620756'; 
  const message = `Namaskaram! I am interested in exploring the Tanvi heritage collection. I would like more details regarding the ${productName} (Listed at ₹${productPrice}).`;
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waLink, '_blank');
}

// ==========================================
// SANITY CMS INTEGRATION
// ==========================================
const PROJECT_ID = 'djnynazm'; 
const DATASET = 'production';
const WHATSAPP_NUMBER = '916282620756'; 

// Fetch New Arrivals, Best Sellers, and Categories in a single GROQ query
const QUERY = encodeURIComponent(`{
  "newArrivals": *[_type == "product" && isNew == true]{title, category, price, originalPrice, isNew, isBestSeller, "imageUrl": image.asset->url},
  "bestSellers": *[_type == "product" && isBestSeller == true]{title, category, price, originalPrice, isNew, isBestSeller, "imageUrl": image.asset->url},
  "categories": *[_type == "category"] | order(order asc) {title, subtitle, "imageUrl": image.asset->url}
}`);
  
const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

// Helper function to generate product cards with WhatsApp integration
function generateProductCard(product) {
  return `
    <article class="p-card">
      <div class="p-media">
        ${product.isNew ? `<span class="p-badge">NEW</span>` : ''}
        <img src="${product.imageUrl}" alt="${product.title}" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0;" />
        <button class="p-wish" aria-label="Add to wishlist">♡</button>
        <div class="p-quick">Quick View</div>
      </div>
      <div class="p-info">
        <span class="cat-name">${product.category || 'TANVI EXCLUSIVE'}</span>
        <h4>${product.title}</h4>
        <div class="p-price">
          <span class="now">₹${product.price}</span>
          ${product.originalPrice ? `<span class="was">₹${product.originalPrice}</span>` : ''}
        </div>
        <a href="javascript:void(0)" onclick="inquireProduct('${product.title}', '${product.price}')" class="p-cta" style="display:block; text-align:center; text-decoration:none;">Enquire on WhatsApp</a>
      </div>
    </article>`;
}

// Fetch and Inject Sanity Data
document.addEventListener('DOMContentLoaded', () => {
  fetch(URL)
    .then(res => res.json())
    .then(({ result }) => {
      if(result) {
        
        // 1. Render New Arrivals
        const newArrivalsContainer = document.querySelector('#new-arrivals .rail');
        if(newArrivalsContainer && result.newArrivals) {
            newArrivalsContainer.innerHTML = result.newArrivals.map(generateProductCard).join('');
        }

        // 2. Render Best Sellers
        const bestSellersContainer = document.querySelector('#bestsellers .rail');
        if(bestSellersContainer && result.bestSellers) {
            bestSellersContainer.innerHTML = result.bestSellers.map(generateProductCard).join('');
        }

        // 3. Render Categories (Living Traditions Grid)
        const categoryContainer = document.querySelector('.vintage-grid');
        if(categoryContainer && result.categories) {
            categoryContainer.innerHTML = result.categories.map((cat, index) => `
              <a href="#" class="vintage-card">
                <div class="img-frame">
                  <span class="vintage-index">NO. 0${index + 1}</span>
                  <div class="img-inner">
                    <img src="${cat.imageUrl}" alt="${cat.title}">
                  </div>
                </div>
                <div class="vintage-content">
                  <h3>${cat.title}</h3>
                  <span>${cat.subtitle || 'Explore Collection'}</span>
                </div>
              </a>
            `).join('');
        }
      }
    })
    .catch(err => console.error("Error fetching data from Sanity:", err));
});

// ==========================================
// UI INTERACTIONS
// ==========================================

// Navbar scroll state & Back to top button
const navbar = document.getElementById('navbar');
const toTop = document.getElementById('toTop');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 40);
  if(toTop) toTop.classList.toggle('show', y > 700);
});

// Mobile nav toggle
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
if(burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    document.body.classList.toggle('nav-open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Back to top functionality
if(toTop) {
  toTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

// Wishlist toggle (delegated to document so it works on dynamically injected Sanity items too)
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('p-wish')) {
    e.target.classList.toggle('active');
    e.target.textContent = e.target.classList.contains('active') ? '♥' : '♡';
  }
});

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
}, {threshold:.15});
revealEls.forEach(el => io.observe(el));

// Newsletter fake-submit
const nform = document.getElementById('nform');
if(nform) {
  nform.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('nformMsg').textContent = "Thank you — you're on the list. Watch your inbox for heritage stories & new arrivals.";
    e.target.reset();
  });
}

// Sunburst rays generator
(function(){
  const g = document.getElementById('rays');
  if(!g) return;
  const cx=200, cy=200, n=40, r1=170, r2=185;
  let d = '';
  for(let i=0;i<n;i++){
    const a = (i/n)*2*Math.PI;
    const x1 = cx + r1*Math.cos(a), y1 = cy + r1*Math.sin(a);
    const x2 = cx + r2*Math.cos(a), y2 = cy + r2*Math.sin(a);
    d += `M${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} `;
  }
  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d', d);
  path.setAttribute('stroke', '#C8A24D');
  path.setAttribute('stroke-width', '3');
  g.appendChild(path);
})();

// Floating gold particles
(function(){
  const wrap = document.getElementById('particles');
  if(!wrap) return;
  const count = window.innerWidth < 760 ? 14 : 28;
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 2 + Math.random()*4;
    p.style.width = size+'px';
    p.style.height = size+'px';
    p.style.left = Math.random()*100+'%';
    p.style.bottom = '-20px';
    p.style.animationDuration = (9 + Math.random()*10)+'s';
    p.style.animationDelay = (Math.random()*10)+'s';
    wrap.appendChild(p);
  }
})();