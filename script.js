/* ==============================================
   KOMAL SANJAY MASKE — PORTFOLIO
   script.js  |  Clean, beginner-friendly JS
   ============================================== */

/* -----------------------------------------------
   1. NAVBAR — shadow on scroll + hamburger menu
   ----------------------------------------------- */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

// Add shadow when page is scrolled down
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Open / close mobile menu
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile menu when a nav link is tapped
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


/* -----------------------------------------------
   2. SMOOTH SCROLLING
      (CSS scroll-behavior handles most browsers,
       this is a JS fallback for older ones)
   ----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.pageYOffset - navbar.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* -----------------------------------------------
   3. SCROLL REVEAL ANIMATION
      Elements with .fade-up / .fade-left / .fade-right
      become visible when they enter the viewport
   ----------------------------------------------- */
const revealEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // animate once only
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// Trigger immediately for elements already in view on page load
window.addEventListener('load', () => {
  revealEls.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
      el.classList.add('visible');
    }
  });
});


/* -----------------------------------------------
   4. SKILL BAR ANIMATION
      Fill bars when the skills section scrolls into view
   ----------------------------------------------- */
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill = entry.target;
      // Small delay makes the animation noticeable
      setTimeout(() => {
        fill.style.width = fill.getAttribute('data-width') + '%';
      }, 250);
      skillObserver.unobserve(fill);
    }
  });
}, { threshold: 0.4 });

skillFills.forEach(fill => skillObserver.observe(fill));


/* -----------------------------------------------
   5. MODALS — Open, Close, Keyboard & Backdrop
   ----------------------------------------------- */

// Open a modal by its ID
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.style.display = 'flex';          // make it flex so content centres
  // Small delay so the CSS transition is visible
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });
  });
  document.body.style.overflow = 'hidden'; // prevent background scrolling
}

// Close a modal by its ID
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('visible');
  // Wait for CSS fade-out, then hide completely
  setTimeout(() => {
    modal.style.display = 'none';
  }, 320);
  document.body.style.overflow = '';
}

// Clickable module cards → open the matching modal
document.querySelectorAll('.module-card.clickable').forEach(card => {
  const modalId = card.getAttribute('data-modal');

  // Click
  card.addEventListener('click', () => openModal(modalId));

  // Keyboard — Enter or Space
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(modalId);
    }
  });
});

// Close buttons inside modals
document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    const modalId = btn.getAttribute('data-close');
    closeModal(modalId);
  });
});

// Click on dark backdrop → close modal
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {         // only if clicking the backdrop itself
      closeModal(overlay.id);
    }
  });
});

// Press Escape key → close any open modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.visible').forEach(modal => {
      closeModal(modal.id);
    });
  }
});


/* -----------------------------------------------
   6. DAY TABS inside modals
      Clicking Day 1 / Day 2 / ... shows that day's content
   ----------------------------------------------- */
document.querySelectorAll('.day-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    // Find the modal-box parent that contains this tab
    const box = tab.closest('.modal-box');

    // De-activate all tabs inside this modal
    box.querySelectorAll('.day-tab').forEach(t => t.classList.remove('active'));

    // Hide all day-content panels inside this modal
    box.querySelectorAll('.day-content').forEach(c => c.classList.remove('active'));

    // Activate the clicked tab
    tab.classList.add('active');

    // Show the matching day content
    const targetId = tab.getAttribute('data-day');
    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');
  });
});


/* -----------------------------------------------
   7. CONTACT FORM — validation + success message
   ----------------------------------------------- */
const contactForm = document.getElementById('contact-form');
const formStatus  = document.getElementById('form-status');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const email   = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();

    // Check that all fields are filled
    if (!name || !email || !message) {
      formStatus.style.color   = '#e74c3c';
      formStatus.textContent   = '⚠️ Please fill in all fields.';
      return;
    }

    // Simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formStatus.style.color   = '#e74c3c';
      formStatus.textContent   = '⚠️ Please enter a valid email address.';
      return;
    }

    // Success message (no backend needed for GitHub Pages)
    formStatus.style.color   = '#27ae60';
    formStatus.textContent   = '✅ Message sent! I\'ll get back to you soon.';
    contactForm.reset();

    // Clear message after 5 seconds
    setTimeout(() => { formStatus.textContent = ''; }, 5000);
  });
}
