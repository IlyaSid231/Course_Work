// main.js
import {
  currentPage, currentSearchQuery, currentSortField, currentSortOrder,
  currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro,
  setCurrentPage, setCurrentSearchQuery,
  setCurrentPlatformType, setCurrentFeature, setCurrentCapacityRange, setCurrentPriceRange, setCurrentMetro,
  platformTypeMapping, featureMapping, metroMapping, currentLanguage
} from '/js/config.js';
import { loadRestaurants, initializeEventHandlers } from './eventHandlers.js';

import '/js/burger_menu.js';


const urlParams = new URLSearchParams(window.location.search);
const language = currentLanguage; 

function cleanURL() {
    const cleanPath = window.location.pathname;
    window.history.replaceState({}, document.title, cleanPath);
}

// Инициализация
async function Initialize(){
  
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
  
};

// Функция для восстановления значений фильтров
function restoreFiltersFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.toString() === '') {
    return;
  }
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

function applyFiltersFromURL(){
  setCurrentPage(Number(urlParams.get('page')) || 1);

  setCurrentSearchQuery(urlParams.get('search') || '');

  const platformTypeFromUrl = urlParams.get('platform') || '';
  const selectedPlatformType = platformTypeMapping[language]?.[platformTypeFromUrl] || '';
  setCurrentPlatformType(selectedPlatformType);


  const featureFromUrl = urlParams.get('feature') || '';
  const selectedFeature = featureMapping[language]?.[featureFromUrl] || '';
  setCurrentFeature(selectedFeature);

  setCurrentCapacityRange(urlParams.get('capacity') || '');

  setCurrentPriceRange(urlParams.get('price') || '');

  const metroFromUrl = urlParams.get('metro') || '';
  const selectedMetro = metroMapping[language]?.[metroFromUrl] || '';
  setCurrentMetro(selectedMetro);
}

document.addEventListener('DOMContentLoaded',() =>{
  restoreFiltersFromURL();
  applyFiltersFromURL();
  Initialize();
  cleanURL();
});


// Получаем элементы
const filterTrigger = document.querySelector('.filter_trigger');
const filterContainer = document.querySelector('.filter_container');
const filterOverflow = document.querySelector('.filter_overflow');
const body = document.body;
const menu = document.querySelector('.body_menu');
const menuButton = document.querySelector('.menu_icon');

// Проверяем наличие элементов
if (filterTrigger && filterContainer) {
    // Обработчик клика по иконке воронки
    filterTrigger.addEventListener('click', () => {
        const isExpanded = filterTrigger.getAttribute('aria-expanded') === 'true';
        filterContainer.classList.toggle('active'); // Переключаем видимость
        filterTrigger.setAttribute('aria-expanded', !isExpanded); // Обновляем состояние доступности


        if (isExpanded) {
            filterOverflow.classList.remove('show'); // Убираем класс, если контейнер закрыт
            body.classList.remove('lock');
        } else {
            filterOverflow.classList.add('show'); // Добавляем класс, если контейнер открыт
            body.classList.toggle('lock');
        }
    });

    // Закрытие контейнера при выборе фильтра
    filterContainer.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            filterContainer.classList.remove('active');
            filterTrigger.setAttribute('aria-expanded', 'false');
            filterOverflow.classList.remove('show');
            body.classList.remove('lock');
        });
    });

    // Закрытие при клике вне контейнера
document.addEventListener('click', (event) => {
    // Проверяем, открыты ли фильтры в данный момент
    const isFiltersOpen = filterContainer.classList.contains('active') || 
                         filterTrigger.getAttribute('aria-expanded') === 'true';
    
    // Если фильтры закрыты - ничего не делаем
    if (!isFiltersOpen) return;

    // Элементы бургер-меню, которые нужно игнорировать
    const burgerElements = [
        document.querySelector('.body_menu'),
        document.querySelector('.menu_icon'),
        document.querySelector('.menu_overflow')
    ].filter(Boolean);
    
    // Проверяем, был ли клик вне фильтров и не по элементам бургер-меню
    const isClickOutsideFilters = !filterContainer.contains(event.target) && 
                                !filterTrigger.contains(event.target);
    
    const isClickInsideBurger = burgerElements.some(element => 
        element.contains(event.target)
    );
    
    if (isClickOutsideFilters && !isClickInsideBurger) {
        filterContainer.classList.remove('active');
        filterTrigger.setAttribute('aria-expanded', 'false');
        if (filterOverflow) filterOverflow.classList.remove('show');
        body.classList.remove('lock');
    }
});

    // Предотвращение закрытия при клике внутри контейнера
    filterContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}