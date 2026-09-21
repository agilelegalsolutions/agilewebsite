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
    // 3. Smart Trademark Clearance & Advocate Lead Engine
    // ------------------------------------------------------------------------
    const tmClearanceForm = document.getElementById('tmClearanceForm');
    const brandSearchInput = document.getElementById('brandSearchInput');
    const brandClassSelect = document.getElementById('brandClassSelect');
    const leadNameInput = document.getElementById('leadNameInput');
    const leadPhoneInput = document.getElementById('leadPhoneInput');
    const tmClearanceSubmitBtn = document.getElementById('tmClearanceSubmitBtn');
    const clearanceFormError = document.getElementById('clearanceFormError');

    const clearanceResultContainer = document.getElementById('clearanceResultContainer');
    const resRefId = document.getElementById('resRefId');
    const resBrandName = document.getElementById('resBrandName');
    const resClassBadge = document.getElementById('resClassBadge');
    const resTimestamp = document.getElementById('resTimestamp');
    const resPhoneDisplay = document.getElementById('resPhoneDisplay');
    const resWhatsAppDirectBtn = document.getElementById('resWhatsAppDirectBtn');
    const resResetSearchBtn = document.getElementById('resResetSearchBtn');

    if (tmClearanceForm && brandSearchInput && leadNameInput && leadPhoneInput && tmClearanceSubmitBtn) {
        tmClearanceForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Clear any previous error
            if (clearanceFormError) {
                clearanceFormError.style.display = 'none';
                clearanceFormError.innerText = '';
            }

            const brandVal = brandSearchInput.value.trim();
            const classVal = brandClassSelect && brandClassSelect.value ? brandClassSelect.value : 'Class Consultation Requested';
            const nameVal = leadNameInput.value.trim();
            const rawPhone = leadPhoneInput.value.trim();
            const cleanPhone = rawPhone.replace(/\D/g, '');

            // Validation checks
            if (!brandVal || brandVal.length < 2) {
                showError('Please enter a valid brand or trademark name (at least 2 characters).', brandSearchInput);
                return;
            }

            if (!nameVal || nameVal.length < 2) {
                showError('Please enter your full name as the business or applicant owner.', leadNameInput);
                return;
            }

            // Indian phone validation (10 digits starting with 6, 7, 8, or 9)
            const phonePattern = /^[6-9]\d{9}$/;
            if (!phonePattern.test(cleanPhone)) {
                showError('Please enter a valid 10-digit Indian WhatsApp mobile number (e.g., 9811343159).', leadPhoneInput);
                return;
            }

            // Generate unique legal clearance reference ID
            const refId = 'ALS-TM-' + Math.floor(10000 + Math.random() * 90000);
            const now = new Date();
            const formattedTime = now.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            // UI loading state
            const originalBtnHtml = tmClearanceSubmitBtn.innerHTML;
            tmClearanceSubmitBtn.disabled = true;
            tmClearanceSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Initializing Official Clearance...';

            // Prepare Web3Forms FormData payload directly from the form
            const formData = new FormData(tmClearanceForm);
            formData.set("phone", `+91 ${cleanPhone}`);
            formData.append("reference_id", refId);
            formData.append("submission_time", formattedTime);
            formData.append("ip_india_quick_search", "https://ipindiaservices.gov.in/tmrpublicsearch/");
            formData.append("message", `Official Trademark Clearance Audit Request:\n` +
                                       `• Brand / Trade Name: "${brandVal}"\n` +
                                       `• Nice Classification: ${classVal}\n` +
                                       `• Legal Reference Code: ${refId}\n` +
                                       `• Applicant Name: ${nameVal}\n` +
                                       `• WhatsApp / Phone: +91 ${cleanPhone}\n` +
                                       `• Direct IP India Public Search: https://ipindiaservices.gov.in/tmrpublicsearch/`);

            // Dispatch lead payload using FormData
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            }).then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('✅ Web3Forms: Email dispatched successfully to your registered inbox!', data);
                } else {
                    console.warn('⚠️ Web3Forms response error:', data);
                }
            }).catch(err => {
                console.warn('⚠️ Web3Forms network error:', err);
            }).finally(() => {
                tmClearanceSubmitBtn.disabled = false;
                tmClearanceSubmitBtn.innerHTML = originalBtnHtml;

                // Populate Dynamic Clearance Card
                if (resRefId) resRefId.innerText = refId;
                if (resBrandName) resBrandName.innerText = `"${brandVal}"`;
                if (resClassBadge) resClassBadge.innerText = classVal;
                if (resTimestamp) resTimestamp.innerText = `Initiated: ${formattedTime}`;
                if (resPhoneDisplay) resPhoneDisplay.innerText = `+91 ${cleanPhone}`;

                // Construct direct WhatsApp deep link with pre-filled case details
                if (resWhatsAppDirectBtn) {
                    const waMessage = `Hello Advocate Arun Kumar Jha, I just initiated an official Trademark Clearance Audit for "${brandVal}" (${classVal}) with Reference: ${refId}. Please share the clearance conflict analysis and filing recommendation.`;
                    resWhatsAppDirectBtn.href = `https://wa.me/919811343159?text=${encodeURIComponent(waMessage)}`;
                }

                // Show clearance result card and scroll smoothly
                if (clearanceResultContainer) {
                    clearanceResultContainer.style.display = 'block';
                    clearanceResultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
        });

        function showError(msg, targetInput) {
            if (clearanceFormError) {
                clearanceFormError.style.display = 'block';
                clearanceFormError.innerHTML = `<i class="fas fa-exclamation-circle me-2"></i> ${msg}`;
            }
            if (targetInput) {
                targetInput.focus();
            }
        }
    }

    // Reset / Audit Another Brand button handler
    if (resResetSearchBtn && clearanceResultContainer && tmClearanceForm) {
        resResetSearchBtn.addEventListener('click', function () {
            clearanceResultContainer.style.display = 'none';
            tmClearanceForm.reset();
            if (brandSearchInput) {
                brandSearchInput.focus();
                brandSearchInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
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
