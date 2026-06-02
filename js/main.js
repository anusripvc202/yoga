/* 
 * Aarogya Yoga - Interactive Elements JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqs();
  initHeaderScroll();
  initContactForm();
});

/**
 * Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when a link is clicked, unless it is a dropdown toggle
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        if (link.classList.contains('dropdown-toggle') || link.getAttribute('href') === '#') {
          e.preventDefault();
          const parentItem = link.closest('.nav-item.dropdown');
          if (parentItem) {
            parentItem.classList.toggle('open');
          }
        } else {
          menuToggle.classList.remove('active');
          navLinks.classList.remove('active');
          // Collapse all dropdowns when menu closes
          navLinks.querySelectorAll('.nav-item.dropdown').forEach(item => {
            item.classList.remove('open');
          });
        }
      });
    });
  }
}

/**
 * FAQ Accordion Expand/Collapse & Filtering
 */
function initFaqs() {
  const faqItems = document.querySelectorAll('.faq-item');
  const searchInput = document.querySelector('.faq-search-input');

  // FAQ Accordion Click Handler
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    if (button && answer) {
      button.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Collapse all other FAQ items (optional, but premium feel)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
          }
        });

        // Toggle current FAQ
        item.classList.toggle('active');
        if (!isActive) {
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          answer.style.maxHeight = null;
        }
      });
    }
  });

  // FAQ Live Search Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question-btn').textContent.toLowerCase();
        const answerText = item.querySelector('.faq-answer-inner').textContent.toLowerCase();

        if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

/**
 * Shrink Header / Add Blur on Scroll
 */
function initHeaderScroll() {
  const header = document.querySelector('.header-nav');
  
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = 'var(--shadow-md)';
        header.style.backgroundColor = 'rgba(250, 245, 240, 0.95)';
        header.style.height = '70px';
      } else {
        header.style.boxShadow = 'none';
        header.style.backgroundColor = 'rgba(250, 245, 240, 0.85)';
        header.style.height = '80px';
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Call once in case page loads scrolled down
    handleScroll();
  }
}

/**
 * Handle Contact Form Submissions with success message
 */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';

      // Simulate API submit
      setTimeout(() => {
        submitBtn.innerHTML = 'Message Sent! ✓';
        submitBtn.style.backgroundColor = '#2E3B2E';
        form.reset();
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }
}
