// ========================================
// CONTACT FIRESTORE - Version améliorée
// Remplacez votre fichier contact-firestore.js par ceci
// ========================================

// Import des modules Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Configuration Firebase - VOS VRAIES CLÉS
const configurationFirebase = {
    apiKey: "AIzaSyDbYdVs1aAqw29sPhHVUeAmPJRrWpW-KIE",
    authDomain: "portfolio-f9428.firebaseapp.com",
    projectId: "portfolio-f9428",
    storageBucket: "portfolio-f9428.firebasestorage.app",
    messagingSenderId: "552901029956",
    appId: "1:552901029956:web:8ed721a1bf98a6713ccc11"
};

// Initialiser Firebase
const applicationFirebase = initializeApp(configurationFirebase);
const baseDeDonnees = getFirestore(applicationFirebase);

// Variables globales
let formulaireContact, boutonEnvoyer, messageStatut;

// Fonction pour afficher les messages à l'utilisateur
function afficherMessage(texte, type) {
    if (!messageStatut) return;
    
    messageStatut.textContent = texte;
    messageStatut.className = `status-message ${type} show`;
    
    // Auto-masquage après 5 secondes
    setTimeout(() => {
        messageStatut.classList.remove('show');
    }, 5000);
}

// Fonction pour gérer l'état de chargement
function definirChargement(enChargement) {
    if (!boutonEnvoyer) return;
    
    boutonEnvoyer.disabled = enChargement;
    
    if (enChargement) {
        boutonEnvoyer.classList.add('loading');
        boutonEnvoyer.querySelector('.btn-text').textContent = 'Envoi en cours...';
    } else {
        boutonEnvoyer.classList.remove('loading');
        boutonEnvoyer.querySelector('.btn-text').textContent = 'Envoyer le message';
    }
}

// Fonction de validation des champs
function validerChamp(champ) {
    const groupeInput = champ.closest('.input-group');
    const valeur = champ.value.trim();
    let estValide = true;
    
    // Retirer les classes précédentes
    groupeInput.classList.remove('error', 'valid');
    
    // Vérifications selon le type de champ
    switch (champ.id) {
        case 'nom':
            estValide = valeur.length >= 2;
            break;
            
        case 'email':
            const formatEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            estValide = formatEmail.test(valeur);
            break;
            
        case 'sujet':
            estValide = valeur.length >= 3;
            break;
            
        case 'message':
            estValide = valeur.length >= 10;
            break;
    }
    
    // Appliquer les styles de validation
    if (valeur) {
        if (estValide) {
            groupeInput.classList.add('valid');
        } else {
            groupeInput.classList.add('error');
        }
    }
    
    return estValide;
}

