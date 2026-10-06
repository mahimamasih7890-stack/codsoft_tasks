const contactForm = document.getElementById('contactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name !== "" && email !== "" && message !== "") {
            formFeedback.style.color = "green";
            formFeedback.textContent = "Thank you! Your message has been sent successfully.";
            contactForm.reset();
        } else {
            formFeedback.style.color = "red";
            formFeedback.textContent = "Please fill in all fields before submitting.";
        }
    });
}
