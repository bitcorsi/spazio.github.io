// Configurazione e dati mock
const CONFIG = {
    API_BASE_URL: 'https://api.spaziocorsi.com',
    CURRENCY: 'EUR',
    SITE_NAME: 'Spazio Corsi'
};

// Dati mock per i corsi
const MOCK_COURSES = [
    {
        id: 1,
        title: "Design UI/UX Moderno",
        instructor: "Marco Rossi",
        category: "design",
        description: "Impara a creare interfacce utente moderne e user-friendly con i principi del design contemporaneo.",
        price: 89.99,
        rating: 4.8,
        students: 1247,
        duration: "8 ore",
        image: "design-course.jpg",
        date: "15 Gen 2024",
        curriculum: [
            "Introduzione al Design UI/UX",
            "Principi fondamentali",
            "Strumenti moderni (Figma, Sketch)",
            "Prototipazione avanzata",
            "Test utente e iterazione"
        ],
        instructorProfile: {
            name: "Marco Rossi",
            bio: "Senior UI/UX Designer con 8+ anni di esperienza in startup e grandi aziende.",
            expertise: ["UI Design", "UX Research", "Prototipazione"],
            students: 15000
        },
        reviews: [
            {
                user: "Alice B.",
                rating: 5,
                comment: "Corso eccellente! Marco spiega in modo chiaro e pratico.",
                date: "2 settimane fa"
            },
            {
                user: "Luca M.",
                rating: 4,
                comment: "Molto utile, soprattutto la parte su Figma.",
                date: "1 mese fa"
            }
        ]
    },
    {
        id: 2,
        title: "Sviluppo Web Full Stack",
        instructor: "Anna Verdi",
        category: "tecnologia",
        description: "Diventa uno sviluppatore full stack imparando le tecnologie più richieste del mercato.",
        price: 129.99,
        rating: 4.9,
        students: 2156,
        duration: "12 settimane",
        image: "web-dev-course.jpg",
        date: "20 Gen 2024",
        curriculum: [
            "HTML5, CSS3, JavaScript moderno",
            "React e Node.js",
            "Database e API",
            "Deploy e DevOps",
            "Progetto finale"
        ],
        instructorProfile: {
            name: "Anna Verdi",
            bio: "Full Stack Developer e Tech Lead con esperienza in progetti scalabili.",
            expertise: ["JavaScript", "React", "Node.js", "Database"],
            students: 22000
        },
        reviews: [
            {
                user: "Giovanni R.",
                rating: 5,
                comment: "Anna è fantastica! Spiega concetti complessi in modo semplice.",
                date: "3 giorni fa"
            }
        ]
    },
    {
        id: 3,
        title: "Marketing Digitale Avanzato",
        instructor: "Laura Bianchi",
        category: "business",
        description: "Strategie avanzate di marketing digitale per far crescere il tuo business online.",
        price: 79.99,
        rating: 4.7,
        students: 1893,
        duration: "6 settimane",
        image: "marketing-course.jpg",
        date: "10 Feb 2024",
        curriculum: [
            "SEO avanzato",
            "Social Media Marketing",
            "Email Marketing",
            "Analytics e ROI",
            "Case studies"
        ],
        instructorProfile: {
            name: "Laura Bianchi",
            bio: "Digital Marketing Expert con focus su growth hacking e analytics.",
            expertise: ["SEO", "Social Media", "Growth Marketing"],
            students: 18000
        },
        reviews: []
    },
    {
        id: 4,
        title: "Fotografia Creativa",
        instructor: "Paolo Neri",
        category: "creativita",
        description: "Scopri le tecniche creative per trasformare le tue foto in opere d'arte.",
        price: 59.99,
        rating: 4.6,
        students: 956,
        duration: "4 settimane",
        image: "photography-course.jpg",
        date: "5 Mar 2024",
        curriculum: [
            "Composizione creativa",
            "Tecniche di illuminazione",
            "Post-produzione",
            "Stili fotografici",
            "Progetto personale"
        ],
        instructorProfile: {
            name: "Paolo Neri",
            bio: "Fotografo professionista con mostre internazionali e 15+ anni di esperienza.",
            expertise: ["Fotografia", "Post-produzione", "Composizione"],
            students: 8500
        },
        reviews: [
            {
                user: "Sofia L.",
                rating: 5,
                comment: "Paolo è un insegnante eccezionale! Ho migliorato tantissimo.",
                date: "1 settimana fa"
            }
        ]
    }
];

