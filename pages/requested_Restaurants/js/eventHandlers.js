import { currentPage, totalPages, setCurrentPage, setCurrentLanguage } from '/js/config.js';
import { fetchRestaurantsToRequested } from '/js/api.js';
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

export async function goToFirstPage(requestedIds) {
    if (currentPage !== 1) {
      setCurrentPage(1);
      const restaurantToRender = await fetchRestaurantsToRequested(currentPage, requestedIds);
      RenderRestaurants(restaurantToRender);
      updatePagination();
    }
  }
  
  export async function goToPreviousPage(requestedIds) {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const restaurantToRender = await fetchRestaurantsToRequested(currentPage, requestedIds);
      RenderRestaurants(restaurantToRender);
      updatePagination();
    }
  }
  
  export async function goToNextPage(requestedIds) {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      const restaurantToRender = await fetchRestaurantsToRequested(currentPage, requestedIds);
      RenderRestaurants(restaurantToRender);
      updatePagination();
    }
  }
  
  export async function goToLastPage(requestedIds) {
    if (currentPage !== totalPages) {
      setCurrentPage(totalPages);
      const restaurantToRender = await fetchRestaurantsToRequested(currentPage, requestedIds);
      RenderRestaurants(restaurantToRender);
      updatePagination();
    }
  }

  export function initializeEventHandlers(requestedIds) {
    // Пагинация 
    document.getElementById('firstPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToFirstPage(requestedIds);
    });
    document.getElementById('prevPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToPreviousPage(requestedIds);
    });
    document.getElementById('nextPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToNextPage(requestedIds);
    });
    document.getElementById('lastPageBtn').addEventListener('click', () => {
      clearCatalogContainer();
      goToLastPage(requestedIds);
    });

    document.querySelectorAll('.languages_btn').forEach(btn => {
    btn.addEventListener('click',async (event) => {
      setCurrentLanguage(event.target.dataset.btn);
      const restaurantToRender = await fetchRestaurantsToRequested(currentPage, requestedIds);
      RenderRestaurants(restaurantToRender);
      });
    });
}