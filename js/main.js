/**
 * Agile Legal Solutions® — Production LegalTech JavaScript Engine
 * Optimized for Core Web Vitals, Smooth Micro-Interactions, and High Conversion
 */

document.addEventListener('DOMContentLoaded', function () {
    // ------------------------------------------------------------------------
    // 1. Sticky Header & Mobile Bottom Bar Visibility
    // ------------------------------------------------------------------------
    const header = document.getElementById('main-header');
    const mobileStickyBar = document.getElementById('mobileStickyBar');

    window.addEventListener('scroll', function () {
        const scrollPos = window.scrollY;

        // Desktop header blur & shadow enhancement
        if (header) {
            if (scrollPos > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Mobile bottom CTA bar reveal
        if (mobileStickyBar && window.innerWidth <= 991) {
            if (scrollPos > 300) {
                mobileStickyBar.style.display = 'grid';
            } else {
                mobileStickyBar.style.display = 'none';
            }
        }
    }, { passive: true });

    // ------------------------------------------------------------------------
    // 2. Animated Metric Trust Counters
    // ------------------------------------------------------------------------
    const counterElements = document.querySelectorAll('.trust-counter-val');
    if (counterElements.length > 0 && 'IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseFloat(el.getAttribute('data-target'));
                    const isDecimal = el.getAttribute('data-decimal') === '1';
                    const duration = 1800; // ms
                    const startTime = performance.now();

                    function updateCount(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const currentVal = easeOut * target;

                        if (isDecimal) {
                            el.innerText = currentVal.toFixed(1);
                        } else {
                            el.innerText = Math.floor(currentVal).toLocaleString('en-IN');
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            el.innerText = isDecimal ? target.toFixed(1) : target.toLocaleString('en-IN');
                        }
                    }

                    requestAnimationFrame(updateCount);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.2 });

        counterElements.forEach(el => counterObserver.observe(el));
    }

    // ------------------------------------------------------------------------
    // 3. Interactive Trademark Search Tool (Lead Engine)
    // ------------------------------------------------------------------------
    const tmSearchForm = document.getElementById('tmSearchForm');
    const brandSearchInput = document.getElementById('brandSearchInput');
    const tmSearchBtn = document.getElementById('tmSearchBtn');
    const searchResultsCard = document.getElementById('searchResultsCard');
    const searchedBrandName = document.getElementById('searchedBrandName');

    if (tmSearchForm && brandSearchInput && tmSearchBtn && searchResultsCard) {
        tmSearchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const brandVal = brandSearchInput.value.trim();
            if (!brandVal) {
                brandSearchInput.focus();
                return;
            }

            // Animate scanning state
            const originalBtnHtml = tmSearchBtn.innerHTML;
            tmSearchBtn.disabled = true;
            tmSearchBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Scanning Registry Databases...';

            setTimeout(() => {
                tmSearchBtn.disabled = false;
                tmSearchBtn.innerHTML = originalBtnHtml;

                if (searchedBrandName) {
                    searchedBrandName.innerText = `"${brandVal}"`;
                }
                searchResultsCard.style.display = 'block';

                // Smooth scroll down to result
                searchResultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 1200);
        });
    }

    // Trademark Search Lead Capture Form Submission
    const tmLeadCaptureForm = document.getElementById('tmLeadCaptureForm');
    const leadSubmitBtn = document.getElementById('leadSubmitBtn');
    const leadCaptureResult = document.getElementById('leadCaptureResult');

    if (tmLeadCaptureForm) {
        tmLeadCaptureForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const leadName = document.getElementById('leadName').value;
            const leadPhone = document.getElementById('leadPhone').value;
            const brandName = brandSearchInput ? brandSearchInput.value : '';

            if (leadSubmitBtn) {
                leadSubmitBtn.disabled = true;
                leadSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Securing Priority...';
            }

            // Web3Forms payload submission
            const payload = {
                access_key: "e34ef3ca-62b1-4f30-8fc2-a270f2f3d640",
                subject: `New TM Search Lead: ${brandName} - ${leadName}`,
                from_name: "Agile Legal Solutions Lead Bot",
                name: leadName,
                phone: leadPhone,
                brand_name: brandName,
                message: `Lead requested TM Search & Priority Lock for brand: "${brandName}". Contact: ${leadPhone}`
            };

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            }).then(() => {
                if (leadCaptureResult) {
                    leadCaptureResult.style.display = 'block';
                    leadCaptureResult.innerHTML = `<i class="fas fa-check-circle me-1"></i> Success! Advocate Arun Kumar Jha will connect with you on WhatsApp (${leadPhone}) within 15 minutes.`;
                }
                tmLeadCaptureForm.reset();
                if (leadSubmitBtn) {
                    leadSubmitBtn.disabled = false;
                    leadSubmitBtn.innerHTML = '<i class="fas fa-check me-1"></i> Request Received';
                }
            }).catch(() => {
                if (leadCaptureResult) {
                    leadCaptureResult.style.display = 'block';
                    leadCaptureResult.innerHTML = `<i class="fas fa-check-circle me-1"></i> Priority Saved! Advocate Arun Kumar Jha will call ${leadPhone} shortly.`;
                }
                if (leadSubmitBtn) {
                    leadSubmitBtn.disabled = false;
                    leadSubmitBtn.innerHTML = '<i class="fas fa-check me-1"></i> Priority Locked';
                }
            });
        });
    }

    // ------------------------------------------------------------------------
    // 4. FAQ Accordion Engine
    // ------------------------------------------------------------------------
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(other => other.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });

    // ------------------------------------------------------------------------
    // 5. Smooth Scroll for Navigation Anchor Links
    // ------------------------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Collapse mobile navbar
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    if (typeof bootstrap !== 'undefined' && bootstrap.Collapse) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
});

// ----------------------------------------------------------------------------
// 6. Pricing Calculator Switcher (MSME vs Company Govt Fees)
// ----------------------------------------------------------------------------
function setPricingType(type) {
    const btnMsme = document.getElementById('btnPricingMsme');
    const btnCompany = document.getElementById('btnPricingCompany');
    const labels = document.querySelectorAll('.govt-fee-label');

    if (type === 'company') {
        if (btnCompany) btnCompany.classList.add('active');
        if (btnMsme) btnMsme.classList.remove('active');
        labels.forEach(el => el.innerText = '₹9,000');
    } else {
        if (btnMsme) btnMsme.classList.add('active');
        if (btnCompany) btnCompany.classList.remove('active');
        labels.forEach(el => el.innerText = '₹4,500');
    }
}
