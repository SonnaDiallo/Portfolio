// Animations au défilement de la page pour les sections
document.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < window.innerHeight - 100) {
            section.classList.add('visible');
        }
    });
});

// Validation du formulaire (optionnel)
document.querySelector('.contact-form')?.addEventListener('submit', function (e) {
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (!email.includes('@')) {
        alert('Veuillez entrer une adresse email valide.');
        e.preventDefault(); // Empêche l'envoi du formulaire
    }

    if (message.trim() === '') {
        alert('Le message ne peut pas être vide.');
        e.preventDefault();
    }
});

// Gestion du menu mobile
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar'); // Sélection par classe

if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active'); // Basculer la classe "active" pour ouvrir/fermer le menu
    });
}

// Animation des images au défilement (méthode 1 : événement scroll)
document.addEventListener('scroll', () => {
    const images = document.querySelectorAll('.about-img img, .projet img, .home-img img');
    images.forEach(image => {
        const imageTop = image.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (imageTop < windowHeight * 0.75) {
            image.classList.add('visible');
        }
    });
});

// Animation des images au défilement (méthode 2 : IntersectionObserver)
const images = document.querySelectorAll('.about-img img, .projet img, .home-img img');

if (images.length > 0) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Arrête d'observer une fois visible
            }
        });
    }, {
        threshold: 0.5, // Déclenche lorsque 50% de l'image est visible
    });

    images.forEach(image => {
        observer.observe(image);
    });
}