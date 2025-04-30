const response = await fetch('../../../hostServer.json');
const hostServerJSON = await response.json();
const hostServer = hostServerJSON.localhost_path;

// Параметры пагинации
let currentPage = 1;
const limit = 5; // Количество элементов на странице
let totalItems = 0; // Общее количество залов
let totalPages = 1; 
let currentSearchQuery = '';
let currentSortField = ''; // Текущий критерий сортировки (поле)
let currentSortOrder = 'asc'; // Текущий порядок сортировки (asc/desc)
let currentPlatformType = ''; // Текущая выбранная категория ресторана
let currentFeature = ''; // Текущая выбранная особенность
let currentCapacityRange = ''; // Текущий диапазон вместимости
let currentPriceRange = ''; // Текущий диапазон стоимости
let currentMetro = ''; // Текущая выбранная станция метро

// Маппинг между значениями <select> (на английском) и значениями в JSON (на русском)
const platformTypeMapping = {
  'conference_hall': 'Конференц-зал',
  'loft': 'Лофт',
  'banquet_hall': 'Банкетный зал',
  'rooftop_deck': 'Площадка на крыше',
  'manor': 'Усадьба',
  'theater_hall': 'Театральный зал',
  'greenhouse': 'Оранжерея',
  'club_hall': 'Клубный зал'
};

// Маппинг для особенностей
const featureMapping = {
  'parking': 'Парковка',
  'vip': 'VIP',
  'fireplace': 'Камин'
};

// Маппинг для станций метро
const metroMapping = {
  'sokolniki': 'Сокольники',
  'mayakovskaya': 'Маяковская',
  'cutuzovskaya': 'Кутузовская'
};



// Функция для получения данных с сервера с пагинацией
async function fetchRestaurants(page, searchQuery = '', sortField = '', sortOrder = 'asc', platformType = '',
                                  feature = '', capacityRange = '', priceRange = '', metro = '') {
  try {
    // Формируем URL с параметрами пагинации и поиска
    let url = `${hostServer}/restaurants?_page=${page}&_limit=${limit}`;

    //Поиск
    if (searchQuery) {
      url += `&q=${encodeURIComponent(searchQuery)}`;
    }

    //Сортировка
    if (sortField) {
      url += `&_sort=${sortField}&_order=${sortOrder}`;
    }

    //Тип платформы
    if(platformType){
      url += `&type=${encodeURIComponent(platformType)}`;
    }

    //Фильтр по особенностям
    if (feature) {
      url += `&features_like=${encodeURIComponent(feature)}`;
    }

    // Фильтр по вместимости (диапазон)
    if (capacityRange) {
      if (capacityRange === 'less_30') {
        url += `&capacity_lte=30`;
      } else if (capacityRange === '30_100') {
        url += `&capacity_gte=30&capacity_lt=101`;
      } else if (capacityRange === 'more_100') {
        url += `&capacity_gt=100`;
      }
    }

    // Фильтр по стоимости (диапазон)
    if (priceRange) {
      if (priceRange === 'less_3000') {
        url += `&average_price_lte=3000`;
      } else if (priceRange === '3000_5000') {
        url += `&average_price_gte=3000&average_price_lte=5000`;
      } else if (priceRange === 'more_5000') {
        url += `&average_price_gte=5001`;
      }
    }

    // Фильтр по метро
    if (metro) {
      url += `&metro_like=${encodeURIComponent(metro)}`;
    }

    console.log('Запрос URL:', url);

    const response = await fetch(url);
    const data = await response.json();

    // Получаем общее количество элементов из заголовка X-Total-Count
    totalItems = parseInt(response.headers.get('X-Total-Count'), 10) || 0;
    totalPages = Math.ceil(totalItems / limit);

    return data;
  } 
  catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return [];
  }
}

// Инициализация данных и отображение
async function loadRestaurants(page, searchQuery = '', sortField = '', sortOrder = 'asc', platformType = '', 
                                feature = '', capacityRange = '', priceRange = '', metro = '') {
  const data = await fetchRestaurants(page, searchQuery, sortField, sortOrder, platformType, feature, capacityRange, priceRange, metro);

  const count = document.getElementById('total-count');
  const platform_text = document.getElementById('platform_form');
  count.textContent = totalItems; // Используем общее количество из X-Total-Count

  if (totalItems % 10 >= 5 || totalItems % 10 === 0) {
    platform_text.textContent = ' Площадок';
  } else if (totalItems % 10 === 1) {
    platform_text.textContent = " Площадка";
  } else {
    platform_text.textContent = " Площадки";
  }

  RenderRestaurants(data);
  updatePagination();
}


