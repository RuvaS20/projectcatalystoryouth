

// =========================================
// 1. HAMBURGER MENU LOGIC (The Three Lines)
// =========================================
const menuBtn = document.querySelector('.nav');
const fullMenu = document.querySelector('.slide');

if (menuBtn && fullMenu) {
    menuBtn.addEventListener('click', function(event) {
        event.preventDefault();
        const open = menuBtn.classList.toggle('active');
        fullMenu.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
    });

    // Close the panel after following a link, and on Escape
    fullMenu.addEventListener('click', function(event) {
        if (!event.target.closest('a')) return;
        menuBtn.classList.remove('active');
        fullMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
    });

    document.addEventListener('keydown', function(event) {
        if (event.key !== 'Escape' || !fullMenu.classList.contains('open')) return;
        menuBtn.classList.remove('active');
        fullMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.focus();
    });
}

const allDropdowns = document.querySelectorAll('.slide details');
allDropdowns.forEach((targetDropdown) => {
    targetDropdown.addEventListener('click', () => {
        allDropdowns.forEach((dropdown) => {
            if (dropdown !== targetDropdown) {
                dropdown.removeAttribute('open');
            }
        });
    });
});

// =========================================
// 2. HEADER SCROLL & TEXT FADE LOGIC
// =========================================
let lastScrollTop = 0;
const header = document.querySelector('.container');
const fadeElements = document.querySelectorAll('.fade-text');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Header Smart Scroll Logic
    if (header) {
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (scrollTop > lastScrollTop && scrollTop > 150) {
            header.classList.add('hide-header');
        } else {
            header.classList.remove('hide-header');
        }
    }
    
    // Upgraded Text Fading Logic (Fades out smoothly as it hits the top of the screen)
    fadeElements.forEach(el => {
        let elementTop = el.getBoundingClientRect().top;
        let windowHeight = window.innerHeight;
        
        // Starts fading when the text enters the top 30% of the screen
        let fadePoint = windowHeight * 0.3; 
        
        let opacity = 1;
        if (elementTop < fadePoint) {
            opacity = elementTop / fadePoint; 
        }
        
        if (opacity < 0) opacity = 0;
        if (opacity > 1) opacity = 1;
        
        el.style.opacity = opacity;
        el.style.pointerEvents = opacity === 0 ? 'none' : 'auto';
    });

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
});


// =========================================
// 3. INTERACTIVE MOUSE PARALLAX LOGIC
// =========================================
const follower = document.getElementById('instafollow');
const container = document.querySelector('.instapage');

if (follower && container) {
    document.addEventListener('mousemove', function(e) {
        // 1. Get the exact size and location of the box on the screen
        const rect = container.getBoundingClientRect();
        
        // 2. Find the dead-center of the box itself
        const centerX = rect.left + (rect.width / 2);
        const centerY = rect.top + (rect.height / 2);

        // 3. Calculate movement relative to the box!
        const moveX = (e.clientX - centerX) * 0.04;
        const moveY = (e.clientY - centerY) * 0.04;

        follower.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    });
}




// ==========================================
// 1. PRICING CONTROL CENTER
// ==========================================
// If you ever want to alter prices via script, change these.
// Note: Ensure you manually add id="tier4-price" to Tier 4 in your HTML file if you want it to auto-update!
const bearCubPrice = "$30";
const grizzlyPrice = "$45";
const kodiakPrice = "$55";
const ultimatePrice = "$65";

// Inject prices into the HTML elements matching your file structure
document.addEventListener("DOMContentLoaded", function() {
  const t1 = document.getElementById("tier1-price");
  const t2 = document.getElementById("tier2-price");
  const t3 = document.getElementById("tier3-price");
  const t4 = document.getElementById("tier4-price"); // Requires id="tier4-price" on your Tier 4 card

  if (t1) t1.innerText = bearCubPrice;
  if (t2) t2.innerText = grizzlyPrice;
  if (t3) t3.innerText = kodiakPrice;
  if (t4) t4.innerText = ultimatePrice;
});

// ==========================================
// 2. FORM SUBMISSION TO GOOGLE SHEETS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('ticket-form'); // Matches your form id
  const submitBtn = document.getElementById('submit-button'); // Matches your button id

  if (form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault(); 

      // UX: Show processing state on the button
      const originalText = submitBtn.innerText;
      submitBtn.innerText = "Processing Your Request...";
      submitBtn.disabled = true;

      // Gather Form Data directly using your exact HTML input IDs
      const name = document.getElementById('user-name').value; // Matches id="user-name"
      const email = document.getElementById('user-email').value; // Matches id="user-email"
      const packageSelect = document.getElementById('package-selection'); // Matches id="package-selection"
      const selectedOption = packageSelect.options[packageSelect.selectedIndex];
      
      const paypalUrl = selectedOption.getAttribute('data-url');
      const packageName = selectedOption.text;

      // 🚨 PASTE YOUR DEPLOYED GOOGLE WEB APP URL HERE:
      const googleWebAppUrl = 'YOUR_LONG_GOOGLE_URL_HERE'; 

      // Send the clean dataset to your Apps Script Web App
      fetch(googleWebAppUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' 
        },
        body: JSON.stringify({
          Name: name,
          Email: email,
          PackageSelected: packageName
        })
      })
      .then(response => {
        // Success! Redirect out to PayPal to collect funds
        window.location.href = paypalUrl;
      })
      .catch(error => {
        console.error('Error saving execution dataset:', error);
        alert('There was a slight issue recording your info, but you can still complete your payment securely via PayPal!');
        // Failsafe exit logic: forward them to payment link anyway
        window.location.href = paypalUrl; 
      })
      .finally(() => {
        // Safe timeout mechanism to unlock submission buttons if slow connection
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.disabled = false;
        }, 3000);
      });
    });
  }
});