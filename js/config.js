// config.js
export const hostServer = (async () => {
    const response = await fetch('../../../hostServer.json');
    const hostServerJSON = await response.json();
    return hostServerJSON.localhost_path;
  })();
  
  
  // Параметры пагинации
  export let currentPage = 1;
  export const limit = 5; // Количество элементов на странице
  export let totalItems = 0; // Общее количество залов
  export let totalPages = 1;
  export let currentSearchQuery = '';
  export let currentSortField = ''; // Текущий критерий сортировки (поле)
  export let currentSortOrder = 'asc'; // Текущий порядок сортировки (asc/desc)
  export let currentPlatformType = ''; // Текущая выбранная категория ресторана
  export let currentFeature = ''; // Текущая выбранная особенность
  export let currentCapacityRange = ''; // Текущий диапазон вместимости
  export let currentPriceRange = ''; // Текущий диапазон стоимости
  export let currentMetro = ''; // Текущая выбранная станция метро
  export let currentLanguage = localStorage.getItem('language') || 'ru';
  
//Маппинги -----------------------------
export const platformTypeMapping = {
  en: {
    conference_hall: 'Conference Hall',
    loft: 'Loft',
    banquet_hall: 'Banquet Hall',
    rooftop_deck: 'Rooftop Deck',
    manor: 'Manor',
    theater_hall: 'Theater Hall',
    greenhouse: 'Greenhouse',
    club_hall: 'Club Hall'
  },
  ru: {
    conference_hall: 'Конференц-зал',
    loft: 'Лофт',
    banquet_hall: 'Банкетный зал',
    rooftop_deck: 'Площадка на крыше',
    manor: 'Усадьба',
    theater_hall: 'Театральный зал',
    greenhouse: 'Оранжерея',
    club_hall: 'Клубный зал'
  }
};

export const featureMapping = {
  en: {
    parking: 'Parking',
    vip: 'VIP',
    fireplace: 'Fireplace',
    terrace: 'Terrace',
    wifi: 'Wi-Fi'
  },
  ru: {
    parking: 'Парковка',
    vip: 'VIP',
    fireplace: 'Камин',
    terrace: 'Терраса',
    wifi: 'Wi-Fi'
  }
};

export const metroMapping = {
  en: {
    sokolniki: 'Sokolniki',
    mayakovskaya: 'Mayakovskaya',
    cutuzovskaya: 'Kutuzovskaya'
  },
  ru: {
    sokolniki: 'Сокольники',
    mayakovskaya: 'Маяковская',
    cutuzovskaya: 'Кутузовская'
  }
};
//------------------------------------------

  // Функции для обновления глобальных переменных
  export function setCurrentPage(page) {
    currentPage = page;
  }
  
  export function setTotalItems(items) {
    totalItems = items;
  }
  
  export function setTotalPages(pages) {
    totalPages = pages;
  }
  
  export function setCurrentSearchQuery(query) {
    currentSearchQuery = query;
  }
  
  export function setCurrentSortField(field) {
    currentSortField = field;
  }
  
  export function setCurrentSortOrder(order) {
    currentSortOrder = order;
  }
  
  export function setCurrentPlatformType(type) {
    currentPlatformType = type;
  }
  
  export function setCurrentFeature(feature) {
    currentFeature = feature;
  }
  
  export function setCurrentCapacityRange(range) {
    currentCapacityRange = range;
  }
  
  export function setCurrentPriceRange(range) {
    currentPriceRange = range;
  }
  
  export function setCurrentMetro(metro) {
    currentMetro = metro;
  }

  export function setCurrentLanguage(language){
    localStorage.setItem('language', language);
    currentLanguage = language;
  }