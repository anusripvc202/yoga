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
  initChakraAutoScroll();
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
 * Hero Ambient Music — Indian Yoga Soundscape (Web Audio API)
 * Layered tanpura-style drone + temple bell arpeggios + singing bowl resonance.
 * No external files · No YouTube · Zero ads.
 */
function initHeroVideoSound() {
  const btn         = document.getElementById('hero-sound-btn');
  const iconMuted   = document.getElementById('icon-muted');
  const iconUnmuted = document.getElementById('icon-unmuted');
  const label       = document.getElementById('sound-label');
  if (!btn) return;

  let audioCtx   = null;
  let masterGain = null;
  let sources    = [];
  let bellTimer  = null;
  let isPlaying  = false;

  /* Long reverb impulse (cathedral-style) */
  function makeReverb(ctx, seconds, decay) {
    const len    = ctx.sampleRate * seconds;
    const buf    = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    const node = ctx.createConvolver();
    node.buffer = buf;
    return node;
  }

  /* Drone oscillator (sine/triangle) with slow fade-in */
  function addDrone(ctx, dest, freq, type, vol, detuneCents) {
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value    = detuneCents || 0;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 5);
    osc.connect(gain);
    gain.connect(dest);
    osc.start();
    sources.push({ osc, gain });
  }

  /* Single temple-bell strike using decaying sinusoids */
  function strikeBell(ctx, dest, freq, vol) {
    const t    = ctx.currentTime;
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type            = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 4.5);
    osc.connect(gain);
    gain.connect(dest);
    osc.start(t);
    osc.stop(t + 5);
    // Overtone shimmer
    const osc2  = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type             = 'sine';
    osc2.frequency.value  = freq * 2.756; // Tibetan bowl overtone ratio
    gain2.gain.setValueAtTime(vol * 0.3, t);
    gain2.gain.exponentialRampToValueAtTime(0.0001, t + 2.8);
    osc2.connect(gain2);
    gain2.connect(dest);
    osc2.start(t);
    osc2.stop(t + 3);
  }

  /* Indian pentatonic scale: Sa Re Ga Pa Dha (C D E G A) */
  const bellNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];

  function scheduleBells(ctx, dest) {
    let noteIdx = 0;
    function next() {
      if (!isPlaying) return;
      const freq  = bellNotes[noteIdx % bellNotes.length];
      strikeBell(ctx, dest, freq, 0.18);
      noteIdx++;
      /* Random gap between 3.5 and 8 seconds for a meditative feel */
      const gap = 3500 + Math.random() * 4500;
      bellTimer = setTimeout(next, gap);
    }
    bellTimer = setTimeout(next, 1500); // first bell after 1.5s
  }

  function startAmbient() {
    audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0, audioCtx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 5);

    // Reverb chain
    const reverb     = makeReverb(audioCtx, 6, 2.8);
    const revGain    = audioCtx.createGain();
    revGain.gain.value = 0.45;
    masterGain.connect(reverb);
    reverb.connect(revGain);
    revGain.connect(audioCtx.destination);
    masterGain.connect(audioCtx.destination);

    // ── Tanpura-style Drone ──────────────────────────────
    // Sa  (C2 = 65.41 Hz) — root
    addDrone(audioCtx, masterGain, 65.41,  'sine',     0.50,  0);
    addDrone(audioCtx, masterGain, 65.41,  'sine',     0.22,  +4);  // binaural beat
    // Pa  (G2 = 98.00 Hz) — 5th
    addDrone(audioCtx, masterGain, 98.00,  'sine',     0.30,  -3);
    // Sa octave (C3 = 130.81 Hz)
    addDrone(audioCtx, masterGain, 130.81, 'sine',     0.18,  +2);
    // Ma  (F3 = 174.61 Hz) — 4th, warm pad
    addDrone(audioCtx, masterGain, 174.61, 'triangle', 0.10,  0);
    // Airy Sa high (C5 = 523.25 Hz) — very soft shimmer
    addDrone(audioCtx, masterGain, 523.25, 'sine',     0.022, -5);

    // Slow breathing LFO (0.05 Hz ≈ 1 breath per 20s)
    const lfo     = audioCtx.createOscillator();
    const lfoGain = audioCtx.createGain();
    lfo.type            = 'sine';
    lfo.frequency.value = 0.05;
    lfoGain.gain.value  = 0.06;
    lfo.connect(lfoGain);
    lfoGain.connect(masterGain.gain);
    lfo.start();
    sources.push({ osc: lfo, gain: lfoGain });

    // ── Temple Bell Arpeggios ─────────────────────────────
    scheduleBells(audioCtx, masterGain);
  }

  function stopAmbient() {
    if (!audioCtx) return;
    clearTimeout(bellTimer);
    isPlaying = false;
    const now = audioCtx.currentTime;
    masterGain.gain.setValueAtTime(masterGain.gain.value, now);
    masterGain.gain.linearRampToValueAtTime(0, now + 2.5);
    setTimeout(() => {
      sources.forEach(({ osc }) => { try { osc.stop(); } catch(e) {} });
      sources = [];
      audioCtx.close();
      audioCtx = null;
    }, 2800);
  }

  btn.addEventListener('click', () => {
    if (!isPlaying) {
      isPlaying = true;
      startAmbient();
      if (iconMuted)   iconMuted.style.display   = 'none';
      if (iconUnmuted) iconUnmuted.style.display = 'inline';
      if (label)       label.textContent         = '🎵 Stop Music';
      btn.classList.add('playing');
    } else {
      stopAmbient();
      if (iconMuted)   iconMuted.style.display   = 'inline';
      if (iconUnmuted) iconUnmuted.style.display = 'none';
      if (label)       label.textContent         = '🎵 Play Music';
      btn.classList.remove('playing');
    }
  });
}

