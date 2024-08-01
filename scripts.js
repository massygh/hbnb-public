document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication(); // Vérifie si l'utilisateur est authentifié

    // Écouteur d'événement pour la soumission du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Empêche le comportement par défaut du formulaire

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            await loginUser(email, password); // Appelle la fonction de connexion
        });
    }

    // Ajoute l'événement de filtrage des lieux
    const countryFilter = document.getElementById('country-filter');
    if (countryFilter) {
        countryFilter.addEventListener('change', (event) => {
            const selectedCountry = event.target.value.toLowerCase();
            const placeCards = document.querySelectorAll('.place-card');

            placeCards.forEach(card => {
                const placeLocation = card.querySelector('p:nth-of-type(1)').innerText.toLowerCase();
                if (selectedCountry === 'all' || placeLocation.includes(selectedCountry)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
});

// Fonction pour récupérer la valeur d'un cookie par son nom
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Vérifie si l'utilisateur est authentifié
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        if (loginLink) loginLink.style.display = 'block'; // Affiche le lien de connexion
    } else {
        if (loginLink) loginLink.style.display = 'none'; // Cache le lien de connexion
        fetchPlaces(token); // Charge les données des lieux si l'utilisateur est authentifié
    }
}

// Fonction pour gérer la connexion de l'utilisateur
async function loginUser(email, password) {
    try {
        const response = await fetch('https://votre-api-url/login', { // Remplacez par l'URL réelle de votre API de connexion
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            document.cookie = `token=${data.access_token}; path=/`;
            window.location.href = 'index.html'; // Redirige l'utilisateur vers la page principale
        } else {
            alert('Échec de la connexion : Identifiants incorrects');
        }
    } catch (error) {
        console.error('Erreur lors de la tentative de connexion :', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
    }
}

// Fonction pour récupérer les données des lieux
async function fetchPlaces(token) {
    try {
        const response = await fetch('https://votre-api-url/places', { // Remplacez par l'URL réelle de votre API
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const places = await response.json();
            displayPlaces(places);
        } else {
            console.error('Erreur lors de la récupération des lieux :', response.statusText);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des lieux :', error);
    }
}

// Fonction pour afficher les lieux
function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = ''; // Vide la liste actuelle

    places.forEach(place => {
        const placeCard = document.createElement('div');
        placeCard.classList.add('place-card');

        // Exemple de contenu HTML pour chaque carte de lieu
        placeCard.innerHTML = `
            <img src="${place.image_url}" class="place-image" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.location}</p>
            <p>Prix par nuit : ${place.price_per_night}</p>
            <button class="details-button" onclick="viewDetails(${place.id})">Voir les détails</button>
        `;

        placesList.appendChild(placeCard);
    });
}

// Fonction de navigation pour voir les détails d'un lieu (à implémenter)
function viewDetails(placeId) {
    // Code pour naviguer vers la page de détails du lieu ou afficher les détails
    console.log(`Voir les détails pour le lieu avec ID: ${placeId}`);
}
