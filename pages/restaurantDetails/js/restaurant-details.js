import { currentLanguage, setCurrentLanguage } from '/js/config.js';
import { fetchFavorites, fetchRestaurantsIdFromRequests} from '/js/api.js'
import { setupFavoriteListener, setupRequestListener } from '/js/eventListeners.js';
import {changeLang} from "/js/translate.js";
import "/js/burger_menu.js";


document.addEventListener('DOMContentLoaded', async () => {

    // Получаем данные ресторана из sessionStorage
    const restaurant = JSON.parse(sessionStorage.getItem('currentRestaurant'));

    if (!restaurant) {
        console.error('No restaurant fetched');
        return;
    }

// Рейтинг и отзывы
    const reviewsAndFavoritesSection= document.getElementById("reviews_and_favorites_section");
    const ratingContainer = document.createElement('div');
    ratingContainer.className = "rating_container flex";
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars flex';

    const STAR_ICON_PATH = "/resources/images/star.png";

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('img');
      star.src = STAR_ICON_PATH;
      star.alt = "starImage";

      if (Math.floor(restaurant.rating) >= i) {
        star.className = 'fill_star';
      } else {
        star.className = "empty_star";
        star.style.filter = "grayscale(100%) brightness(2)";
      }
      starsContainer.appendChild(star);
    }
    ratingContainer.appendChild(starsContainer);


    const reviews = document.createElement('div');
    reviews.className = "reviews";
    let reviewsCountForm = setReviewsCountForm(restaurant);

   

    reviews.innerHTML = `<p class="reviews_count">${restaurant.reviews} ${reviewsCountForm}</p>`;
    ratingContainer.appendChild(reviews);
    reviewsAndFavoritesSection.appendChild(ratingContainer);


    // Заполняем текстовые поля
    document.getElementById('restaurant-title').textContent = restaurant.title['ru'];
    document.getElementById('restaurant-title-english').textContent = restaurant.title['en'];

    fillRestaurantField(restaurant);

    // --------------------------------------------------


    // Create buttons -------------------------------------
    const userFavorites = await fetchFavorites();
    const favoriteButton = document.getElementById('favorite_btn');
    
    if(userFavorites.some(favorite => favorite === restaurant.id)){
        favoriteButton.style.backgroundImage = 'url("/resources/images/enable_favorite.svg")';
        favoriteButton.textContent = 'Удалить из избранного';
        favoriteButton.removeAttribute("data-lang");
        favoriteButton.setAttribute("data-lang", "remove_favorite");
    }
    else{
        favoriteButton.style.backgroundImage = 'url("/resources/images/disable_favorite.svg")';
        favoriteButton.textContent = 'В избранное';
        favoriteButton.removeAttribute("data-lang");
        favoriteButton.setAttribute("data-lang", "add_favorite");
    }


    const requestButton = document.createElement('button');
    requestButton.id = `requestBtn_${restaurant.id}`;
    const requests = await fetchRestaurantsIdFromRequests();
    if(requests.some(request => request === restaurant.id)){
        requestButton.className = 'requestButtonLarge requestButtonLarge_sent';
        requestButton.textContent = 'Отозвать заявку';
        requestButton.removeAttribute("data-lang");
        requestButton.setAttribute("data-lang", "cancel_request_button");
    }
    else{
        requestButton.className = 'requestButtonLarge';
        requestButton.textContent = 'Оставить заявку';
        requestButton.removeAttribute("data-lang");
        requestButton.setAttribute("data-lang", "leave_request_button");
    }

    document.getElementById('button_section').appendChild(requestButton);

    //Add event listeners for buttons
    setupFavoriteListener('favorite_btn', restaurant.id);
    setupRequestListener(`requestBtn_${restaurant.id}`, restaurant.id, restaurant.title);

    
    document.querySelectorAll('.languages_btn').forEach(btn => {
        btn.addEventListener('click',async (event) => {
            setCurrentLanguage(event.target.dataset.btn);
            setReviewsCountForm(restaurant);
            fillRestaurantField(restaurant);
            // changeLang();
        });
    });
    
    changeLang();
});


function fillRestaurantField(restaurant){
    document.getElementById('currentPlatformName').textContent = `/ ${restaurant.title[currentLanguage]}`;
    
    document.getElementById('restaurant-address').textContent = restaurant.address[currentLanguage];
    document.getElementById('restaurant-metro').textContent = restaurant.metro[currentLanguage];
    document.getElementById('restaurant-hours').textContent = restaurant.working_hours;
    document.getElementById('restaurant-average-price').textContent = `${restaurant.average_price.toLocaleString('ru-RU')} ${currentLanguage === 'ru' ? 'р.' : 'r.'}`;
    document.getElementById('restaurant-menu-price').textContent =`${restaurant.menu_price.toLocaleString('ru-RU')} ${currentLanguage === 'ru' ? 'р.' : 'r.'}`;
    document.getElementById('restaurant-phone').textContent = restaurant.phone;
    document.getElementById('restaurant-halls').textContent = restaurant.number_of_halls;

    document.getElementById('restaurant-capacity').textContent = restaurant.capacity.join('/');
    document.getElementById('restaurant-area').textContent = restaurant.area.join('/');
    document.getElementById('restaurant-rent-price').textContent =`${restaurant.rent_price.toLocaleString('ru-RU')} ${currentLanguage === 'ru' ? 'р.' : 'r.'}`;
}

function setReviewsCountForm(restaurant){
    let reviewsCountForm;
     const translations = {
        ru: {
            singular: "Отзыв",
            pluralFew: "Отзыва",
            pluralMany: "Отзывов"
        },
        en: {
            singular: "Review",
            pluralFew: "Reviews",
            pluralMany: "Reviews"
        }
    };

    if (restaurant.reviews % 10 === 1 && restaurant.reviews % 100 !== 11) {
        reviewsCountForm = translations[currentLanguage].singular; // 1, 21, 31 и т.д.
    } 
    else if (restaurant.reviews % 10 >= 2 && restaurant.reviews % 10 <= 4 &&
           (restaurant.reviews % 100 < 12 || restaurant.reviews % 100 > 14)) {
        reviewsCountForm = translations[currentLanguage].pluralFew; // 2, 3, 4, 22, 23, 24 и т.д.
    } else {
        reviewsCountForm = translations[currentLanguage].pluralMany; // 0, 5-20, 25-30 и т.д.
    }
    const revCount = document.querySelector('.reviews_count');
    if(revCount){
        revCount.textContent = `${restaurant.reviews} ${reviewsCountForm}`;
        return;
    }
    return reviewsCountForm;
}