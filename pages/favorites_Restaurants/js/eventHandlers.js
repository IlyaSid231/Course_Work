import { currentPage, totalPages, setCurrentPage, setCurrentLanguage } from '/js/config.js';
import { fetchRestaurantsToFavorites } from '/js/api.js';
import { RenderRestaurants, clearCatalogContainer } from "/pages/catalog/js/render.js";

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

export async function goToFirstPage(favoritesIds) {
    if (currentPage !== 1) {
      setCurrentPage(1);
      const restaurantToRender = await fetchRestaurantsToFavorites(currentPage, favoritesIds);
      RenderRestaurants(restaurantToRender);
      updatePagination();
    }
  }
  
  export async function goToPreviousPage(favoritesIds) {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const restaurantToRender = await fetchRestaurantsToFavorites(currentPage, favoritesIds);
      RenderRestaurants(restaurantToRender);
      updatePagination();
    }
  }
  
  export async function goToNextPage(favoritesIds) {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      const restaurantToRender = await fetchRestaurantsToFavorites(currentPage, favoritesIds);
      RenderRestaurants(restaurantToRender);
      updatePagination();
    }
  }
  
  export async function goToLastPage(favoritesIds) {
    if (currentPage !== totalPages) {
      setCurrentPage(totalPages);
      const restaurantToRender = await fetchRestaurantsToFavorites(currentPage, favoritesIds);
      RenderRestaurants(restaurantToRender);
      updatePagination();
    }
  }

  export function initializeEventHandlers(favoritesIds) {
    // Пагинация 
    document.getElementById('firstPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToFirstPage(favoritesIds);
    });
    document.getElementById('prevPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToPreviousPage(favoritesIds);
    });
    document.getElementById('nextPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToNextPage(favoritesIds);
    });
    document.getElementById('lastPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToLastPage(favoritesIds);
    });

    document.querySelectorAll('.languages_btn').forEach(btn => {
    btn.addEventListener('click',async (event) => {
      setCurrentLanguage(event.target.dataset.btn);
      const restaurantToRender = await fetchRestaurantsToFavorites(currentPage, favoritesIds);
      RenderRestaurants(restaurantToRender);
      });
    });
}