function RenderRestaurants(restaurantsToRender){

  const container = document.getElementById('catalog-container');

  if (restaurantsToRender.length === 0) {
    const notFind = document.createElement('div');
    notFind.className = 'not_find_restaurants';
    notFind.innerHTML = '<p class="no-products">No products found.</p>';
    container.appendChild(notFind);
    return;
}

  restaurantsToRender.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card flex';

    // Секция изображения ------------------------------------
    const imagesContainer = document.createElement('div');
    imagesContainer.className = "card_imageSection";
    const img = document.createElement('img');
    img.src = `${hostServer}${item.images[0]}`;
    img.alt = item.title;
    imagesContainer.appendChild(img)
    
    
    // Добавляем звезды и отзывы в контейнер -------------------------------------------
    const ratingContainer = document.createElement('div');
    ratingContainer.className = "rating_container flex";

    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars flex';

    var STAR_ICON_PATH = "../../resources/images/star.png";

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('img');
      star.src = STAR_ICON_PATH; 
      star.alt ="starImage";

      if (Math.floor(item.rating) >= i ){
        star.className = 'fill_star';
      }
      else{
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
    // ----------------------------------------------------------------------------
    
    // Добавление отзывов к звуздам
    

    // Создание контейнера с информацией об объекте -------------------------------
    const informationContainer = document.createElement('div');
    informationContainer.className = "card_infContainer flex flex-direction-column";
    const capacityText = `${item.capacity.join('/')}`;
    const servicesText = `${item.services.join(', ')}.`;
    const featuresText = `${item.features.join(', ')}`;

    informationContainer.innerHTML = `
      <h3>${item.title}</h3>
      <div class="metro_station_block">
          <span class="metro_station_label infContainerLabel">Станция метро:</span>
          <span class="metro_station infContainerValue">${item.metro}</span>
      </div>
      <div class="capacity_block">
          <span class="capacity_label infContainerLabel">Вместимость (чел):</span>
          <span class="capacity infContainerValue">${capacityText}</span>
      </div>
      <div class="services_block">
          <span class="services_label infContainerLabel">Услуги:</span>
          <span class="services infContainerValue">${servicesText}</span>
      </div>
      <div class="features_block">
          <span class="features_label infContainerLabel">Особенности:</span>
          <span class="features infContainerValue">${featuresText}</span>
      </div>
      <div class="vertical_inf_block flex">
          <div class="average_price_block flex flex-direction-column">
              <p class="average_price_label infContainerLabelBigger">Средний чек</p>
              <p class="average_price infContainerValueBigger">${item.average_price.toLocaleString('ru-RU')} р.</p>
          </div>
          <div class="menu_price_block flex flex-direction-column">
              <p class="menu_price_label infContainerLabelBigger">Банкетное меню</p>
              <p class="menu_price infContainerValueBigger">от ${item.menu_price.toLocaleString('ru-RU')} р.</p>
          </div>
          <div class="rent_price_block flex flex-direction-column">
              <p class="rent_price_label infContainerLabelBigger">Аренда/час</p>
              <p class="rent_price infContainerValueBigger">от ${item.rent_price.toLocaleString('ru-RU')} р.</p>
          </div>
      </div>
    `;

    const metroStationBlock = informationContainer.querySelector('.metro_station_block');
    informationContainer.insertBefore(ratingContainer, metroStationBlock);
    // ------------------------------------------------------------

    const buttonBlock = document.createElement('div');
    buttonBlock.className = "button_block flex flex-direction-column align-center";
    buttonBlock.innerHTML=`
    <button class="leave_request_button button_in_card">Оставить заявку</button>
    <button class="start_chat_button button_in_card">Начать чат</button>
    <button class="online_view_button button_in_card">Онлайн-показ</button>
    `;


    card.appendChild(imagesContainer); 
    card.appendChild(informationContainer);
    card.appendChild(buttonBlock);
    container.appendChild(card);
  });
}

// Обновление интерфейса пагинации
function updatePagination() {
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

//Навигация по страницам -----------------------------------------------------------------
function goToFirstPage() {
  if (currentPage !== 1) {
    currentPage = 1;
    loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
  }
}

function goToPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
  }
}

function goToNextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
  }
}

function goToLastPage() {
  if (currentPage !== totalPages) {
    currentPage = totalPages;
    loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
  }
}

