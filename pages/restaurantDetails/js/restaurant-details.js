import { hostServer, language } from '/js/config.js';
import { fetchFavorites, fetchRestaurantsIdFromRequests} from '/js/api.js'
import { setupFavoriteListener, setupRequestListener } from '/js/eventListeners.js';


document.addEventListener('DOMContentLoaded', async () => {

    // Получаем данные ресторана из sessionStorage
    const serverUrl =await hostServer;
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
    let reviewsCountForm;
    if (restaurant.reviews % 10 === 1 && restaurant.reviews % 100 !== 11) {
    reviewsCountForm = "Отзыв"; // 1, 21, 31 и т.д.
    } 
    else if (restaurant.reviews % 10 >= 2 && restaurant.reviews % 10 <= 4 &&
           (restaurant.reviews % 100 < 12 || restaurant.reviews % 100 > 14)) {
    reviewsCountForm = "Отзыва"; // 2, 3, 4, 22, 23, 24 и т.д.
    } else {
        reviewsCountForm = "Отзывов"; // 0, 5-20, 25-30 и т.д.
    }

    reviews.innerHTML = `<p class="reviews_count">${restaurant.reviews} ${reviewsCountForm}</p>`;
    ratingContainer.appendChild(reviews);
    reviewsAndFavoritesSection.appendChild(ratingContainer);


    // Заполняем текстовые поля
    document.getElementById('restaurant-title').textContent = restaurant.title['ru'];
    document.getElementById('restaurant-title-english').textContent = restaurant.title['en'];

    document.getElementById('currentPlatformName').textContent = `/ ${restaurant.title[language]}`;
    document.getElementById('restaurant-address').textContent = restaurant.address[language];
    document.getElementById('restaurant-metro').textContent = restaurant.metro[language];
    document.getElementById('restaurant-hours').textContent = restaurant.working_hours;
    document.getElementById('restaurant-average-price').textContent = `${restaurant.average_price.toLocaleString('ru-RU')} р.`;
    document.getElementById('restaurant-menu-price').textContent =`${restaurant.menu_price.toLocaleString('ru-RU')} р.`;
    document.getElementById('restaurant-phone').textContent = restaurant.phone;
    document.getElementById('restaurant-halls').textContent = restaurant.number_of_halls;

    document.getElementById('restaurant-capacity').textContent = restaurant.capacity.join('/');
    document.getElementById('restaurant-area').textContent = restaurant.area.join('/');
    document.getElementById('restaurant-rent-price').textContent =`${restaurant.rent_price.toLocaleString('ru-RU')} р./час`;
    // --------------------------------------------------


    // Create buttons -------------------------------------
    const userFavorites = await fetchFavorites();
    console.log(JSON.stringify(userFavorites));
    const favoriteButton = document.getElementById('favorite_btn');
    if(userFavorites.some(favorite => favorite === restaurant.id)){
        favoriteButton.style.backgroundImage = 'url("/resources/images/enable_favorite.svg")';
        favoriteButton.textContent = 'Удалить из избранного';
    }
    else{
        favoriteButton.style.backgroundImage = 'url("/resources/images/disable_favorite.svg")';
        favoriteButton.textContent = 'В избранное';
    }


    const requestButton = document.createElement('button');
    requestButton.id = `requestBtn_${restaurant.id}`;
    const requests = await fetchRestaurantsIdFromRequests();
    if(requests.some(request => request === restaurant.id)){
        requestButton.className = 'requestButtonLarge requestButtonLarge_sent';
        requestButton.textContent = 'Отозвать заявку';
    }
    else{
        requestButton.className = 'requestButtonLarge';
        requestButton.textContent = 'Оставить заявку';
    }

    document.getElementById('button_section').appendChild(requestButton);

    //Add event listeners for buttons
    setupFavoriteListener('favorite_btn', restaurant.id);
    setupRequestListener(`requestBtn_${restaurant.id}`, restaurant.id, restaurant.title);



    // Slider logical--------------------------------------------
    const sliderImage = document.getElementById('slider-image');
    const images = restaurant.images || [];
    let currentIndex = 0;

    
    if (images.length > 0) {
        sliderImage.src = `${serverUrl}${images[currentIndex]}`;
    }

    
    const leftArrow = document.getElementById('left-arrow');
    const rightArrow = document.getElementById('right-arrow');

    leftArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            sliderImage.src = `${serverUrl}${images[currentIndex]}`;

            leftArrow.disabled = currentIndex === 0;
            rightArrow.disabled = currentIndex === images.length - 1;
        }
    });

    rightArrow.addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            sliderImage.src = `${serverUrl}${images[currentIndex]}`;

            leftArrow.disabled = currentIndex === 0;
            rightArrow.disabled = currentIndex === images.length - 1;
        }
    });


    // Modal window logic
    const modal = document.getElementById('images_modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');
    const modalLeftArrow = document.getElementById('modal-left-arrow');
    const modalRightArrow = document.getElementById('modal-right-arrow');
    let modalIndex = currentIndex;

    sliderImage.addEventListener('click', (e) => {
        modalIndex = currentIndex;
        modalImage.src = `${serverUrl}${images[modalIndex]}`;
        modal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modalLeftArrow.addEventListener('click', () => {
        if (modalIndex > 0) {
            modalIndex--;
            modalImage.src = `${serverUrl}${images[modalIndex]}`;
            
            if (modalIndex === 0) {
                modalLeftArrow.disabled = true;
            }
            else{
                modalLeftArrow.disabled = false;
            }
        }
    });

    modalRightArrow.addEventListener('click', () => {
        if (modalIndex < images.length - 1) {
            modalIndex++;
            modalImage.src = `${serverUrl}${images[modalIndex]}`;

             if (modalIndex === images.length - 1) {
                modalRightArrow.disabled = true;
            }
            else{
                modalRightArrow.disabled = false;
            }
        }
    });

    // Закрытие модального окна при клике вне изображения
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});