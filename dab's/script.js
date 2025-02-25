document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navItems = document.querySelector('.navItems');
    
    menuToggle.addEventListener('click', function() {
        navItems.classList.toggle('active');
    });
    
    const navLinks = document.querySelectorAll('.navItems a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navItems.classList.remove('active');
        });
    });
    
    const animateElements = document.querySelectorAll('.fade-up');
    
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }
    
    function animateOnScroll() {
        animateElements.forEach(element => {
            if (isElementInViewport(element)) {
                const delay = element.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    element.classList.add('visible');
                }, delay);
            }
        });
    }
    
    animateOnScroll();
    
    window.addEventListener('scroll', animateOnScroll);
    
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    startSlideshow();
});

function showRoomDetails(roomName) {
    const modal = document.getElementById('roomDetailsModal');
    const roomData = getRoomData(roomName);
    
    document.getElementById('room-name').textContent = roomName;
    document.getElementById('room-image').src = roomData.image;
    document.getElementById('room-description').textContent = roomData.description;
    document.getElementById('room-price').innerHTML = roomData.price + '€ <span>/nuit</span>';
    
    const facilitiesContainer = document.getElementById('room-facilities');
    facilitiesContainer.innerHTML = '';
    roomData.facilities.forEach(facility => {
        const facilityElement = document.createElement('div');
        facilityElement.className = 'room-facility';
        facilityElement.textContent = facility;
        facilitiesContainer.appendChild(facilityElement);
    });
    
    modal.style.display = 'block';
}

function showServiceDetails(serviceName) {
    const modal = document.getElementById('serviceDetailsModal');
    const serviceData = getServiceData(serviceName);
    
    document.getElementById('service-name').textContent = serviceName;
    document.getElementById('service-image').src = serviceData.image;
    document.getElementById('service-description').textContent = serviceData.description;
    document.getElementById('service-hours').textContent = serviceData.hours;
    
    modal.style.display = 'block';
}

function showAvailability() {
    const modal = document.getElementById('availabilityModal');
    const checkIn = document.getElementById('check-in').value;
    const checkOut = document.getElementById('check-out').value;
    const guests = document.getElementById('guests').value;
    
    if(!checkIn || !checkOut) {
        alert('Veuillez sélectionner des dates valides');
        return;
    }
    
    const fromDate = new Date(checkIn).toLocaleDateString('fr-FR');
    const toDate = new Date(checkOut).toLocaleDateString('fr-FR');
    
    document.getElementById('from-date').textContent = fromDate;
    document.getElementById('to-date').textContent = toDate;
    document.getElementById('guests-count').textContent = guests + (guests > 1 ? ' personnes' : ' personne');
    
    const availabilityResults = document.querySelector('.availability-results');
    availabilityResults.innerHTML = '';
    
    const rooms = [
        {name: 'Suite Familiale', image: 'images/chambres2.jpg', price: 350, available: true},
        {name: 'Suite Panoramique', image: 'images/chambre3.jpg', price: 490, available: true},
        {name: 'Suite Présidentielle', image: 'images/chambre5.jpg', price: 590, available: guests <= 3}
    ];
    
    rooms.forEach(room => {
        if(room.available) {
            const roomElement = document.createElement('div');
            roomElement.className = 'chambre';
            roomElement.style.marginBottom = '2rem';
            
            roomElement.innerHTML = `
                <div class="room-details">
                    <div class="room-details-image" style="height: 150px;">
                        <img src="${room.image}" alt="${room.name}">
                    </div>
                    <div class="room-details-content">
                        <div>
                            <h3>${room.name}</h3>
                            <p>Disponible pour ${guests} personne${guests > 1 ? 's' : ''}</p>
                            <p class="price">${room.price}€ <span>/nuit</span></p>
                        </div>
                        <div>
                            <a href="#reservation" class="btn" onclick="selectRoom('${room.name}', '${checkIn}', '${checkOut}', ${guests}, ${room.price}); closeModal('availabilityModal');">Réserver</a>
                        </div>
                    </div>
                </div>
            `;
            
            availabilityResults.appendChild(roomElement);
        }
    });
    
    if(availabilityResults.children.length === 0) {
        availabilityResults.innerHTML = '<p>Aucune chambre disponible pour ces dates et ce nombre de personnes. Veuillez essayer d\'autres dates ou contacter directement l\'hôtel.</p>';
    }
    
    modal.style.display = 'block';
}