function clearCatalogContainer(){
  const catalogContainer = document.getElementById("catalog-container");
  catalogContainer.innerHTML = '';
}

document.getElementById('firstPageBtn').addEventListener('click', () => {
  clearCatalogContainer();
  goToFirstPage()});
document.getElementById('prevPageBtn').addEventListener('click', () => {
  clearCatalogContainer();
  goToPreviousPage()});
document.getElementById('nextPageBtn').addEventListener('click',() => {
  clearCatalogContainer(); 
  goToNextPage()});
document.getElementById('lastPageBtn').addEventListener('click',() => {
  clearCatalogContainer(); 
  goToLastPage()});
//----------------------------------------------------------------------------------------------


// Добавляем обработчик для поля поиска с debounce ---------------------------------------------
const searchInput = document.querySelector('.search_input');
let debounceTimeout;

searchInput.addEventListener('input', (e) => {
  clearTimeout(debounceTimeout); // Сбрасываем предыдущий таймер
  debounceTimeout = setTimeout(async () => {
    currentSearchQuery = e.target.value.trim(); // Получаем текущий поисковый запрос
    currentPage = 1;
    clearCatalogContainer();
    await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro); // Загружаем данные с учетом поиска
  }, 600); // Задержка 300 мс
});


//Контейнер для реализации сортировки ------------------------------------------------------------
// Добавляем обработчик для сортировки
const sortSelect = document.getElementById('sort_parameters');
sortSelect.addEventListener('change', async (e) => {
  const selectedOption = e.target.value;

  // Определяем поле для сортировки
  let sortField = '';
  switch (selectedOption) {
    case 'price':
      sortField = 'average_price'; // Сортировка по цене (поле average_price)
      break;
    case 'name':
      sortField = 'title'; // Сортировка по названию (поле title)
      break;
    case 'rating':
      sortField = 'rating'; // Сортировка по рейтингу 
      break;
    default:
      sortField = ''; // Без сортировки
  }

  // Сохраняем текущий критерий сортировки
  currentSortField = sortField;

  // Сбрасываем страницу на первую и обновляем каталог
  currentPage = 1;
  clearCatalogContainer();
  await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
});

//Обработчик события для кнопки порядка сортировки (asc/desc)
const sortOrderIcon = document.getElementById('sort-order-icon');
sortOrderIcon.addEventListener('click', async () => {
  if (currentSortField) { // Переключаем порядок только если выбран критерий сортировки
    currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    currentPage = 1;
    clearCatalogContainer();
    await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
  }
});
// -----------------------------------------------------------------------------------------------------


//Реализация логики фильтрации по категориям -----------------------------------------------------------

const filterPlatformType = document.getElementById('filter_platform_type');
filterPlatformType.addEventListener('change', async() => {
  const selectedPlatformType = filterPlatformType.value;
  // Преобразуем английское значение в русское с помощью маппинга
  currentPlatformType = selectedPlatformType ? platformTypeMapping[selectedPlatformType] : '';
  currentPage = 1;
  clearCatalogContainer();
  await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
});

//--------------------------------------------------------------------------------------------------------


// Обработчик для фильтрации по особенностям
const filterFeatures = document.getElementById('filter_features');
filterFeatures.addEventListener('change', async () => {
  const selectedFeature = filterFeatures.value;
  currentFeature = selectedFeature ? featureMapping[selectedFeature] : '';
  currentPage = 1;
  clearCatalogContainer();
  await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
});

// Обработчик для фильтрации по вместимости
const filterCapacity = document.getElementById('filter_capacity');
filterCapacity.addEventListener('change', async () => {
  currentCapacityRange = filterCapacity.value;
  console.log('Фильтр стоимости:', currentCapacityRange);
  currentPage = 1;
  clearCatalogContainer();
  await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
});

// Обработчик для фильтрации по стоимости
const filterPrice = document.getElementById('filter_price');
filterPrice.addEventListener('change', async () => {
  currentPriceRange = filterPrice.value;
  console.log('Фильтр стоимости:', currentPriceRange);
  currentPage = 1;
  clearCatalogContainer();
  await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
});

// Обработчик для фильтрации по метро
const filterMore = document.getElementById('filter_more');
filterMore.addEventListener('change', async () => {
  const selectedMetro = filterMore.value;
  currentMetro = selectedMetro ? metroMapping[selectedMetro] : '';
  currentPage = 1;
  clearCatalogContainer();
  await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
});



// Инициализация
await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);