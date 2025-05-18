
import { fetchRestaurantsIdFromRequests, fetchRestaurantsToRequested} from '/js/api.js';
import { RenderRestaurants } from "/pages/catalog/js/render.js";
import { initializeEventHandlers, updatePagination } from './eventHandlers.js';
import { currentPage} from '/js/config.js';
import "/js/burger_menu.js"

document.addEventListener('DOMContentLoaded', async () => {
    await setupShowRequestedRestaurants();
    replaceRequestedImage();
});


async function setupShowRequestedRestaurants(){

    const requestedIds = await fetchRestaurantsIdFromRequests();
    requestedIds.sort((a, b) => a - b);
    
    const restaurantToRender = await fetchRestaurantsToRequested(currentPage, requestedIds);
    await RenderRestaurants(restaurantToRender);
    updatePagination();
    initializeEventHandlers(requestedIds);
}


function replaceRequestedImage(){
    const buttonReq = document.getElementById('header_request_button');
    buttonReq.style.filter = "brightness(4)";
    buttonReq.style.cursor = "not-allowed";
    buttonReq.enables = false;
}