function selectRoom(roomName, checkIn, checkOut, guests, price) {
    document.getElementById('arrival').value = checkIn;
    document.getElementById('departure').value = checkOut;
    document.getElementById('nb-guests').value = guests;
    
    const roomTypeSelect = document.getElementById('room-type');
    for(let i = 0; i < roomTypeSelect.options.length; i++) {
        if(roomTypeSelect.options[i].value === roomName) {
            roomTypeSelect.selectedIndex = i;
            break;
        }
    }
    
    document.getElementById('reservation').scrollIntoView({ behavior: 'smooth' });
}

function submitReservation() {
    const arrival = document.getElementById('arrival').value;
    const departure = document.getElementById('departure').value;
    const roomType = document.getElementById('room-type').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    if(!arrival || !departure || !roomType || !name || !email || !phone) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    alert('Votre réservation a été enregistrée avec succès ! Un email de confirmation vous sera envoyé dans les plus brefs délais.');
    
    document.querySelector('.reservation-form form').reset();
}

function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');
    
    answer.classList.toggle('active');
    toggle.textContent = answer.classList.contains('active') ? '-' : '+';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

window.addEventListener('click', function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

function getRoomData(roomName) {
    const roomsData = {
        'Suite Familiale': {
            image: 'images/chambres2.jpg',
            description: 'Notre Suite Familiale offre un espace généreux de 70m² avec 2 chambres séparées, idéal pour les familles jusqu\'à 5 personnes. Elle dispose d\'une salle de bain avec baignoire et douche à l\'italienne, ainsi qu\'un coin salon et une terrasse privée avec vue sur le jardin.',
            price: '350',
            facilities: ['Wi-Fi gratuit', 'Climatisation', 'TV écran plat', 'Minibar', 'Coffre-fort', 'Service en chambre 24h/24', 'Terrasse privée']
        },
        'Suite Panoramique': {
            image: 'images/chambre3.jpg',
            description: 'Située aux étages supérieurs, notre Suite Panoramique de 60m² offre une vue à couper le souffle sur la ville et l\'océan. Elle dispose d\'un lit king-size, d\'un salon séparé, d\'une salle de bain luxueuse et d\'une terrasse privée.',
            price: '490',
            facilities: ['Vue panoramique', 'Wi-Fi gratuit', 'Climatisation', 'TV écran plat', 'Minibar premium', 'Baignoire jacuzzi', 'Service en chambre 24h/24', 'Terrasse privée']
        },
        'Suite Présidentielle': {
            image: 'images/chambre5.jpg',
            description: 'Notre Suite Présidentielle de 120m² est l\'incarnation du luxe absolu. Elle offre un vaste espace de vie avec salon et salle à manger séparés, une chambre principale avec un lit king-size, un dressing, une salle de bain en marbre avec jacuzzi, et une terrasse privée panoramique.',
            price: '590',
            facilities: ['Espace exclusif', 'Wi-Fi gratuit', 'Climatisation', 'TV écran plat', 'Minibar premium', 'Baignoire jacuzzi', 'Service en chambre 24h/24', 'Majordome personnel', 'Terrasse panoramique privée']
        }
    };
    
    return roomsData[roomName];
}

function getServiceData(serviceName) {
    const servicesData = {
        'Spa & Bien-être': {
            image: 'images/fille_piscine1.jpg',
            description: 'Notre espace Spa & Bien-être vous offre une expérience de détente ultime. Profitez de nos massages traditionnels et thérapeutiques, de nos soins du visage et du corps, de notre hammam et de nos bains à remous. Nos thérapeutes expérimentés vous guideront vers un équilibre physique et mental parfait.',
            hours: 'Ouvert tous les jours de 8h00 à 21h00. Réservation recommandée.'
        },
        'Piscine Infinity': {
            image: 'images/riviera-piscine.jpg',
            description: 'Notre piscine à débordement offre une vue imprenable sur l\'océan. Relaxez-vous sur nos chaises longues confortables tout en sirotant un cocktail de notre bar de piscine. Service de serviettes et de boissons disponible tout au long de la journée.',
            hours: 'Ouvert tous les jours de 7h00 à 19h00.'
        },
        'Restaurant Gastronomique': {
            image: 'images/restau.jpg',
            description: 'Notre restaurant gastronomique "Le Palmier" propose une cuisine raffinée mêlant saveurs locales et internationales. Notre chef exécutif crée des plats à partir d\'ingrédients frais et locaux. Profitez de votre repas dans notre salle à manger élégante ou sur notre terrasse avec vue panoramique.',
            hours: 'Petit-déjeuner: 6h30 - 10h30, Déjeuner: 12h00 - 14h30, Dîner: 19h00 - 22h30'
        }
    };
    
    return servicesData[serviceName];
}

// Diaporama automatique
function startSlideshow() {
    const images = document.querySelectorAll('.slideshow-image');
    let currentImage = 0;
    
    setInterval(() => {
        images[currentImage].classList.remove('active');
        currentImage = (currentImage + 1) % images.length;
        images[currentImage].classList.add('active');
    }, 5000); // Change d'image toutes les 5 secondes
}

function updateTotal() {
    const arrival = new Date(document.getElementById('arrival').value);
    const departure = new Date(document.getElementById('departure').value);
    const roomSelect = document.getElementById('room-type');
    const selectedRoom = roomSelect.options[roomSelect.selectedIndex];
    const guests = parseInt(document.getElementById('nb-guests').value);
    const breakfast = document.getElementById('breakfast').checked;
    const parking = document.getElementById('parking').checked;

    if (!arrival || !departure || !selectedRoom.value) {
        document.getElementById('booking-summary').innerHTML = '<p>Sélectionnez vos dates et options pour voir le total</p>';
        document.getElementById('total-amount').textContent = '0';
        return;
    }

    const nights = Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
    const roomPrice = parseInt(selectedRoom.dataset.price);
    const breakfastPrice = breakfast ? (25 * guests * nights) : 0;
    const parkingPrice = parking ? (20 * nights) : 0;
    const total = (roomPrice * nights) + breakfastPrice + parkingPrice;

    let summary = `
        <p><strong>Séjour de ${nights} nuit(s)</strong></p>
        <p>${selectedRoom.value}: ${roomPrice}€ × ${nights} nuits = ${roomPrice * nights}€</p>
    `;

    if (breakfast) {
        summary += `<p>Petit-déjeuner: 25€ × ${guests} personne(s) × ${nights} jours = ${breakfastPrice}€</p>`;
    }
    if (parking) {
        summary += `<p>Parking: 20€ × ${nights} jours = ${parkingPrice}€</p>`;
    }

    document.getElementById('booking-summary').innerHTML = summary;
    document.getElementById('total-amount').textContent = total;
}

// Add event listeners for date inputs
document.getElementById('arrival').addEventListener('change', updateTotal);
document.getElementById('departure').addEventListener('change', updateTotal);
document.getElementById('nb-guests').addEventListener('change', updateTotal);

function setRating(rating) {
    const stars = document.querySelectorAll('#rating-stars label');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < rating);
    });
    document.querySelector('#rating-stars').dataset.rating = rating;
}

function submitReview() {
    const rating = document.querySelector('#rating-stars').dataset.rating;
    const reviewText = document.querySelector('#review-text').value;

    if (!rating || !reviewText) {
        alert('Veuillez donner une note et écrire un commentaire');
        return;
    }

    // Ici vous pouvez ajouter le code pour envoyer l'avis à votre backend
    alert('Merci pour votre avis ! Il sera publié après modération.');
    document.querySelector('#review-form').reset();
    document.querySelectorAll('#rating-stars label').forEach(star => star.classList.remove('active'));
}