// Utility Functions
const utils = {
    formatPrice(price) {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: CONFIG.CURRENCY
        }).format(price);
    },

    formatRating(rating) {
        return `${rating}/5.0`;
    },

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        let stars = '';
        for (let i = 0; i < fullStars; i++) stars += '★';
        if (halfStar) stars += '½';
        for (let i = 0; i < emptyStars; i++) stars += '☆';
        
        return stars;
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return Object.fromEntries(params.entries());
    }
};

// Header Scroll Effect
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', utils.debounce(() => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 10));
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// Courses Page Functionality
function initCoursesPage() {
    const coursesContainer = document.getElementById('coursesContainer');
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (!coursesContainer) return;

    // Show loading skeleton
    function showSkeleton() {
        coursesContainer.innerHTML = `
            <div class="course-skeleton">
                <div class="skeleton-image"></div>
                <div class="skeleton-content">
                    <div class="skeleton-title"></div>
                    <div class="skeleton-text"></div>
                    <div class="skeleton-price"></div>
                </div>
            </div>
        `.repeat(4);
    }

    // Render courses
    function renderCourses(courses = MOCK_COURSES, filter = 'tutti') {
        const filteredCourses = filter === 'tutti' 
            ? courses 
            : courses.filter(course => course.category === filter);

        if (filteredCourses.length === 0) {
            coursesContainer.innerHTML = `
                <div class="no-courses">
                    <h3>Nessun corso trovato</h3>
                    <p>Prova a cambiare filtro o torna più tardi.</p>
                </div>
            `;
            return;
        }

        coursesContainer.innerHTML = filteredCourses.map(course => `
            <div class="course-card" data-course-id="${course.id}" data-category="${course.category}">
                <div class="course-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <div class="course-badge">${course.category}</div>
                </div>
                <div class="course-content">
                    <h3 class="course-title">${course.title}</h3>
                    <p class="course-instructor">Di ${course.instructor}</p>
                    <p class="course-description">${course.description}</p>
                    <div class="course-meta">
                        <div class="course-rating">
                            <div class="stars">${utils.generateStars(course.rating)}</div>
                            <span class="rating-text">${utils.formatRating(course.rating)}</span>
                        </div>
                        <div class="course-price">${utils.formatPrice(course.price)}</div>
                    </div>
                </div>
            </div>
        `).join('');

        // Add click events to course cards
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', () => {
                const courseId = card.dataset.courseId;
                window.location.href = `corso.html?id=${courseId}`;
            });
        });
    }

    // Initialize filters
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show loading state
            showSkeleton();

            // Simulate API call delay
            setTimeout(() => {
                renderCourses(MOCK_COURSES, btn.dataset.filter);
            }, 800);
        });
    });

    // Initial render
    showSkeleton();
    setTimeout(() => renderCourses(MOCK_COURSES), 1000);
}

// Course Detail Page
function initCourseDetail() {
    const params = utils.getUrlParams();
    const courseId = parseInt(params.id);

    if (!courseId) {
        window.location.href = 'corsi.html';
        return;
    }

    const course = MOCK_COURSES.find(c => c.id === courseId);
    if (!course) {
        window.location.href = 'corsi.html';
        return;
    }

    // Populate course data
    document.getElementById('courseTitle').textContent = course.title;
    document.getElementById('courseInstructor').textContent = `Di ${course.instructor}`;
    document.getElementById('courseDescription').textContent = course.description;
    document.getElementById('courseDuration').textContent = course.duration;
    document.getElementById('courseStudents').textContent = `${course.students} studenti`;
    document.getElementById('courseDate').textContent = `Inizia il ${course.date}`;
    document.getElementById('coursePrice').textContent = utils.formatPrice(course.price);
    document.getElementById('courseCategory').textContent = course.category;
    
    // Rating stars
    document.getElementById('courseStars').innerHTML = utils.generateStars(course.rating);
    document.getElementById('courseRating').textContent = utils.formatRating(course.rating);

    // Curriculum
    const curriculumHtml = course.curriculum.map((item, index) => `
        <div class="curriculum-item">
            <div class="lesson-number">${index + 1}</div>
            <div class="lesson-title">${item}</div>
        </div>
    `).join('');
    document.getElementById('courseCurriculum').innerHTML = curriculumHtml;

    // Instructor profile
    document.getElementById('instructorProfile').innerHTML = `
        <div class="instructor-card">
            <h3>${course.instructorProfile.name}</h3>
            <p>${course.instructorProfile.bio}</p>
            <div class="instructor-stats">
                <div class="stat">
                    <strong>${course.instructorProfile.students.toLocaleString()}</strong>
                    <span>Studenti</span>
                </div>
            </div>
            <div class="expertise">
                <strong>Competenze:</strong>
                ${course.instructorProfile.expertise.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    `;

    // Reviews
    const reviewsHtml = course.reviews.length > 0 
        ? course.reviews.map(review => `
            <div class="review-card">
                <div class="review-header">
                    <strong>${review.user}</strong>
                    <div class="review-rating">${utils.generateStars(review.rating)}</div>
                </div>
                <p class="review-comment">${review.comment}</p>
                <span class="review-date">${review.date}</span>
            </div>
        `).join('')
        : '<p>Ancora nessuna recensione per questo corso.</p>';
    
    document.getElementById('courseReviews').innerHTML = reviewsHtml;

    // Tab functionality
    initTabs();

    // Enroll button
    document.querySelector('.btn-enroll').addEventListener('click', () => {
        alert(`Iscrizione al corso "${course.title}" effettuata con successo!`);
    });
}

