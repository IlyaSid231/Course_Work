// render.js
import { hostServer, currentPage, totalPages, setTotalPages, currentLanguage } from '/js/config.js';
import { setupFavoriteListener, setupRequestListener,setupDetailedButtons } from '/js/eventListeners.js';
import { fetchFavorites, fetchRequests, fetchRestaurantsIdFromRequests } from '/js/api.js';
import {changeLang} from "/js/translate.js"

// Функция для очистки контейнера
export function clearCatalogContainer() {
  const catalogContainer = document.getElementById("catalog-container");
  catalogContainer.innerHTML = '';
}

// Функция для отображения ресторанов
export async function RenderRestaurants(restaurantsToRender) {

  const language = currentLanguage;

  clearCatalogContainer();

  const container = document.getElementById('catalog-container');

  if (restaurantsToRender.length === 0) {
    const notFind = document.createElement('div');
    notFind.className = 'not_find_restaurants';
    notFind.innerHTML = '<p class="no-products" data-lang="no_products_found">No products found.</p>';
    container.appendChild(notFind);

    setTotalPages(1);
    return;
  }

  const serverUrl = await hostServer;
  const userFavorites = await fetchFavorites();
  const userRequests = await fetchRestaurantsIdFromRequests();

  restaurantsToRender.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card flex';

    
    // Секция изображения
    const imagesContainer = document.createElement('div');
    imagesContainer.className = "card_imageSection";
    
    const img = document.createElement('img');
    img.src = `${serverUrl}${item.images[0]}`;
    img.alt = item.title;
    
    //Обработка избранного
    const favoriteIconContainer = document.createElement('button');
    favoriteIconContainer.type = "button";
    favoriteIconContainer.className = "favoriteIconContainer";
    favoriteIconContainer.id = `favoriteBtn_${item.id}`;
    const isFavorite = userFavorites.some(favorite => favorite === item.id);

    if(isFavorite){
      favoriteIconContainer.style.backgroundImage = 'url("/resources/images/enable_favorite.svg")';
    }
    else{
      favoriteIconContainer.style.backgroundImage = 'url("/resources/images/disable_favorite.svg")';
    }
    
    imagesContainer.appendChild(favoriteIconContainer);
    imagesContainer.appendChild(img);

    // Рейтинг и отзывы
    const ratingContainer = document.createElement('div');
    ratingContainer.className = "rating_container flex";
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars flex';

    const STAR_ICON_PATH = "/resources/images/star.png";

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('img');
      star.src = STAR_ICON_PATH;
      star.alt = "starImage";

      if (Math.floor(item.rating) >= i) {
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
    reviews.innerHTML = `<p class="reviews_count">(${item.reviews})</p>`;
    ratingContainer.appendChild(reviews);

    // Информация о ресторане
    const informationContainer = document.createElement('div');
    informationContainer.className = "card_infContainer flex flex-direction-column";
    const capacityText = `${item.capacity.join('/')}`;
    const servicesText = item.services.map(service => service[language]).join(', ') + '.';
    const featuresText = item.features.map(feature => feature[language]).join(', ');

    informationContainer.innerHTML = `
      <h3>${item.title[language]}</h3>
      <div class="metro_station_block">
          <span class="metro_station_label infContainerLabel" data-lang="metro_station_label">Станция метро:</span>
          <span class="metro_station infContainerValue">${item.metro[language]}</span>
      </div>
      <div class="capacity_block">
          <span class="capacity_label infContainerLabel" data-lang="capacity_label">Вместимость (чел):</span>
          <span class="capacity infContainerValue">${capacityText}</span>
      </div>
      <div class="services_block">
          <span class="services_label infContainerLabel" data-lang="services_label">Услуги:</span>
          <span class="services infContainerValue">${servicesText}</span>
      </div>
      <div class="features_block">
          <span class="features_label infContainerLabel" data-lang="features_label">Особенности:</span>
          <span class="features infContainerValue">${featuresText}</span>
      </div>
      <div class="vertical_inf_block flex">
          <div class="average_price_block flex flex-direction-column">
              <p class="average_price_label infContainerLabelBigger" data-lang="average_price_label">Средний чек</p>
              <p class="average_price infContainerValueBigger">${item.average_price.toLocaleString('ru-RU')} р.</p>
          </div>
          <div class="menu_price_block flex flex-direction-column">
              <p class="menu_price_label infContainerLabelBigger" data-lang="menu_price_label">Банкетное меню</p>
              <p class="menu_price infContainerValueBigger">от ${item.menu_price.toLocaleString('ru-RU')} р.</p>
          </div>
          <div class="rent_price_block flex flex-direction-column">
              <p class="rent_price_label infContainerLabelBigger" data-lang="rent_price_label">Аренда/час</p>
              <p class="rent_price infContainerValueBigger">от ${item.rent_price.toLocaleString('ru-RU')} р.</p>
          </div>
      </div>
    `;

    const metroStationBlock = informationContainer.querySelector('.metro_station_block');
    informationContainer.insertBefore(ratingContainer, metroStationBlock);

    // Кнопки
    const isSent = userRequests.some(request => request === item.id);

    const buttonBlock = document.createElement('div');
    buttonBlock.className = "button_block flex flex-direction-column align-center";

    const leaveRequestButton = document.createElement('button');
    leaveRequestButton.className = "leave_request_button button_in_card";
    leaveRequestButton.id = `requestBtn_${item.id}`;
    leaveRequestButton.textContent = 'Оставить заявку';
    leaveRequestButton.removeAttribute('data-lang');
    leaveRequestButton.setAttribute('data-lang', 'leave_request_button');

    if(isSent){
      leaveRequestButton.className = "leave_request_button_sent";
      leaveRequestButton.textContent = 'Отозвать заявку';
      leaveRequestButton.removeAttribute('data-lang');
      leaveRequestButton.setAttribute('data-lang', 'cancel_request_button');
    }

    const moreInfButton = document.createElement('button');
    moreInfButton.className = "more_inf_button button_in_card";
    moreInfButton.id = `detailedBtn_${item.id}`;
    moreInfButton.textContent = 'Подробнее';
    moreInfButton.setAttribute('data-lang', 'more_info_button');

    buttonBlock.appendChild(leaveRequestButton);
    buttonBlock.appendChild(moreInfButton);

    
    card.appendChild(imagesContainer);
    card.appendChild(informationContainer);
    card.appendChild(buttonBlock);
    container.appendChild(card);

    setupFavoriteListener(`favoriteBtn_${item.id}`, item.id);
    setupRequestListener(`requestBtn_${item.id}`, item.id, item.title);
    setupDetailedButtons(`detailedBtn_${item.id}`, item);
  });
  changeLang();
}

// Функция для обновления пагинации
export function updatePagination() {
  const currentPageElement = document.getElementById('currentPage');
  currentPageElement.textContent = currentPage;

  // Кнопки "назад" и "в начало"
  const firstButton = document.getElementById('firstPageBtn');
  const prevButton = document.getElementById('prevPageBtn');
  if (currentPage === 1) {
    firstButton.disabled = true;
    prevButton.disabled = true;
  } else {
    firstButton.disabled = false;
    prevButton.disabled = false;
  }

  // Кнопки "вперед" и "в конец"
  const nextButton = document.getElementById('nextPageBtn');
  const lastButton = document.getElementById('lastPageBtn');
  if (currentPage === totalPages) {
    nextButton.disabled = true;
    lastButton.disabled = true;
  } else {
    nextButton.disabled = false;
    lastButton.disabled = false;
  }
}