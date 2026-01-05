// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Contact form submission handler with custom validation
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    // Create validation messages for each field
    const fields = Array.from(contactForm.querySelectorAll('input[required], textarea[required], select[required]'));
    let currentErrorField = null;
    
    fields.forEach(field => {
        // Create validation message element
        const message = document.createElement('div');
        message.className = 'validation-message';
        message.id = field.id + '-error';
        field.parentNode.appendChild(message);
        
        // Set custom validation messages
        field.addEventListener('invalid', function(e) {
            e.preventDefault();
        });
        
        // Clear error on input when field becomes valid (but don't show new errors until submit)
        field.addEventListener('input', function() {
            if (field === currentErrorField) {
                // Check if field is now valid
                let isValid = false;
                if (field.type === 'email') {
                    const emailValue = field.value.trim();
                    isValid = emailValue !== '' && emailValue.includes('@') && field.checkValidity();
                } else if (field.tagName === 'TEXTAREA' || (field.tagName === 'INPUT' && field.type !== 'email')) {
                    isValid = field.value.trim() !== '';
                } else if (field.tagName === 'SELECT') {
                    isValid = field.value !== '';
                }
                
                if (isValid) {
                    clearValidationError(field);
                    currentErrorField = null;
                }
            }
        });
    });
    
    function showValidationError(field) {
        // Clear any existing error
        if (currentErrorField && currentErrorField !== field) {
            clearValidationError(currentErrorField);
        }
        
        const messageEl = document.getElementById(field.id + '-error');
        if (messageEl) {
            // Use different message for email fields
            if (field.type === 'email') {
                messageEl.textContent = 'Please enter a valid email address.';
            } else {
                messageEl.textContent = 'Please fill out this field.';
            }
            messageEl.classList.add('show');
            currentErrorField = field;
        }
    }
    
    function clearValidationError(field) {
        const messageEl = document.getElementById(field.id + '-error');
        if (messageEl) {
            messageEl.classList.remove('show');
        }
        if (field === currentErrorField) {
            currentErrorField = null;
        }
    }
    
    function checkNextInvalidField() {
        // Find the first invalid field
        const firstInvalid = fields.find(field => !field.validity.valid);
        if (firstInvalid) {
            showValidationError(firstInvalid);
            firstInvalid.focus();
        }
    }
    
    function getFirstInvalidField() {
        return fields.find(field => !field.validity.valid);
    }
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear any existing error
        if (currentErrorField) {
            clearValidationError(currentErrorField);
            currentErrorField = null;
        }
        
        // Manually check validity of all required fields in order
        let firstInvalid = null;
        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            // Check if field is empty (for required fields)
            if (field.hasAttribute('required')) {
                let isValid = false;
                
                if (field.type === 'email') {
                    // For email, check if it's not empty, contains "@", and valid format
                    const emailValue = field.value.trim();
                    isValid = emailValue !== '' && emailValue.includes('@') && field.checkValidity();
                } else if (field.tagName === 'TEXTAREA' || (field.tagName === 'INPUT' && field.type !== 'email')) {
                    // For text inputs and textareas, check if not empty
                    isValid = field.value.trim() !== '';
                } else if (field.tagName === 'SELECT') {
                    // For selects, check if option selected
                    isValid = field.value !== '';
                }
                
                if (!isValid) {
                    firstInvalid = field;
                    break;
                }
            }
        }
        
        if (firstInvalid) {
            // Show error only on the first invalid field
            showValidationError(firstInvalid);
            firstInvalid.focus();
            return;
        }
        
        // Get form data
        const formData = new FormData(this);
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = 'Sending...';
        
        // Add hidden field to send to hello@wombatlabs.ai
        formData.append('_to', 'hello@wombatlabs.ai');
        formData.append('_subject', 'New Project Inquiry from ' + (formData.get('company') || formData.get('name') || 'Contact Form'));
        
        // Send form data using fetch
        fetch('https://formspree.io/f/xlgeyqey', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Success
                submitButton.innerHTML = 'Message Sent!';
                submitButton.style.backgroundColor = '#10b981'; // Green color
                contactForm.reset();
                
                // Clear all validation errors
                if (currentErrorField) {
                    clearValidationError(currentErrorField);
                }
                currentErrorField = null;
                
                // Show success message
                const successMsg = document.createElement('p');
                successMsg.className = 'mt-8 text-sm text-primary text-center';
                successMsg.style.marginTop = '2rem';
                successMsg.textContent = 'Thanks! We\'ll get back to you shortly.';
                contactForm.appendChild(successMsg);
                
                // Reset button after 5 seconds
                setTimeout(function() {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                    submitButton.style.backgroundColor = '';
                    if (successMsg.parentNode) {
                        successMsg.parentNode.removeChild(successMsg);
                    }
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            
            // Fallback to mailto if Formspree fails
            const data = Object.fromEntries(formData);
            const subject = encodeURIComponent('New Project Inquiry from ' + (data.company || data.name));
            let body = encodeURIComponent('New Project Inquiry\n\n');
            body += encodeURIComponent('Name: ' + (data.name || 'N/A') + '\n');
            body += encodeURIComponent('Email: ' + (data.email || 'N/A') + '\n');
            body += encodeURIComponent('Company: ' + (data.company || 'N/A') + '\n');
            body += encodeURIComponent('Website: ' + (data.website || 'N/A') + '\n');
            body += encodeURIComponent('Budget Range: ' + (data.budget || 'N/A') + '\n');
            body += encodeURIComponent('Timeline: ' + (data.timeline || 'N/A') + '\n');
            body += encodeURIComponent('Project Description: ' + (data.project || 'N/A') + '\n');
            
            window.location.href = 'mailto:hello@wombatlabs.ai?subject=' + subject + '&body=' + body;
            
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        });
    });
}

