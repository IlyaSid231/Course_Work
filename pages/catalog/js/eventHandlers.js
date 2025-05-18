// eventHandlers.js
import {
    currentPage, totalItems, totalPages, currentSearchQuery, currentSortField, currentSortOrder,
    currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro,
    platformTypeMapping, featureMapping, metroMapping,
    setCurrentPage, setCurrentSearchQuery, setCurrentSortField, setCurrentSortOrder,
    setCurrentPlatformType, setCurrentFeature, setCurrentCapacityRange, setCurrentPriceRange, setCurrentMetro, 
    currentLanguage, setCurrentLanguage
  } from '/js/config.js';
  import { fetchRestaurants } from '/js/api.js';
  import { clearCatalogContainer, RenderRestaurants, updatePagination } from './render.js';
  
  // Функция загрузки данных
  export async function loadRestaurants(page, searchQuery = '', sortField = '', sortOrder = 'asc', platformType = '',
                                        feature = '', capacityRange = '', priceRange = '', metro = '') {
    const data = await fetchRestaurants(page, searchQuery, sortField, sortOrder, platformType, feature, capacityRange, priceRange, metro);
  
    const count = document.getElementById('total-count');
    const platform_text = document.getElementById('platform_form');
    count.textContent = totalItems; // Используем общее количество из X-Total-Count
  
    if (totalItems % 10 >= 5 || totalItems % 10 === 0) {
            platform_text.textContent = currentLanguage === "ru" ? " Площадок" : " Venues";
        } else if (totalItems % 10 === 1) {
            platform_text.textContent = currentLanguage === "ru" ? " Площадка" : " Venue";
        } else {
            platform_text.textContent = currentLanguage === "ru" ? " Площадки" : " Venues";
        }
  
    await RenderRestaurants(data);
    updatePagination();
  }
  
  // Навигация по страницам
  export function goToFirstPage() {
    if (currentPage !== 1) {
      setCurrentPage(1);
      loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    }
  }
  
  export function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    }
  }
  
  export function goToNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    }
  }
  
  export function goToLastPage() {
    if (currentPage !== totalPages) {
      setCurrentPage(totalPages);
      loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    }
  }
  
  // Инициализация обработчиков событий
  export function initializeEventHandlers() {
    // Пагинация
    document.getElementById('firstPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToFirstPage();
    });
    document.getElementById('prevPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToPreviousPage();
    });
    document.getElementById('nextPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToNextPage();
    });
    document.getElementById('lastPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToLastPage();
    });
  
    // Поиск с debounce
    const searchInput = document.querySelector('.search_input');
    let debounceTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(async () => {
        setCurrentSearchQuery(e.target.value.trim());
        setCurrentPage(1);
        await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
      }, 600);
    });
  
    //Arrows====
    const upArrow1 = document.getElementById('up-arrow-1');
    const upArrow2 = document.getElementById('up-arrow-2');
    const downArrow1 = document.getElementById('down-arrow-1');
    const downArrow2 = document.getElementById('down-arrow-2');
    
    // Сортировка
    const sortSelect = document.getElementById('sort_parameters');
    sortSelect.addEventListener('change', async (e) => {
      const selectedOption = e.target.value;
      let sortField = '';
      switch (selectedOption) {
        case 'price':
          sortField = 'average_price';
          break;
        case 'name':
          sortField = `title.${currentLanguage}`;
          break;
        case 'rating':
          sortField = 'rating';
          break;
        default:
          sortField = '';
      }

      //Set arrows on default state
      if(sortField === ''){
        upArrow1.style.display = 'inline';
        upArrow2.style.display = 'none';
        downArrow1.style.display = 'inline';
        downArrow2.style.display = 'none';
      }

      setCurrentSortField(sortField);
      setCurrentPage(1);
      await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    });
  
    // Порядок сортировки (asc desc)
    const sortOrderIcon = document.getElementById('sort-order-icon');
    sortOrderIcon.addEventListener('click', async () => {
      if (currentSortField) {
        setCurrentPage(1);
        const newSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
        setCurrentSortOrder(newSortOrder);
         if (newSortOrder === 'asc') {
            upArrow1.style.display = 'inline';
            upArrow2.style.display = 'inline';
            downArrow1.style.display = 'none';
            downArrow2.style.display = 'none';
        } else {
            upArrow1.style.display = 'none';
            upArrow2.style.display = 'none';
            downArrow1.style.display = 'inline';
            downArrow2.style.display = 'inline';
        }
        await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
      }
      else{
        upArrow1.style.display = 'inline';
        upArrow2.style.display = 'none';
        downArrow1.style.display = 'inline';
        downArrow2.style.display = 'none';
      }
    });
  
    // Фильтрация по категории
    const filterPlatformType = document.getElementById('filter_platform_type');
    filterPlatformType.addEventListener('change', async () => {
      const selectedPlatformType = filterPlatformType.value;
      setCurrentPlatformType(selectedPlatformType ? platformTypeMapping[currentLanguage]?.[selectedPlatformType] : '');
      setCurrentPage(1);
      await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    });
  
    // Фильтрация по особенностям
    const filterFeatures = document.getElementById('filter_features');
    filterFeatures.addEventListener('change', async () => {
      const selectedFeature = filterFeatures.value;
      setCurrentFeature(selectedFeature ? featureMapping[currentLanguage]?.[selectedFeature] : '');
      setCurrentPage(1);
      await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    });
  
    // Фильтрация по вместимости
    const filterCapacity = document.getElementById('filter_capacity');
    filterCapacity.addEventListener('change', async () => {
      setCurrentCapacityRange(filterCapacity.value);
      setCurrentPage(1);
      await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    });
  
    // Фильтрация по стоимости
    const filterPrice = document.getElementById('filter_price');
    filterPrice.addEventListener('change', async () => {
      setCurrentPriceRange(filterPrice.value);
      setCurrentPage(1);
      await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    });
  
    // Фильтрация по метро
    const filterMore = document.getElementById('filter_more');
    filterMore.addEventListener('change', async () => {
      const selectedMetro = filterMore.value;
      setCurrentMetro(selectedMetro ? metroMapping[currentLanguage]?.[selectedMetro] : '');
      setCurrentPage(1);
      await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
    });

    document.querySelectorAll('.languages_btn').forEach(btn => {
    btn.addEventListener('click',async (event) => {
      setCurrentLanguage(event.target.dataset.btn);
      const filterPlatformType = document.getElementById('filter_platform_type').value;
      setCurrentPlatformType(filterPlatformType ? platformTypeMapping[currentLanguage]?.[filterPlatformType] : '');
      const filterFeatures = document.getElementById('filter_features').value;
      setCurrentFeature(filterFeatures ? featureMapping[currentLanguage]?.[filterFeatures] : '');
      const filterMore = document.getElementById('filter_more').value;
      setCurrentMetro(filterMore ? metroMapping[currentLanguage]?.[filterMore] : '');
      await loadRestaurants(currentPage, currentSearchQuery, currentSortField, currentSortOrder, currentPlatformType, currentFeature, currentCapacityRange, currentPriceRange, currentMetro);
      });
    });
  }