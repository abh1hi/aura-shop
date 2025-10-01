<!-- File: src/views/Contact.vue -->
<template>
    <div>
        <section class="page-header">
            <div class="container">
                <h1>Contact Us</h1>
            </div>
        </section>

        <section class="section container">
            <div class="contact-grid">
                <div class="contact-form">
                    <h2>Send us a Message</h2>
                    <form>
                        <div class="form-group">
                            <label for="name">Your Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Your Email</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="message">Message</label>
                            <textarea id="message" name="message" rows="6" required></textarea>
                        </div>
                        <button type="submit" class="submit-btn">Submit</button>
                    </form>
                </div>
                <div class="contact-info">
                    <h2>Get in Touch</h2>
                    <div class="info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <p>hello@aura.com</p>
                    </div>
                    <div class="info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <p>+1 (234) 567-890</p>
                    </div>
                    <div class="info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <p>123 Design Street, New York, NY</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.contact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    align-items: flex-start;
}
.contact-form h2 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: var(--c5);
}
.form-group {
    margin-bottom: 1.5rem;
}
.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
}
.form-group input,
.form-group textarea {
    width: 100%;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Poppins', sans-serif;
    transition: border-color 0.3s, box-shadow 0.3s;
    box-sizing: border-box;
}
.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--c5);
    box-shadow: 0 0 0 3px rgba(154, 82, 255, 0.2);
}
.submit-btn {
    background-color: var(--c5);
    color: white;
    padding: 1rem 2.5rem;
    border-radius: 50px;
    font-weight: 600;
    transition: background-color 0.3s, transform 0.3s;
    display: inline-block;
    border: none;
    cursor: pointer;
    font-size: 1rem;
}
.submit-btn:hover {
    background-color: var(--c6);
    transform: translateY(-3px);
}
.contact-info h2 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: var(--c5);
}
.info-item {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
}
.info-item svg {
    width: 24px;
    height: 24px;
    margin-right: 1.5rem;
    color: var(--c6);
    flex-shrink: 0;
}
.info-item p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.7;
}

@media (max-width: 992px) {
    .contact-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
    }
}
@media (max-width: 768px) {
    .contact-form h2,
    .contact-info h2 {
        font-size: 2rem;
    }
}
</style>

