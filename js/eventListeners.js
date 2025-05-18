// pages/catalog/js/eventListeners.js
import { hostServer } from './config.js';
import { updateFavorites, fetchFavorites, fetchRequests, updateRequests, fetchUser, fetchAllRestaurants} from './api.js';
import { getCurrentUserName } from './authentication.js';
import { authorizationModalWindow, createRequestModal } from './modal.js';

// Обработчик для добавления/удаления из избранного
export function setupFavoriteListener(elementId, restaurantId) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.addEventListener('click', async () => {
    
    try {
      const currentUserName = getCurrentUserName();
      
      if (!currentUserName || currentUserName === "unauthorized") {
        authorizationModalWindow("addFavorite");
        return;
      }

      const response = await fetch(`${await hostServer}/favorites`);
      const allFavorites = await response.json();

      const userFavorites = allFavorites.filter(fav => fav.username === currentUserName);
      const isFavorite = userFavorites.some(fav => fav.restaurantId === restaurantId);
    
    let updatedFavorites;
      if (isFavorite) {
        updatedFavorites = allFavorites.filter(
          fav => !(fav.username === currentUserName && fav.restaurantId === restaurantId)
        );
      } else {
        const newFavorite = {
          id: allFavorites.length > 0 ? Math.max(...allFavorites.map(fav => fav.id)) + 1 : 1,
          username: currentUserName,
          restaurantId: restaurantId
        };
        updatedFavorites = [...allFavorites, newFavorite];
      }

      if (await updateFavorites(updatedFavorites)) {
        element.style.backgroundImage = isFavorite 
        ? 'url("/resources/images/disable_favorite.svg")' 
        : 'url("/resources/images/enable_favorite.svg")';
        //...
      }
    }
    catch (error) {
      console.error('Ошибка при работе с избранным:', error);
      alert('Не удалось обновить избранное. Проверьте сервер или авторизацию.');
    }
  });
}

// Обработчик для оставления заявки__________________________________________________
export function setupRequestListener(elementId, restaurantId, restaurantName) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.addEventListener('click', async () => {
    try {
      const requests = await fetchRequests();
      const user = await fetchUser();

      // Проверка авторизации
      if (!user || user === "unauthorized") {
        authorizationModalWindow("addRequest");
        return;
      }
      
      const userRequestForRestaurant = requests.filter(
        req => String(req.username) === String(user.username) && req.restaurantId === Number(restaurantId)
      );

      console.log(userRequestForRestaurant);
      
      if (userRequestForRestaurant.length === 0) 
      {
        // Если заявки нет - показываем модальное окно
        createRequestModal(elementId, restaurantId, restaurantName, requests);
      } 
      else 
      {

        const shouldDelete = confirm('Вы действительно хотите отменить заявку на просмотр этого ресторана?');
        
        if (shouldDelete) {
          // Удаляем заявку
          const updatedRequests = requests.filter(
            req => !(req.username === user.username && req.restaurantId === restaurantId)
          );
          
          const success = await updateRequests(updatedRequests);
          
          if (success) {
            alert('Заявка успешно отменена!');
            element.className = "leave_request_button";
            element.textContent = 'Оставить заявку';
          } else {
            alert('Не удалось отменить заявку');
          }
        }
      }
    } catch (error) {
      console.error('Ошибка при обработке заявки:', error);
      alert('Произошла ошибка при обработке запроса');
    }
  });
}


export function setupDetailedButtons(buttonId, restaurant) {
  const button = document.getElementById(buttonId);
  if (!button) return;
  button.addEventListener('click', () => {

  // Сохраняем данные ресторана в sessionStorage
  sessionStorage.setItem('currentRestaurant', JSON.stringify(restaurant));
 
  window.location.href = '../restaurantDetails/restaurant-details.html';
  });
}



export async function initializeNavigationButtonsFromHeader(){

  const currentUserName = getCurrentUserName();

  const headerFavoriteButton = document.getElementById('header_favorite_button');
  headerFavoriteButton.addEventListener('click', async () => {

    if (!currentUserName || currentUserName === "unauthorized") {
        authorizationModalWindow("showFavorites");
        return;
      }
    window.location.href = '/pages/favorites_Restaurants/favorites-restaurants.html';

  })

  const headerRequestButton = document.getElementById('header_request_button');
  headerRequestButton.addEventListener('click', () => {
    if (!currentUserName || currentUserName === "unauthorized") {
        authorizationModalWindow("showRequests");
        return;
      }

    window.location.href = '/pages/requested_Restaurants/requested-restaurants.html';

  })

  const headerUserButton = document.getElementById('header_user_button');
  if(currentUserName && currentUserName != "unauthorized"){
    headerUserButton.src = "/resources/header_icons/exit.svg";
  }
  headerUserButton.addEventListener('click', () => {
    if (!currentUserName || currentUserName === "unauthorized") {
        authorizationModalWindow("user");
        return;
      }
    else{
      const shouldDelete = confirm('Вы действительно хотите выйти?');
      if(shouldDelete){
        localStorage.removeItem('currentUserName');
        window.location.href = '/';
      }
    }
  })

  
  document.getElementById("homeLink").addEventListener("click", function() {
    if (window.location.pathname === '/') {
        return;
    }
    window.location.href = '/';
  });

  document.getElementById("contactsLink").addEventListener("click", function() {
      document.querySelector("footer").scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById("aboutLink").addEventListener("click", function() {
      window.location.href = '/pages/aboutUs/aboutUs.html';
  });

  document.getElementById("blind_version_btn").addEventListener('click', function(){
    if (window.location.pathname === '/') {
        return;
    }
    window.location.href = '/';
  });

}