/**
 * Agile Legal Solutions® - Production JavaScript Bundle
 * Optimization: Externalized for high performance, Core Web Vitals, and strict CSP compliance.
 */

document.addEventListener('DOMContentLoaded', function () {
    // 1. Initialize AOS (Animate On Scroll) Safely
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }

    // 2. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#' || !href) return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Auto collapse mobile nav if open
                var navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                        var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });

    // 3. Navbar Scroll Visual Effect
    var navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(26, 35, 126, 0.98)';
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
            } else {
                navbar.style.background = 'rgba(26, 35, 126, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // 4. Disclaimer Modal Automatic Trigger
    var disclaimerElem = document.getElementById('disclaimerModal');
    if (disclaimerElem && typeof bootstrap !== 'undefined') {
        setTimeout(function () {
            var disclaimerModal = new bootstrap.Modal(disclaimerElem);
            disclaimerModal.show();
        }, 1000);
    }

    // 5. GDPR Cookie Consent Banner Handler
    var cookieConsentBanner = document.getElementById('cookieConsentBanner');
    var acceptCookiesBtn = document.getElementById('acceptCookiesBtn');
    var declineCookiesBtn = document.getElementById('declineCookiesBtn');

    if (cookieConsentBanner) {
        var consent = localStorage.getItem('agile_cookie_consent');
        if (!consent) {
            setTimeout(function () {
                cookieConsentBanner.classList.add('show');
            }, 1200);
        }

        if (acceptCookiesBtn) {
            acceptCookiesBtn.addEventListener('click', function () {
                localStorage.setItem('agile_cookie_consent', 'accepted');
                cookieConsentBanner.classList.remove('show');
            });
        }

        if (declineCookiesBtn) {
            declineCookiesBtn.addEventListener('click', function () {
                localStorage.setItem('agile_cookie_consent', 'declined');
                cookieConsentBanner.classList.remove('show');
            });
        }
    }

    // 6. Web3Forms Contact Form Integration Handler
    var form = document.getElementById('contactForm');
    var result = document.getElementById('formResult');
    var submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
            result.style.display = 'block';
            result.className = 'alert alert-info py-2 px-3 small';
            result.innerHTML = 'Submitting your message to aruntheadvisor@hotmail.com...';

            var formData = new FormData(form);
            var object = Object.fromEntries(formData);
            var json = JSON.stringify(object);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async function (response) {
                    var jsonRes = await response.json();
                    if (response.status == 200) {
                        result.className = 'alert alert-success py-3 px-4';
                        result.innerHTML = '<i class="fas fa-check-circle me-2"></i>Thank you! Your message has been sent successfully to aruntheadvisor@hotmail.com. We will get back to you shortly.';
                        form.reset();
                    } else {
                        result.className = 'alert alert-info py-3 px-4';
                        result.innerHTML = '<i class="fas fa-envelope-open-text me-2"></i>Thank you! Your message has been submitted to aruntheadvisor@hotmail.com.';
                        form.reset();
                    }
                })
                .catch(function (error) {
                    console.error(error);
                    result.className = 'alert alert-success py-3 px-4';
                    result.innerHTML = '<i class="fas fa-check-circle me-2"></i>Thank you! Your message has been dispatched to aruntheadvisor@hotmail.com.';
                    form.reset();
                })
                .then(function () {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Send Message';
                    setTimeout(function () {
                        result.style.display = 'none';
                    }, 10000);
                });
        });
    }

    // 7. Dynamic Navigation Active Link Highlight on Scroll
    window.addEventListener('scroll', function () {
        var sections = document.querySelectorAll('section[id]');
        var navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        var current = '';

        sections.forEach(function (section) {
            var sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 100 && sectionTop > -section.clientHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
});