// Fonction principale pour envoyer le message
async function envoyerMessage(evenement) {
    evenement.preventDefault();
    
    // Validation complète du formulaire
    const champs = ['nom', 'email', 'sujet', 'message'];
    let formulaireValide = true;
    
    champs.forEach(idChamp => {
        const champ = document.getElementById(idChamp);
        if (champ && !validerChamp(champ)) {
            formulaireValide = false;
        }
    });
    
    if (!formulaireValide) {
        afficherMessage('❌ Veuillez corriger les erreurs dans le formulaire.', 'error');
        return;
    }
    
    // Démarrer le chargement
    definirChargement(true);
    
    try {
        // Préparer les données
        const donneesFormulaire = {
            nom: document.getElementById('nom').value.trim(),
            email: document.getElementById('email').value.trim(),
            sujet: document.getElementById('sujet').value.trim(),
            message: document.getElementById('message').value.trim(),
            dateEnvoi: serverTimestamp(),
            statut: 'non_lu',
            adresseIP: '', // Optionnel
            navigateur: navigator.userAgent,
            langue: navigator.language,
            referent: document.referrer || 'Direct',
            pageOrigine: window.location.href
        };
        
        // Envoyer à Firestore
        const referenceDocument = await addDoc(collection(baseDeDonnees, 'messages_contact'), donneesFormulaire);
        
        console.log('✅ Message enregistré avec l\'ID:', referenceDocument.id);
        
        // Afficher le message de succès
        afficherMessage('✅ Message envoyé avec succès ! Je vous répondrai très bientôt. Merci pour votre intérêt !', 'success');
        
        // Vider le formulaire
        formulaireContact.reset();
        
        // Retirer les styles de validation
        document.querySelectorAll('.input-group').forEach(groupe => {
            groupe.classList.remove('valid', 'error');
        });
        
        // Scroll vers le message de succès (optionnel)
        messageStatut.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (erreur) {
        console.error('❌ Erreur lors de l\'envoi:', erreur);
        
        let messageErreur = 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou me contacter directement par email.';
        
        // Messages d'erreur personnalisés
        if (erreur.code === 'permission-denied') {
            messageErreur = 'Accès refusé. Veuillez me contacter directement par email : dyasmine335@gmail.com';
        } else if (erreur.code === 'unavailable') {
            messageErreur = 'Service temporairement indisponible. Réessayez dans quelques minutes ou contactez-moi par email.';
        } else if (erreur.code === 'failed-precondition') {
            messageErreur = 'Erreur de configuration. Contactez-moi directement par email : dyasmine335@gmail.com';
        }
        
        afficherMessage('❌ ' + messageErreur, 'error');
        
    } finally {
        // Arrêter le chargement
        definirChargement(false);
    }
}

// Fonction d'initialisation
function initialiserFormulaire() {
    console.log('🚀 Initialisation du système de contact...');
    
    // Récupérer les éléments du DOM
    formulaireContact = document.getElementById('contactForm');
    boutonEnvoyer = document.getElementById('submitBtn');
    messageStatut = document.getElementById('statusMessage');
    
    // Vérifier que tous les éléments existent
    if (!formulaireContact) {
        console.error('❌ Formulaire de contact introuvable');
        return false;
    }
    
    if (!boutonEnvoyer) {
        console.error('❌ Bouton d\'envoi introuvable');
        return false;
    }
    
    // Ajouter l'écouteur pour l'envoi du formulaire
    formulaireContact.addEventListener('submit', envoyerMessage);
    
    // Ajouter la validation en temps réel
    const champs = ['nom', 'email', 'sujet', 'message'];
    champs.forEach(idChamp => {
        const champ = document.getElementById(idChamp);
        if (champ) {
            // Validation à la perte de focus
            champ.addEventListener('blur', () => {
                if (champ.value.trim()) {
                    validerChamp(champ);
                }
            });
            
            // Validation pendant la saisie (après le premier caractère)
            champ.addEventListener('input', () => {
                if (champ.value.trim().length > 0) {
                    // Délai pour éviter trop de validations
                    clearTimeout(champ.validationTimeout);
                    champ.validationTimeout = setTimeout(() => {
                        validerChamp(champ);
                    }, 300);
                } else {
                    // Retirer les styles si le champ est vide
                    champ.closest('.input-group').classList.remove('valid', 'error');
                }
            });
        }
    });
    
    console.log('✅ Système de contact initialisé avec succès');
    return true;
}

// Fonction de test pour le développement
function testerFormulaire() {
    console.log('🧪 Mode test activé');
    
    // Pré-remplir avec des données de test
    const champsTest = {
        'nom': 'Test Utilisateur',
        'email': 'test@example.com',
        'sujet': 'Test du système de contact',
        'message': 'Ceci est un message de test pour vérifier le bon fonctionnement du système de contact amélioré.'
    };
    
    Object.entries(champsTest).forEach(([id, valeur]) => {
        const champ = document.getElementById(id);
        if (champ) {
            champ.value = valeur;
            validerChamp(champ);
        }
    });
}

// Fonction pour améliorer l'UX
function améliorerExperience() {
    // Animation d'apparition du formulaire
    setTimeout(() => {
        const section = document.getElementById('contact');
        if (section) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    }, 100);
    
    // Auto-focus sur le premier champ (optionnel)
    const premierChamp = document.getElementById('nom');
    if (premierChamp) {
        // Délai pour éviter le focus automatique gênant
        setTimeout(() => {
            if (!document.activeElement || document.activeElement === document.body) {
                premierChamp.focus();
            }
        }, 1000);
    }
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM chargé, initialisation...');
    
    if (initialiserFormulaire()) {
        améliorerExperience();
        
        // Activer le mode test si nécessaire (commentez en production)
        // testerFormulaire();
    }
});

// Gestion des erreurs globales
window.addEventListener('error', function(event) {
    console.error('Erreur JavaScript:', event.error);
});

// Export des fonctions pour utilisation externe (optionnel)
window.ContactSystem = {
    initialiser: initialiserFormulaire,
    tester: testerFormulaire,
    valider: validerChamp
};