// Tab System
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Course Proposal Form
function initProposalForm() {
    const form = document.getElementById('courseProposalForm');
    const steps = document.querySelectorAll('.form-step');
    const progressFill = document.getElementById('progressFill');
    const progressSteps = document.querySelectorAll('.progress-step');

    if (!form) return;

    let currentStep = 0;

    // Character counters
    const titleInput = document.getElementById('courseTitle');
    const descInput = document.getElementById('courseDescription');

    if (titleInput) {
        titleInput.addEventListener('input', (e) => {
            const counter = e.target.parentElement.querySelector('.char-counter');
            counter.textContent = `${e.target.value.length}/60`;
        });
    }

    if (descInput) {
        descInput.addEventListener('input', (e) => {
            const counter = e.target.parentElement.querySelector('.char-counter');
            counter.textContent = `${e.target.value.length}/500`;
        });
    }

    // Navigation between steps
    form.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-next')) {
            if (validateStep(currentStep)) {
                goToStep(currentStep + 1);
            }
        } else if (e.target.classList.contains('btn-prev')) {
            goToStep(currentStep - 1);
        }
    });

    function goToStep(step) {
        steps[currentStep].classList.remove('active');
        progressSteps[currentStep].classList.remove('active');

        currentStep = step;

        steps[currentStep].classList.add('active');
        progressSteps[currentStep].classList.add('active');

        // Update progress bar
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    function validateStep(step) {
        const currentStepEl = steps[step];
        const inputs = currentStepEl.querySelectorAll('input[required], select[required], textarea[required]');
        
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Per favore, compila tutti i campi obbligatori.');
        }

        return isValid;
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateStep(currentStep)) {
            // Simulate form submission
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            console.log('Course proposal submitted:', data);

            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message show';
            successMessage.innerHTML = `
                <h3>✅ Proposta Inviata!</h3>
                <p>Grazie per la tua proposta. La esamineremo e ti contatteremo presto.</p>
            `;

            form.parentNode.insertBefore(successMessage, form);
            form.style.display = 'none';

            // Reset form after 5 seconds
            setTimeout(() => {
                form.reset();
                form.style.display = 'block';
                successMessage.remove();
                goToStep(0);
            }, 5000);
        }
    });
}

// Page-specific initialization
function initPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();

    // Common functionality
    initHeaderScroll();
    initMobileMenu();

    // Page-specific functionality
    switch(page) {
        case 'index.html':
        case '':
            // Homepage specific code
            break;
        case 'corsi.html':
            initCoursesPage();
            break;
        case 'corso.html':
            initCourseDetail();
            break;
        case 'proponi.html':
            initProposalForm();
            break;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Add some CSS for dynamic elements
const dynamicStyles = `
.curriculum-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
}

.lesson-number {
    width: 2rem;
    height: 2rem;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 1rem;
}

.instructor-card {
    background: var(--bg-secondary);
    padding: 2rem;
    border-radius: var(--radius);
}

.instructor-stats {
    display: flex;
    gap: 2rem;
    margin: 1rem 0;
}

.stat {
    text-align: center;
}

.stat strong {
    display: block;
    font-size: 1.5rem;
    color: var(--primary-color);
}

.expertise {
    margin-top: 1rem;
}

.skill-tag {
    display: inline-block;
    background: var(--primary-color);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.875rem;
    margin: 0.25rem;
}

.review-card {
    background: white;
    padding: 1.5rem;
    border-radius: var(--radius);
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
}

.review-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.review-date {
    color: var(--text-secondary);
    font-size: 0.875rem;
}

.no-courses {
    text-align: center;
    padding: 3rem;
    grid-column: 1 / -1;
}

.menu-toggle.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.menu-toggle.active span:nth-child(2) {
    opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);