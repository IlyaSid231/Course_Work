import { fetchFavorites, fetchRestaurantsToFavorites} from '/js/api.js';
import { RenderRestaurants } from "/pages/catalog/js/render.js";
import { initializeEventHandlers, updatePagination } from './eventHandlers.js';
import { currentPage} from '/js/config.js';
import "/js/burger_menu.js";

document.addEventListener('DOMContentLoaded', async () => {
    await setupShowFavoritesRestaurants();
    replaceFavoritesImage();
});


async function setupShowFavoritesRestaurants(){

    const favoritesIds = await fetchFavorites();
    favoritesIds.sort((a, b) => a - b);
    
    const restaurantToRender = await fetchRestaurantsToFavorites(currentPage, favoritesIds);
    await RenderRestaurants(restaurantToRender);
    updatePagination();
    initializeEventHandlers(favoritesIds);
}


function replaceFavoritesImage(){
    const buttonFav = document.getElementById('header_favorite_button');
    buttonFav.src = "/resources/images/enable_favorite.svg";
    buttonFav.style.cursor = "not-allowed";
    buttonFav.enabled = false;
}