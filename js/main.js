// DOM Elements
const navbar = document.getElementById('navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const backToTopBtn = document.getElementById('back-to-top');
const currentYear = document.getElementById('current-year');
const sections = document.querySelectorAll('section');
const navLinksList = document.querySelectorAll('.nav-links a');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Set current year in footer
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Disable the submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        
        // Clear any previous status messages
        formStatus.innerHTML = '';
        formStatus.classList.remove('show');
        formStatus.style.display = 'none';
        
        // Submit the form
        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                formStatus.innerHTML = `
                    <div class="form-status-content">
                        <div class="form-success">
                            <i class="fas fa-check-circle"></i>
                            <div>
                                <h4>Message Sent Successfully!</h4>
                                <p>Thank you for reaching out. I'll get back to you as soon as possible.</p>
                            </div>
                        </div>
                    </div>
                `;
                formStatus.classList.add('show');
                formStatus.style.display = 'block';
                contactForm.reset();
                
                // Auto close after 3 seconds
                setTimeout(() => {
                    formStatus.classList.remove('show');
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 300); // Match this with CSS transition duration
                }, 3000);
            } else {
                return response.json().then(err => {
                    throw new Error(err.error || 'There was a problem sending your message.');
                });
            }
        })
        .catch(error => {
            formStatus.innerHTML = `
                <div class="form-status-content">
                    <div class="form-error">
                        <i class="fas fa-exclamation-circle"></i>
                        <div>
                            <h4>Error Sending Message</h4>
                            <p>${error.message || 'There was a problem sending your message. Please try again.'}</p>
                        </div>
                    </div>
                </div>
            `;
            formStatus.classList.add('show');
            formStatus.style.display = 'block';
            
            // Auto close after 3 seconds
            setTimeout(() => {
                formStatus.classList.remove('show');
                setTimeout(() => {
                    formStatus.style.display = 'none';
                }, 300); // Match this with CSS transition duration
            }, 3000);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            
            // Scroll to show the status message
            formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    });
}

// Mobile menu toggle
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
}

// Close mobile menu when clicking on a nav link
navLinksList.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (currentScroll > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
    
    lastScroll = currentScroll;
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for fixed header
                behavior: 'smooth'
            });
        }
    });
});

// Back to top button
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Active section highlighting
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

// Observe all sections
sections.forEach(section => {
    observer.observe(section);
});

// Form submission is now handled at the top of the file

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.fade-in-up');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial check for elements in viewport
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);

// Add animation class to elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .about-content > div, .contact-info, .contact-form');
    
    animatedElements.forEach((element, index) => {
        element.classList.add('fade-in-up');
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
    });
});

// Add hover effect to project cards
document.querySelectorAll('.project-card').forEach(card => {
    const image = card.querySelector('.project-image');
    const content = card.querySelector('.project-info');
    
    card.addEventListener('mouseenter', () => {
        image.style.transform = 'translateY(0)';
        content.style.transform = 'translateY(0)';
    });
    
    card.addEventListener('mouseleave', () => {
        image.style.transform = '';
        content.style.transform = '';
    });
});