/**
 * Auto-scroll the chakras container slowly on mobile/tablet screens.
 * Automatically pauses on manual touch/interaction, restoring snapping.
 */
function initChakraAutoScroll() {
  const container = document.querySelector('.chakras-horizontal-container');
  if (!container) return;

  let scrollSpeed = 0.3; // Pixels per frame
  let scrollDirection = 1; // 1 = right, -1 = left
  let isUserInteracting = false;
  let resumeTimeout = null;

  function step() {
    // Only auto-scroll on tablet/mobile screens (<= 1200px) when user is not touching it
    if (window.innerWidth <= 1200 && !isUserInteracting) {
      // Temporarily remove snap type for fluid JS auto-scroll
      if (container.style.scrollSnapType !== 'none') {
        container.style.scrollSnapType = 'none';
      }

      container.scrollLeft += scrollSpeed * scrollDirection;

      const maxScroll = container.scrollWidth - container.clientWidth;
      if (scrollDirection === 1 && container.scrollLeft >= maxScroll - 1) {
        scrollDirection = -1; // Reverse to left
      } else if (scrollDirection === -1 && container.scrollLeft <= 1) {
        scrollDirection = 1; // Reverse to right
      }
    }
    requestAnimationFrame(step);
  }

  function handleUserInteraction() {
    isUserInteracting = true;
    // Restore default scroll snapping for manual swipe feedback
    container.style.scrollSnapType = '';

    if (resumeTimeout) clearTimeout(resumeTimeout);
    resumeTimeout = setTimeout(() => {
      isUserInteracting = false;
    }, 4000); // Resume after 4 seconds of inactivity
  }

  // Listeners to pause auto-scrolling during drag/swipe/scroll
  container.addEventListener('touchstart', handleUserInteraction, { passive: true });
  container.addEventListener('touchmove', handleUserInteraction, { passive: true });
  container.addEventListener('mousedown', handleUserInteraction, { passive: true });
  container.addEventListener('wheel', handleUserInteraction, { passive: true });

  // Start the auto-scroll loop
  step();
}



