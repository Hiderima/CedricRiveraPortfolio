// Initialize AOS
AOS.init({
    once: true,
    duration: 1000,
    disable: 'mobile'
});

// Initialize Swiper for Affiliations
const swiper = new Swiper('.swiper', {
    slidesPerView: 3,
    spaceBetween: 30,
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    breakpoints: {
        320: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
    }
});

// Navigation active link on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (pageYOffset >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Smooth scroll for nav links
navLinks.forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Download CV button
function downloadCV() {
    const link = document.createElement('a');
    link.href = 'RIVERA-Cedric-Elecho_CurriculumVitae.pdf';
    link.download = 'RIVERA-Cedric-Elecho_CurriculumVitae.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Scroll to contact section
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Copied: " + text);
    });
}

// --- PHOTO COLLAGE AUTO-ROTATION ---
const images = [
    'Rivera_barong.jpg',
    'Rivera_creative.jpg',
    'Rivera_formal.jpg',
    'Rivera_unif.jpg',
    'Rivera_WithLaptop.png'
];
let currentIndex = 4; // Start with Laptop image (index 4)

function updateGallery(index) {
    const mainImg = document.getElementById('mainImage');
    const thumbs = document.querySelectorAll('.collage-thumb');
    
    // Update main image source
    mainImg.style.opacity = '0'; // Fade out
    setTimeout(() => {
        mainImg.src = images[index];
        mainImg.style.opacity = '1'; // Fade in
    }, 200);

    // Update active thumb styling
    thumbs.forEach(t => t.classList.remove('active-thumb'));
    thumbs[index].classList.add('active-thumb');
}

function autoRotate() {
    currentIndex = (currentIndex + 1) % images.length;
    updateGallery(currentIndex);
}

// Manual select function for thumbnails
function manualSelect(index) {
    currentIndex = index;
    updateGallery(currentIndex);
    // Reset timer on manual click to avoid immediate jump
    clearInterval(rotationInterval);
    rotationInterval = setInterval(autoRotate, 3000);
}

// Start rotation
let rotationInterval = setInterval(autoRotate, 3000);


// --- MODAL LOGIC ---

// Text Modal
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalClose = document.querySelector('.close');

function openModal(content) {
    let title = "Detail";
    let desc = content;
    
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    modal.style.display = 'flex';
}

modalClose.addEventListener('click', () => { modal.style.display = 'none'; });

// Image Modal (For Certifications)
const imageModal = document.getElementById('imageModal');
const modalImg = document.getElementById('modalImg');
const modalImgDesc = document.getElementById('modalImgDesc');
const imageModalClose = document.querySelector('.close-image');

function openModalImage(imageSrc, description) {
    modalImg.src = imageSrc;
    modalImgDesc.textContent = description;
    imageModal.style.display = 'flex';
}

imageModalClose.addEventListener('click', () => { imageModal.style.display = 'none'; });

// Close modals when clicking outside
window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
    if (e.target === imageModal) imageModal.style.display = 'none';
});

// --- SEARCH WITH SUGGESTIONS & FILTERING ---

const filterButtons = document.querySelectorAll('.filter-btn');
const trainingItems = document.querySelectorAll('.training-item');
const searchInput = document.getElementById('certSearch');
const suggestionsList = document.getElementById('suggestionsList');

function filterItems() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const category = activeBtn.getAttribute('data-filter');
    const searchTerm = searchInput.value.toLowerCase();

    trainingItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const title = item.querySelector('h4').textContent.toLowerCase();
        const subtitle = item.querySelector('p').textContent.toLowerCase();
        const year = item.querySelector('.cert-year') ? item.querySelector('.cert-year').textContent : '';

        const matchesCategory = (category === 'all' || itemCategory === category);
        const matchesSearch = (title.includes(searchTerm) || subtitle.includes(searchTerm) || year.includes(searchTerm));

        if (matchesCategory && matchesSearch) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

// Search Suggestions Logic
if(searchInput) {
    searchInput.addEventListener('input', () => {
        const input = searchInput.value.toLowerCase();
        suggestionsList.innerHTML = '';
        
        if (input.length > 0) {
            const matches = [];
            trainingItems.forEach(item => {
                const title = item.querySelector('h4').textContent;
                // Avoid duplicates in suggestion list
                if (title.toLowerCase().includes(input) && !matches.includes(title)) {
                    matches.push(title);
                }
            });

            if (matches.length > 0) {
                suggestionsList.classList.add('show');
                matches.forEach(match => {
                    const li = document.createElement('li');
                    li.textContent = match;
                    li.addEventListener('click', () => {
                        searchInput.value = match;
                        suggestionsList.classList.remove('show');
                        filterItems();
                    });
                    suggestionsList.appendChild(li);
                });
            } else {
                suggestionsList.classList.remove('show');
            }
        } else {
            suggestionsList.classList.remove('show');
        }
        
        filterItems(); // Filter as you type as well
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
            suggestionsList.classList.remove('show');
        }
    });
}

// Filter Buttons Click
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterItems();
    });
});