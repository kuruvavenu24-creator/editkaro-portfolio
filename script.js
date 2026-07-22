const sampleVideos = Object.freeze({
  flower: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  sintel: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
  bunny: 'https://media.w3.org/2010/05/bunny/trailer.mp4'
});

const projects = [
  { title: 'The 7-Second Hook', category: 'Short Form Videos', duration: '00:27', client: 'NOVA SKIN', description: 'A tactile launch reel that turned a skincare ritual into a daily pause.', image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85', video: sampleVideos.flower, size: 'tall' },
  { title: 'Rebuilding the Frame', category: 'Documentary Style', duration: '12:48', client: 'THE HUSTLE ROOM', description: 'A quiet, texture-rich portrait of the work behind a new creative practice.', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1500&q=85', video: sampleVideos.sintel, size: 'wide' },
  { title: 'Pixel Perfect', category: 'Gaming Videos', duration: '01:44', client: 'ROG ARENA', description: 'An RGB-loaded tournament teaser built to make the lobby feel louder.', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=85', video: sampleVideos.sintel, size: '' },
  { title: 'Ninety in Nine', category: 'Football Edits', duration: '00:48', client: 'THE TOUCHLINE', description: 'A full season of adrenaline compressed into one unblinking minute.', image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?auto=format&fit=crop&w=900&q=85', video: sampleVideos.bunny, size: '' },
  { title: 'Golden Hour, Bottled', category: 'eCommerce Ads', duration: '00:35', client: 'ORO FRAGRANCES', description: 'A luxe product film that lets light do the selling.', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85', video: sampleVideos.flower, size: 'wide' },
  { title: 'Tokyo After Dark', category: 'Color Grading', duration: '01:12', client: 'KIZUNA FILMS', description: 'A before-and-after color journey from flat footage to neon atmosphere.', image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7453?auto=format&fit=crop&w=900&q=85', video: sampleVideos.sintel, size: '' },
  { title: 'Parallel Hearts', category: 'Anime Videos', duration: '00:56', client: 'ANIMEX', description: 'A high-feeling fan edit where every beat hits on cue.', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=85', video: sampleVideos.bunny, size: 'tall' },
  { title: 'Made of Momentum', category: 'Advertisements', duration: '00:30', client: 'VOLT MOBILITY', description: 'A punchy launch campaign for a city that never waits.', image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1500&q=85', video: sampleVideos.flower, size: 'wide' },
  { title: 'Conversations that Stick', category: 'Long Form Videos', duration: '28:15', client: 'OFF THE RECORD', description: 'A long-form visual system that makes a brilliant conversation feel intimate.', image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=900&q=85', video: sampleVideos.sintel, size: '' }
];

const categories = ['All', 'Short Form Videos', 'Long Form Videos', 'Gaming Videos', 'Football Edits', 'eCommerce Ads', 'Documentary Style', 'Color Grading', 'Anime Videos', 'Advertisements'];
const gallery = document.getElementById('gallery');
const filters = document.getElementById('filters');
const count = document.getElementById('projectCount');
const opening = document.getElementById('opening');
const openingCount = document.getElementById('openingCount');
const openingStart = performance.now();
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let openingFinished = false;

function finishOpening() {
  if (openingFinished) return;
  openingFinished = true;
  openingCount.textContent = '100';
  document.body.classList.remove('is-loading');
  document.body.classList.add('is-ready');
  opening.classList.add('reveal-opening');
}

function updateOpening(now) {
  const progress = Math.min((now - openingStart) / 1250, 1);
  openingCount.textContent = String(Math.round(progress * 100)).padStart(2, '0');
  if (progress < 1) requestAnimationFrame(updateOpening);
}

if (reducedMotion) {
  window.setTimeout(finishOpening, 50);
} else {
  requestAnimationFrame(updateOpening);
  window.addEventListener('load', () => {
    const elapsed = performance.now() - openingStart;
    window.setTimeout(finishOpening, Math.max(0, 1350 - elapsed));
  }, { once: true });
  window.setTimeout(finishOpening, 2600);
}
window.addEventListener('error', event => {
  if (event.error) finishOpening();
}, { once: true });

const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

function setMenuState(isOpen) {
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
}

menuToggle.addEventListener('click', () => setMenuState(!document.body.classList.contains('menu-open')));
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuState(false)));

function renderFilters() {
  filters.innerHTML = categories.map((category, index) => `<button class="filter-chip ${index === 0 ? 'active' : ''}" type="button" data-filter="${category}">${category}</button>`).join('');
}

function renderProjects(filter = 'All') {
  const visible = filter === 'All' ? projects : projects.filter(project => project.category === filter);
  count.textContent = String(visible.length).padStart(2, '0');
  gallery.innerHTML = visible.map(project => `
    <article class="project-card ${project.size}" data-category="${project.category}" data-index="${projects.indexOf(project)}" tabindex="0" role="button" aria-label="Play ${project.title} video">
      <div class="project-image"><img src="${project.image}" alt="${project.title} project thumbnail" loading="lazy" decoding="async"></div>
      <span class="project-hover">Play project</span><span class="project-play">▶</span>
      <div class="project-meta"><div class="project-meta-top"><span>${project.category}</span><span>${project.duration}</span></div><h3>${project.title}</h3></div>
    </article>`).join('');
}

function markMissingImage(event) {
  const image = event.target;
  if (!(image instanceof HTMLImageElement)) return;
  image.closest('.project-image, .case-visual-image')?.classList.add('image-unavailable');
}

renderFilters();
renderProjects();
document.querySelectorAll('img').forEach(image => image.addEventListener('error', markMissingImage));
gallery.addEventListener('error', markMissingImage, true);

filters.addEventListener('click', event => {
  const button = event.target.closest('.filter-chip');
  if (!button) return;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('active', chip === button));
  renderProjects(button.dataset.filter);
});

const lightbox = document.getElementById('lightbox');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxMedia = document.getElementById('lightboxMedia');
const lightboxPlay = document.getElementById('lightboxPlay');
const videoProgress = document.getElementById('videoProgress');
const videoTime = document.getElementById('videoTime');
const videoStatus = document.getElementById('videoStatus');
const videoError = document.getElementById('videoError');
const pageRegions = [document.querySelector('.site-header'), document.querySelector('main'), mobileNav];
const modalFields = {
  image: document.getElementById('lightboxPoster'), title: document.getElementById('lightboxTitle'), category: document.getElementById('lightboxCategory'),
  description: document.getElementById('lightboxDescription'), client: document.getElementById('lightboxClient'), duration: document.getElementById('lightboxDuration')
};
let lastFocusedElement = null;

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60) || 0;
  const remainingSeconds = Math.floor(seconds % 60) || 0;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function updateVideoUi() {
  const duration = Number.isFinite(lightboxVideo.duration) ? lightboxVideo.duration : 0;
  const elapsed = Number.isFinite(lightboxVideo.currentTime) ? lightboxVideo.currentTime : 0;
  const isPlaying = !lightboxVideo.paused && !lightboxVideo.ended;
  videoProgress.style.width = duration ? `${(elapsed / duration) * 100}%` : '0%';
  videoTime.textContent = `${isPlaying ? 'Ⅱ' : '▶'} ${formatTime(elapsed)}`;
  lightboxPlay.textContent = isPlaying ? 'Ⅱ' : '▶';
  lightboxPlay.setAttribute('aria-label', isPlaying ? 'Pause video preview' : 'Play video preview');
}

function toggleVideoPlayback() {
  if (!lightboxVideo.src || lightboxMedia.classList.contains('media-unavailable')) return;
  if (lightboxVideo.paused) {
    lightboxVideo.play().catch(() => {
      videoStatus.textContent = 'Playback blocked';
      videoError.textContent = 'Playback was blocked by your browser. Tap play again to continue.';
      lightboxMedia.classList.add('media-unavailable');
    });
  } else {
    lightboxVideo.pause();
  }
}

function setBackgroundInert(isInert) {
  pageRegions.forEach(region => {
    if (!region) return;
    if (isInert) {
      region.setAttribute('inert', '');
      region.setAttribute('aria-hidden', 'true');
      return;
    }
    region.removeAttribute('inert');
    region.setAttribute('aria-hidden', region === mobileNav ? String(!document.body.classList.contains('menu-open')) : 'false');
  });
}

function openLightbox(project, trigger) {
  lastFocusedElement = trigger instanceof HTMLElement ? trigger : document.activeElement;
  modalFields.image.src = project.image;
  modalFields.image.alt = `${project.title} visual preview`;
  modalFields.title.textContent = project.title;
  modalFields.category.textContent = project.category;
  modalFields.description.textContent = project.description;
  modalFields.client.textContent = project.client;
  modalFields.duration.textContent = project.duration;
  lightboxMedia.classList.remove('media-unavailable');
  videoError.textContent = '';
  videoStatus.textContent = 'HD';
  videoProgress.style.width = '0%';
  lightboxVideo.pause();
  lightboxVideo.poster = project.image;
  lightboxVideo.src = project.video;
  lightboxVideo.load();
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setBackgroundInert(true);
  document.querySelector('.close-lightbox').focus();
}

function closeLightbox() {
  lightboxVideo.pause();
  lightboxVideo.removeAttribute('src');
  lightboxVideo.load();
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  setBackgroundInert(false);
  lastFocusedElement?.focus();
  lastFocusedElement = null;
}

gallery.addEventListener('click', event => {
  const card = event.target.closest('.project-card');
  if (card) openLightbox(projects[card.dataset.index], card);
});
gallery.addEventListener('keydown', event => {
  if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.project-card')) {
    event.preventDefault();
    openLightbox(projects[event.target.dataset.index], event.target);
  }
});
document.querySelectorAll('[data-close-lightbox]').forEach(element => element.addEventListener('click', closeLightbox));
lightboxPlay.addEventListener('click', toggleVideoPlayback);
lightboxVideo.addEventListener('play', updateVideoUi);
lightboxVideo.addEventListener('pause', updateVideoUi);
lightboxVideo.addEventListener('timeupdate', updateVideoUi);
lightboxVideo.addEventListener('ended', updateVideoUi);
lightboxVideo.addEventListener('loadedmetadata', updateVideoUi);
lightboxVideo.addEventListener('error', () => {
  lightboxMedia.classList.add('media-unavailable');
  videoStatus.textContent = 'Unavailable';
  videoError.textContent = 'Preview unavailable. Please try another project.';
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (lightbox.classList.contains('open')) closeLightbox();
    if (document.body.classList.contains('menu-open')) setMenuState(false);
    return;
  }
  if (event.key !== 'Tab' || !lightbox.classList.contains('open')) return;
  const focusable = [...lightbox.querySelectorAll('button:not([disabled]), [href], video[controls], [tabindex]:not([tabindex="-1"])')].filter(element => !element.closest('[aria-hidden="true"]'));
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const showreelFrame = document.getElementById('showreelFrame');
const showreelTitle = document.getElementById('showreelTitle');
let activeShowreel = {
  title: 'The Editkaro motion reel', category: 'Selected work / 2025', duration: '01:02', client: 'EDITKARO.IN',
  description: 'A rapid visual thesis on cinematic storytelling, made one unforgettable cut at a time.',
  image: document.getElementById('showreelImage').src, video: sampleVideos.sintel
};

document.querySelectorAll('.showreel-badges button').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  const updateShowreel = () => {
    document.getElementById('showreelImage').src = button.dataset.image;
    document.getElementById('showreelImage').alt = `${button.dataset.category} showreel preview`;
    const [firstLine, secondLine] = button.dataset.title.split(' in ');
    showreelTitle.replaceChildren(firstLine);
    if (secondLine) showreelTitle.append(' in', document.createElement('br'), secondLine);
    document.getElementById('showreelCategory').textContent = button.dataset.category;
    showreelFrame.dataset.theme = button.dataset.theme;
    activeShowreel = { ...activeShowreel, title: button.dataset.title, category: button.dataset.category, image: button.dataset.image, video: button.dataset.video };
    document.querySelectorAll('.showreel-badges button').forEach(chip => chip.setAttribute('aria-pressed', String(chip === button)));
  };
  button.addEventListener('mouseenter', updateShowreel);
  button.addEventListener('focus', updateShowreel);
  button.addEventListener('click', updateShowreel);
});
document.querySelectorAll('.open-showreel').forEach(button => button.addEventListener('click', event => openLightbox(activeShowreel, event.currentTarget)));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('visible');
  if (entry.target.id === 'processList') entry.target.classList.add('animated');
  observer.unobserve(entry.target);
}), { threshold: .12 });
document.querySelectorAll('.reveal, #processList').forEach(element => observer.observe(element));

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  const target = entry.target; const end = Number(target.dataset.count); const suffix = target.dataset.suffix;
  const startTime = performance.now(); const duration = 1300;
  const update = now => {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = end * (1 - Math.pow(1 - progress, 3));
    target.textContent = `${end % 1 ? current.toFixed(1) : Math.round(current)}${suffix}`;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update); counterObserver.unobserve(target);
}), { threshold: .7 });
counters.forEach(counter => counterObserver.observe(counter));

if (window.matchMedia('(pointer:fine)').matches) {
  const spotlight = document.querySelector('.spotlight');
  window.addEventListener('pointermove', event => { spotlight.style.left = `${event.clientX}px`; spotlight.style.top = `${event.clientY}px`; }, { passive: true });
  document.querySelectorAll('.magnetic').forEach(element => {
    element.addEventListener('pointermove', event => { const rect = element.getBoundingClientRect(); const x = event.clientX - rect.left - rect.width / 2; const y = event.clientY - rect.top - rect.height / 2; element.style.transform = `translate(${x * .12}px, ${y * .12}px)`; });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}
document.querySelectorAll('.ripple').forEach(button => button.addEventListener('pointermove', event => { const rect = button.getBoundingClientRect(); button.style.setProperty('--ripple-x', `${event.clientX - rect.left}px`); button.style.setProperty('--ripple-y', `${event.clientY - rect.top}px`); }));
