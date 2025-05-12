// main.js
import {
  currentPage, currentSearchQuery, currentSortField, currentSortOrder,
  currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro,
  setCurrentPage, setCurrentSearchQuery,
  setCurrentPlatformType, setCurrentFeature, setCurrentCapacityRange, setCurrentPriceRange, setCurrentMetro,
  platformTypeMapping, featureMapping, metroMapping
} from '/js/config.js';
import { loadRestaurants, initializeEventHandlers } from './eventHandlers.js';

const urlParams = new URLSearchParams(window.location.search);

// Инициализация
(async () => {

  setCurrentPage(Number(urlParams.get('page')) || 1);

  setCurrentSearchQuery(urlParams.get('search') || '');

  const platformTypeFromUrl = urlParams.get('platform') || '';
  const selectedPlatformType = platformTypeMapping[platformTypeFromUrl] || '';
  setCurrentPlatformType(selectedPlatformType);


  const featureFromUrl = urlParams.get('feature') || '';
  const selectedFeature = featureMapping[featureFromUrl] || '';
  setCurrentFeature(selectedFeature);

  setCurrentCapacityRange(urlParams.get('capacity') || '');

  setCurrentPriceRange(urlParams.get('price') || '');

  const metroFromUrl = urlParams.get('metro') || '';
  const selectedMetro = metroMapping[metroFromUrl] || '';
  setCurrentMetro(selectedMetro);


  await loadRestaurants(
    currentPage, 
    currentSearchQuery, 
    currentSortField, 
    currentSortOrder, 
    currentPlatformType, 
    currentFeature, 
    currentCapacityRange, 
    currentPriceRange, 
    currentMetro);

  initializeEventHandlers();

})();

// Функция для восстановления значений фильтров
function restoreFiltersFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Восстанавливаем поисковую строку
  const searchInput = document.querySelector('.search_input');
  if (searchInput) {
    searchInput.value = urlParams.get('search') || '';
  }
  
  // Восстанавливаем выпадающие списки
  const setSelectValue = (elementId, value) => {
    const element = document.getElementById(elementId);
    if (element && value) {
      element.value = value;
    }
  };
  
  setSelectValue('filter_platform_type', urlParams.get('platform'));
  setSelectValue('filter_features', urlParams.get('feature'));
  setSelectValue('filter_capacity', urlParams.get('capacity'));
  setSelectValue('filter_price', urlParams.get('price'));
  setSelectValue('filter_more', urlParams.get('metro'));
}

document.addEventListener('DOMContentLoaded', restoreFiltersFromURL);