// Mobile menu toggle (if needed in future)
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        // Mobile menu functionality can be added here
        console.log('Mobile menu clicked');
    });
}

// Add intersection observer for fade-in animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements with fade-in classes
document.querySelectorAll('.animate-fade-in-up').forEach(el => {
    observer.observe(el);
});

// Add hover effect to logo
const logo = document.querySelector('nav a.group');
if (logo) {
    logo.addEventListener('mouseenter', function() {
        this.querySelector('.group-hover\\:glow-primary-sm')?.classList.add('glow-primary-sm');
    });
    logo.addEventListener('mouseleave', function() {
        this.querySelector('.group-hover\\:glow-primary-sm')?.classList.remove('glow-primary-sm');
    });
}

// Button click handlers
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function(e) {
        // Add ripple effect or other interactions
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s linear';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.marginLeft = '-10px';
        ripple.style.marginTop = '-10px';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Bio expand/collapse functionality for mobile
function toggleBio(button) {
    const bioContent = button.previousElementSibling;
    if (bioContent && bioContent.classList.contains('bio-content')) {
        const expandableContent = bioContent.querySelector('.bio-expandable');
        const toggleText = button.querySelector('.bio-toggle-text');
        if (expandableContent && toggleText) {
            // Check if content is currently visible (default state on mobile is visible)
            const isExpanded = expandableContent.style.display !== 'none' && 
                              (expandableContent.style.display === '' || expandableContent.style.display === 'block');
            if (isExpanded) {
                expandableContent.style.display = 'none';
                toggleText.textContent = 'more';
                button.classList.remove('expanded');
            } else {
                expandableContent.style.display = 'block';
                toggleText.textContent = 'less';
                button.classList.add('expanded');
            }
        }
    }
}

// Enhanced hover effects for elements with Tailwind-style class names
document.addEventListener('DOMContentLoaded', function() {
    // Handle hover:border-primary/30
    document.querySelectorAll('[class*="hover:border-primary/30"]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.borderColor = 'hsl(var(--primary) / 0.3)';
        });
        el.addEventListener('mouseleave', function() {
            this.style.borderColor = '';
        });
    });
    
    // Handle hover:bg-secondary/50
    document.querySelectorAll('[class*="hover:bg-secondary/50"]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'hsl(var(--secondary) / 0.5)';
        });
        el.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    // Handle hover:border-primary/50
    document.querySelectorAll('[class*="hover:border-primary/50"]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.borderColor = 'hsl(var(--primary) / 0.5)';
        });
        el.addEventListener('mouseleave', function() {
            this.style.borderColor = '';
        });
    });
    
    // Handle hover:text-foreground
    document.querySelectorAll('[class*="hover:text-foreground"]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.color = 'hsl(var(--foreground))';
        });
        el.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    });
    
    // Handle hover:bg-secondary/80
    document.querySelectorAll('[class*="hover:bg-secondary/80"]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'hsl(var(--secondary) / 0.8)';
        });
        el.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
    
    // Handle hover:glow-primary-sm
    document.querySelectorAll('[class*="hover:glow-primary-sm"]').forEach(el => {
        el.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px -5px hsl(var(--primary) / 0.4)';
        });
        el.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Handle group-hover effects
    document.querySelectorAll('.group').forEach(group => {
        // group-hover:bg-primary/20
        group.querySelectorAll('[class*="group-hover:bg-primary/20"]').forEach(el => {
            group.addEventListener('mouseenter', function() {
                el.style.backgroundColor = 'hsl(var(--primary) / 0.2)';
            });
            group.addEventListener('mouseleave', function() {
                el.style.backgroundColor = '';
            });
        });
        
        // group-hover:text-primary/40
        group.querySelectorAll('[class*="group-hover:text-primary/40"]').forEach(el => {
            group.addEventListener('mouseenter', function() {
                el.style.color = 'hsl(var(--primary) / 0.4)';
            });
            group.addEventListener('mouseleave', function() {
                el.style.color = '';
            });
        });
        
        // group-hover:scale-110
        group.querySelectorAll('[class*="group-hover:scale-110"]').forEach(el => {
            group.addEventListener('mouseenter', function() {
                el.style.transform = 'scale(1.1)';
            });
            group.addEventListener('mouseleave', function() {
                el.style.transform = '';
            });
        });
        
        // group-hover:glow-primary-sm
        group.querySelectorAll('[class*="group-hover:glow-primary-sm"]').forEach(el => {
            group.addEventListener('mouseenter', function() {
                el.style.boxShadow = '0 0 20px -5px hsl(var(--primary) / 0.4)';
            });
            group.addEventListener('mouseleave', function() {
                el.style.boxShadow = '';
            });
        });
    });
});

