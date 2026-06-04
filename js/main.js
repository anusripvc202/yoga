/* 
 * Aarogya Yoga - Interactive Elements JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqs();
  initHeaderScroll();
  initContactForm();
  initGallery();
  initHeroVideoSound();
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

/**
 * Media Gallery Filtering & Lightbox Modal Control
 */
function initGallery() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('lightboxModal');
  
  if (!filterBtns.length || !cards.length) return;
  
  // --- Filtering Logic ---
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          // Trigger reflow to animate
          card.offsetHeight;
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          // Wait for transition before display none
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
  
  // --- Lightbox Modal Logic ---
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const videoContainer = lightbox.querySelector('.lightbox-video-container');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxDesc = lightbox.querySelector('.lightbox-desc');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    
    let currentItems = [];
    let currentIndex = -1;
    
    // Get all currently visible items for sliding through them
    function updateCurrentItems() {
      const activeFilter = document.querySelector('.filter-btn.active');
      const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
      currentItems = Array.from(cards).filter(card => {
        return filter === 'all' || card.getAttribute('data-category') === filter;
      });
    }
    
    function openLightbox(index) {
      updateCurrentItems();
      currentIndex = currentItems.indexOf(cards[index]);
      if (currentIndex === -1) return;
      
      const card = currentItems[currentIndex];
      const mediaType = card.getAttribute('data-media-type');
      const title = card.querySelector('h3').textContent;
      const desc = card.querySelector('p').textContent;
      
      lightboxTitle.textContent = title;
      lightboxDesc.textContent = desc;
      
      // Clean up previous contents
      lightboxImg.style.display = 'none';
      videoContainer.style.display = 'none';
      videoContainer.innerHTML = '';
      
      if (mediaType === 'video') {
        const videoUrl = card.getAttribute('data-video-url');
        videoContainer.style.display = 'block';
        
        // Standard embeds or simple video player
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
          // YouTube embed
          let embedId = '';
          if (videoUrl.includes('youtube.com/embed/')) {
            embedId = videoUrl.split('youtube.com/embed/')[1].split('?')[0];
          } else if (videoUrl.includes('v=')) {
            embedId = videoUrl.split('v=')[1].split('&')[0];
          } else if (videoUrl.includes('youtu.be/')) {
            embedId = videoUrl.split('youtu.be/')[1].split('?')[0];
          }
          videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${embedId}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        } else {
          // HTML5 Direct Video
          videoContainer.innerHTML = `<video src="${videoUrl}" controls autoplay></video>`;
        }
        
        // Hide next/prev arrows for videos to keep visual focus
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
      } else {
        // Photo element
        const fullImgUrl = card.getAttribute('data-full-img') || card.querySelector('img').src;
        lightboxImg.src = fullImgUrl;
        lightboxImg.style.display = 'block';
        
        // Only show arrows if there's more than one visible photo
        const photoItems = currentItems.filter(item => item.getAttribute('data-media-type') === 'photo');
        if (photoItems.length > 1) {
          prevBtn.classList.remove('hidden');
          nextBtn.classList.remove('hidden');
        } else {
          prevBtn.classList.add('hidden');
          nextBtn.classList.add('hidden');
        }
      }
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock scrolling
    }
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = ''; // Unlock scrolling
      // Stop video playback on close
      videoContainer.innerHTML = '';
    }
    
    function showNext() {
      if (currentItems.length <= 1) return;
      let nextIndex = currentIndex;
      do {
        nextIndex = (nextIndex + 1) % currentItems.length;
      } while (currentItems[nextIndex].getAttribute('data-media-type') !== 'photo' && nextIndex !== currentIndex);
      
      if (nextIndex !== currentIndex) {
        const cardElement = currentItems[nextIndex];
        const mainIndex = Array.from(cards).indexOf(cardElement);
        openLightbox(mainIndex);
      }
    }
    
    function showPrev() {
      if (currentItems.length <= 1) return;
      let prevIndex = currentIndex;
      do {
        prevIndex = (prevIndex - 1 + currentItems.length) % currentItems.length;
      } while (currentItems[prevIndex].getAttribute('data-media-type') !== 'photo' && prevIndex !== currentIndex);
      
      if (prevIndex !== currentIndex) {
        const cardElement = currentItems[prevIndex];
        const mainIndex = Array.from(cards).indexOf(cardElement);
        openLightbox(mainIndex);
      }
    }
    
    // Event Listeners on cards
    cards.forEach((card, idx) => {
      card.addEventListener('click', () => {
        openLightbox(idx);
      });
    });
    
    closeBtn.addEventListener('click', closeLightbox);
    
    // Clicking outside content closes lightbox
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-wrapper') || e.target.classList.contains('lightbox-content-box')) {
        closeLightbox();
      }
    });
    
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrev();
    });
    
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNext();
    });
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight' && !nextBtn.classList.contains('hidden')) {
        showNext();
      } else if (e.key === 'ArrowLeft' && !prevBtn.classList.contains('hidden')) {
        showPrev();
      }
    });
  }
}

/**
 * Hero Video Sound Toggle
 * Uses YouTube IFrame API postMessage to mute/unmute the background video.
 */
function initHeroVideoSound() {
  const btn = document.getElementById('hero-sound-btn');
  const iframe = document.getElementById('hero-yt-iframe');
  if (!btn || !iframe) return;

  const iconMuted   = document.getElementById('icon-muted');
  const iconUnmuted = document.getElementById('icon-unmuted');
  const label       = document.getElementById('sound-label');

  let isMuted = true;

  // Send postMessage command to YouTube iframe
  function sendYTCommand(func, args) {
    try {
      iframe.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args: args || [] }),
        '*'
      );
    } catch (e) {
      console.warn('YT postMessage failed:', e);
    }
  }

  btn.addEventListener('click', () => {
    if (isMuted) {
      sendYTCommand('unMute');
      sendYTCommand('setVolume', [80]);
      isMuted = false;
      iconMuted.style.display   = 'none';
      iconUnmuted.style.display = 'inline';
      label.textContent = 'Sound On';
    } else {
      sendYTCommand('mute');
      isMuted = true;
      iconMuted.style.display   = 'inline';
      iconUnmuted.style.display = 'none';
      label.textContent = 'Sound Off';
    }
  });
}
