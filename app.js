// ==========================================
// WHATSAPP DYNAMIC INQUIRY ROUTING
// ==========================================
function inquireProduct(productName, productPrice, imageUrl) {
  const WHATSAPP_NUMBER = '916282620756'; 
  
  // Create the base message
  let message = `Namaskaram! I am interested in exploring the Tanvi heritage collection. I would like more details regarding the ${productName} (Listed at ₹${productPrice}).`;
  
  // If an image URL is provided, add it to the message
  if (imageUrl) {
      message += `\n\nProduct Image Reference: ${imageUrl}`;
  }

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(waLink, '_blank');
}

// ==========================================
// SANITY CMS INTEGRATION
// ==========================================
const PROJECT_ID = 'djnynazm'; 
const DATASET = 'production';

// Fetch New Arrivals and Best Sellers
const QUERY = encodeURIComponent(`{
  "newArrivals": *[_type == "product" && isNew == true]{title, category, price, originalPrice, isNew, isBestSeller, "imageUrl": image.asset->url},
  "bestSellers": *[_type == "product" && isBestSeller == true]{title, category, price, originalPrice, isNew, isBestSeller, "imageUrl": image.asset->url}
}`);
  
const URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${QUERY}`;

// Luxury Product Card Generator
function generateProductCard(product) {
  // We use .replace(/'/g, "\\'") to prevent product names with apostrophes from breaking the code
  const safeTitle = product.title.replace(/'/g, "\\'");
  
  return `
    <article class="p-card">
      <div class="p-media">
        ${product.isNew ? `<span class="p-badge">NEW</span>` : ''}
        <img src="${product.imageUrl}" alt="${product.title}" />
        <button class="p-wish" aria-label="Add to wishlist">♡</button>
      </div>
      <div class="p-info">
        <span class="cat-name">${product.category || 'TANVI EXCLUSIVE'}</span>
        <h4>${product.title}</h4>
        <div class="p-price">
          <span class="now">₹${product.price}</span>
          ${product.originalPrice ? `<span class="was">₹${product.originalPrice}</span>` : ''}
        </div>
        <!-- We now pass the product.imageUrl into the function -->
        <a href="javascript:void(0)" onclick="inquireProduct('${safeTitle}', '${product.price}', '${product.imageUrl}')" class="p-cta">Enquire on WhatsApp</a>
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
        const newArrivalsContainer = document.getElementById('new-arrivals-rail');
        if(newArrivalsContainer && result.newArrivals && result.newArrivals.length > 0) {
            newArrivalsContainer.innerHTML = result.newArrivals.map(generateProductCard).join('');
        }

        // 2. Render Best Sellers
        const bestSellersContainer = document.getElementById('bestsellers-rail');
        if(bestSellersContainer && result.bestSellers && result.bestSellers.length > 0) {
            bestSellersContainer.innerHTML = result.bestSellers.map(generateProductCard).join('');
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
  if(navbar) navbar.classList.toggle('scrolled', y > 40);
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

// Reveal on scroll animation
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
}, {threshold: 0.15});
revealEls.forEach(el => io.observe(el));

// Newsletter form handling
const nform = document.getElementById('nform');
if(nform) {
  nform.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('nformMsg').textContent = "Thank you — you're on the list. Watch your inbox for heritage stories & new arrivals.";
    e.target.reset();
  });
}
// ==========================================
// LUXURY COLLECTION DRAWER LOGIC
// ==========================================

// This is your product database for the specific categories.
// You can easily update prices, titles, and image paths here!
const collectionsDB = {
  'setmundu': [
    { title: "Hemangi", price: "999", originalPrice: "1299", img: "assets/hemant.png" },
    { title: "Sooryakanthi", price: "6,200", originalPrice: "7000", img: "assets/suriyakathi.png" }
  ],
  'malkotta': [
    { title: "Pure Malkotta Cotton Saree", price: "3,800", originalPrice: "4,500", img: "assets/malkotta-saree.png" },
    { title: "Malkotta with Kasavu Border", price: "4,100", originalPrice: "", img: "assets/malkotta-saree.png" }
  ],
  'mens': [
    { title: "Heritage Gold Border Mundu", price: "3,450", originalPrice: "", img: "assets/mund.png" },
    { title: "Premium Wedding Kasavu", price: "5,000", originalPrice: "6,500", img: "assets/mund.png" }
  ],
  'dance': [
    { title: "Mohiniyattam Authentic Attire", price: "8,500", originalPrice: "9,999", img: "assets/claaassical.png" }
  ],
  'jewellery': [
    { title: "Nagas Choker Set", price: "12,000", originalPrice: "14,500", img: "assets/ornaments.png" },
    { title: "Traditional Palakkal Mala", price: "9,500", originalPrice: "", img: "assets/ornaments.png" }
  ],
  'aranmula': [
    { title: "Royal Hand Mirror", price: "8,900", originalPrice: "", img: "assets/aranmula.webp" },
    { title: "Peacock Base Valkannadi", price: "14,000", originalPrice: "15,500", img: "assets/aranmula.webp" }
  ]
};

// Function to open the drawer and load the specific products
function openCollection(categoryId, titleText) {
  const drawer = document.getElementById('collectionDrawer');
  const title = document.getElementById('drawerTitle');
  const grid = document.getElementById('drawerGrid');
  
  // Set the title of the drawer
  title.innerText = titleText;
  
  // Get the products for the clicked category
  const products = collectionsDB[categoryId] || [];
  
  // Generate the HTML for the products
  grid.innerHTML = products.map(product => {
    // Reuses your existing WhatsApp logic!
    const safeTitle = product.title.replace(/'/g, "\\'");
    
    // Check if it has a discount price
    const priceHTML = product.originalPrice 
      ? `<span class="now">₹${product.price}</span><span class="was">₹${product.originalPrice}</span>` 
      : `<span class="now">₹${product.price}</span>`;

    return `
      <article class="d-card">
        <div class="d-media">
          <img src="${product.img}" alt="${product.title}">
        </div>
        <div class="d-info">
          <h4>${product.title}</h4>
          <div class="p-price">${priceHTML}</div>
          <a href="javascript:void(0)" onclick="inquireProduct('${safeTitle}', '${product.price}', '${window.location.origin}/${product.img}')" class="p-cta">Enquire on WhatsApp</a>
        </div>
      </article>
    `;
  }).join('');
  
  // Lock background scrolling and show drawer
  document.body.style.overflow = 'hidden';
  drawer.classList.add('active');
}

// Function to close the drawer
function closeCollection() {
  const drawer = document.getElementById('collectionDrawer');
  document.body.style.overflow = 'auto'; // Restore scrolling
  drawer.classList.remove('active');
}