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
  initChakraAnimations();
  initVideoTestimonials();
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
 * Uses .scrolled CSS class to deepen the green/gold navbar shade.
 */
function initHeaderScroll() {
  const header = document.querySelector('.header-nav');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
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
 * Hero Background Music Player
 * Plays a calm soothing background music track (bg_music.mp3) with premium volume fades.
 */
function initHeroVideoSound() {
  const btn         = document.getElementById('hero-sound-btn');
  const iconMuted   = document.getElementById('icon-muted');
  const iconUnmuted = document.getElementById('icon-unmuted');
  const label       = document.getElementById('sound-label');
  if (!btn) return;

  const bgMusic = new Audio('videos/bg_music.mp3');
  bgMusic.loop = true;
  bgMusic.volume = 0; // Starts muted to allow soft fade-in

  let isPlaying = false;
  let fadeInterval = null;

  function fadeVolume(targetVolume, durationMs, callback) {
    clearInterval(fadeInterval);
    const startVolume = bgMusic.volume;
    const step = 0.05;
    const diff = targetVolume - startVolume;
    if (Math.abs(diff) < 0.01) {
      bgMusic.volume = targetVolume;
      if (callback) callback();
      return;
    }

    const stepsCount = Math.ceil(Math.abs(diff) / step);
    const intervalTime = durationMs / stepsCount;

    fadeInterval = setInterval(() => {
      if (diff > 0) {
        bgMusic.volume = Math.min(targetVolume, bgMusic.volume + step);
      } else {
        bgMusic.volume = Math.max(targetVolume, bgMusic.volume - step);
      }

      if (Math.abs(bgMusic.volume - targetVolume) < 0.01) {
        bgMusic.volume = targetVolume;
        clearInterval(fadeInterval);
        if (callback) callback();
      }
    }, intervalTime);
  }

  btn.addEventListener('click', () => {
    if (!isPlaying) {
      // Set volume to 0 and play, then fade in to 0.35 (soothing volume)
      bgMusic.volume = 0;
      bgMusic.play().then(() => {
        isPlaying = true;
        fadeVolume(0.35, 1500);

        if (iconMuted)   iconMuted.style.display   = 'none';
        if (iconUnmuted) iconUnmuted.style.display = 'inline';
        if (label)       label.textContent         = '🎵 Stop Music';
        btn.classList.add('playing');
      }).catch(err => {
        console.error('Audio play failed:', err);
      });
    } else {
      // Fade out to 0, then pause
      fadeVolume(0, 1000, () => {
        bgMusic.pause();
        isPlaying = false;
      });

      if (iconMuted)   iconMuted.style.display   = 'inline';
      if (iconUnmuted) iconUnmuted.style.display = 'none';
      if (label)       label.textContent         = '🎵 Play Music';
      btn.classList.remove('playing');
    }
  });
}

/**
 * Scroll-triggered staggered animations for the chakras
 */
function initChakraAnimations() {
  const rows = document.querySelectorAll('.chakra-row');
  if (!rows.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    const visibleEntries = entries.filter(entry => entry.isIntersecting);
    
    if (visibleEntries.length > 0) {
      // Sort top-to-bottom for correct sequential order
      visibleEntries.sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top);

      visibleEntries.forEach((entry, index) => {
        const row = entry.target;
        if (!row.classList.contains('active')) {
          setTimeout(() => {
            row.classList.add('active');
          }, index * 250);
          observer.unobserve(row);
        }
      });
    }
  }, observerOptions);

  rows.forEach(row => observer.observe(row));
}

/**
 * Testimonial Videos - Playback control and aesthetic transitions
 */
function initVideoTestimonials() {
  const cards = document.querySelectorAll('.testimonial-video-card');
  const videos = document.querySelectorAll('.testimonial-video-card video');

  videos.forEach(video => {
    const card = video.closest('.testimonial-video-card');
    if (!card) return;

    // Play event listener
    video.addEventListener('play', () => {
      // Pause all other videos
      videos.forEach(otherVideo => {
        if (otherVideo !== video) {
          otherVideo.pause();
        }
      });
      
      // Add playing class to this card, remove from others
      cards.forEach(c => {
        if (c === card) {
          c.classList.add('playing');
        } else {
          c.classList.remove('playing');
        }
      });
    });

    // Pause/Ended listeners
    video.addEventListener('pause', () => {
      card.classList.remove('playing');
    });

    video.addEventListener('ended', () => {
      card.classList.remove('playing');
    });
  });
}
