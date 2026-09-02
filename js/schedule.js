// js/schedule.js

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('schedule-form');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    const progressBar = document.getElementById('progress-bar');
    const dateInput = document.getElementById('pickupDate');
    
    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    dateInput.value = today;

    let currentStep = 0;

    // Check if user is logged in
    const authStatus = sessionStorage.getItem('kb_auth');
    if(authStatus === 'true') {
        const user = JSON.parse(sessionStorage.getItem('kb_user'));
        if(user) {
            document.getElementById('fullName').value = user.name || '';
            document.getElementById('phone').value = user.phone || '';
            document.getElementById('email').value = user.email || '';
            document.getElementById('dashboard-btn').style.display = 'inline-block';
        }
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateFormSteps();
                if(currentStep === 2) {
                    populateSummary();
                }
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            updateFormSteps();
        });
    });

    function updateFormSteps() {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        progressSteps.forEach((step, index) => {
            if(index <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        const progressPercentage = (currentStep / (steps.length - 1)) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }

    function validateStep(stepIndex) {
        const inputs = steps[stepIndex].querySelectorAll('input[required], select[required]');
        let valid = true;
        inputs.forEach(input => {
            if (!input.checkValidity()) {
                input.reportValidity();
                valid = false;
            }
        });
        
        if (stepIndex === 1 && valid) {
            const checkboxes = steps[stepIndex].querySelectorAll('input[name="items"]:checked');
            if (checkboxes.length === 0) {
                alert('Please select at least one item to pickup.');
                valid = false;
            }
        }
        return valid;
    }

    function sanitizeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    function populateSummary() {
        const name = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const city = document.getElementById('city').value;
        const address = document.getElementById('address').value;
        const date = document.getElementById('pickupDate').value;
        const time = document.getElementById('pickupTime').value;
        const weight = document.getElementById('weight').value;
        
        const items = Array.from(document.querySelectorAll('input[name="items"]:checked'))
            .map(cb => cb.value).join(', ');

        document.getElementById('summary-name').textContent = name;
        document.getElementById('summary-phone').textContent = phone;
        document.getElementById('summary-location').textContent = `${address}, ${city}`;
        document.getElementById('summary-datetime').textContent = `${date} (${time})`;
        document.getElementById('summary-items').textContent = items;
        document.getElementById('summary-weight').textContent = weight;

        const msg = `Hi KabadiBhaiya! I want to schedule a pickup.\nName: ${name}\nAddress: ${address}, ${city}\nDate: ${date}\nTime: ${time}\nItems: ${items}\nWeight: ${weight}`;
        const encodedMsg = encodeURIComponent(msg);
        
        document.getElementById('wa-btn').href = `https://wa.me/9779800000000?text=${encodedMsg}`;
        document.getElementById('viber-btn').href = `viber://chat?number=9779800000000&text=${encodedMsg}`;
    }

    let lastSubmitTime = 0;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const now = Date.now();
        if (now - lastSubmitTime < 60000) {
            alert('Please wait before submitting again.');
            return;
        }
        
        const bookingId = 'KB' + Math.floor(Date.now() / 1000);
        
        const bookingData = {
            id: bookingId,
            name: sanitizeHTML(document.getElementById('fullName').value),
            phone: sanitizeHTML(document.getElementById('phone').value),
            email: sanitizeHTML(document.getElementById('email').value),
            city: sanitizeHTML(document.getElementById('city').value),
            address: sanitizeHTML(document.getElementById('address').value),
            date: document.getElementById('pickupDate').value,
            time: document.getElementById('pickupTime').value,
            items: Array.from(document.querySelectorAll('input[name="items"]:checked')).map(cb => cb.value),
            weight: document.getElementById('weight').value,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };

        let bookings = JSON.parse(localStorage.getItem('kb_bookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('kb_bookings', JSON.stringify(bookings));
        
        lastSubmitTime = now;
        
        document.getElementById('booking-id-display').textContent = bookingId;
        document.getElementById('success-modal').style.display = 'flex';
    });
});
