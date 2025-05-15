// api.js
import { hostServer, limit, setTotalItems, setTotalPages } from './config.js';
import { getCurrentUserName } from './authentication.js';
import { currentLanguage } from './config.js';



export async function fetchAllRestaurants(){
  try{
    const url = `${await hostServer}/restaurants`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return [];
  }
}

// Функция для получения данных с сервера с пагинацией
export async function fetchRestaurants(page, searchQuery = '', sortField = '', sortOrder = 'asc', platformType = '',
                                       feature = '', capacityRange = '', priceRange = '', metro = '') {
  try {
    
    let url = `${await hostServer}/restaurants?_page=${page}&_limit=${limit}`;

    // Поиск
    if (searchQuery) {
      url += `&q=${encodeURIComponent(searchQuery)}`;
    }

    // Сортировка
    if (sortField) {
      url += `&_sort=${sortField}&_order=${sortOrder}`;
    }

    // Тип платформы
    if (platformType) {
      url += `&type.${currentLanguage}=${encodeURIComponent(platformType)}`;
    }

    // Фильтр по особенностям
    if (feature) {
      url += `&feature=${encodeURIComponent(feature)}&language=${currentLanguage}`;
    }

    // Фильтр по вместимости
    if (capacityRange) {
      url += `&capacityRange=${capacityRange}`;
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
      url += `&metro.${currentLanguage}_like=${encodeURIComponent(metro)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Получаем общее количество элементов из заголовка X-Total-Count
    const newTotalItems = parseInt(response.headers.get('X-Total-Count'), 10) || 0;
    setTotalItems(newTotalItems);
    setTotalPages(Math.ceil(newTotalItems / limit));

    return data;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return [];
  }
}

export async function fetchRestaurantsToFavorites(page, favoritesIds) {
  try {
    
    let url = `${await hostServer}/restaurants?_page=${page}&_limit=${limit}`;

    if (favoritesIds && favoritesIds.length > 0) {
    url += `&favoriteIds=${favoritesIds.join(',')}`; 
    }

    const response = await fetch(url);
    const data = await response.json();


    const newTotalItems = parseInt(response.headers.get('X-Total-Count'), 10) || 0;
    setTotalItems(newTotalItems);
    setTotalPages(Math.ceil(newTotalItems / limit));
    
    return data;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return [];
  }
}

export async function fetchRestaurantsToRequested(page, requestedIds) {
  try {
    
    let url = `${await hostServer}/restaurants?_page=${page}&_limit=${limit}`;

    if (requestedIds && requestedIds.length > 0) {
    url += `&requestedIds=${requestedIds.join(',')}`;
    }

    const response = await fetch(url);
    const data = await response.json();


    const newTotalItems = parseInt(response.headers.get('X-Total-Count'), 10) || 0;
    setTotalItems(newTotalItems);
    setTotalPages(Math.ceil(newTotalItems / limit));
    
    return data;
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    return [];
  }
}


//Методы для работы с избранным_____________________________________
export async function fetchFavorites() {
  const response = await fetch(`${await hostServer}/favorites`);
  const data = await response.json();
  const currentUserName = getCurrentUserName();
  if(currentUserName === "unauthorized"){
    return [];
  }
  const userFavorites = data
    .filter(fav => fav.username === currentUserName)
    .map(fav => fav.restaurantId);
  return userFavorites;
}

export async function updateFavorites(favorites) {
  // console.log('Отправка PUT-запроса на:', `${await hostServer}/favorites`, 'с данными:', favorites);
  const response = await fetch(`${await hostServer}/favorites`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorites)
  });
  if (!response.ok) {
    throw new Error(`Ошибка обновления favorites: ${response.statusText}`);
  }
  return response.ok;
}

//_________________________________________________________________


//Методы для работы с оставленными заявками_______________________________
export async function fetchRestaurantsIdFromRequests() {
  const response = await fetch(`${await hostServer}/requests`);
  const data = await response.json();
  const currentUserName = getCurrentUserName();
  if(currentUserName === "unauthorized"){
    return [];
  }
  const userRequests = data
    .filter(req => req.username === currentUserName)
    .map(req => req.restaurantId);
  return userRequests;
}

export async function fetchRequests() {
  const response = await fetch(`${await hostServer}/requests`);
  const data = await response.json();
  return data;
}

export async function updateRequests(requests) {
  console.log('Отправка PUT-запроса на:', `${await hostServer}/requests`, 'с данными:', requests);
  const response = await fetch(`${await hostServer}/requests`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requests)
  });
  return response.ok;
}
//___________________________________________________________________


//Методы добавления, редактирования и удаления ресторанов__________________

//ДОБАВЛЕНИЕ
export async function addRestaurant(restaurantData) {
  const endpoint = `${await hostServer}/restaurants`;
  console.log('Отправка POST-запроса на:', endpoint, 'с данными:', restaurantData);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurantData)
    });
    
    if (!response.ok) {
      console.error('Ошибка при добавлении ресторана:', response.status);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Сетевая ошибка при добавлении ресторана:', error);
    return false;
  }
}

//ИЗМЕНЕНИЕ
export async function updateRestaurant(restaurantData) {
  const endpoint = `${await hostServer}/restaurants/${restaurantData.id}`;
  console.log('Отправка PUT-запроса на:', endpoint, 'с данными:', restaurantData);
  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(restaurantData)
    });
    
    if (!response.ok) {
      console.error('Ошибка при обновлении ресторана:', response.status);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Сетевая ошибка при обновлении ресторана:', error);
    return false;
  }
}

//УДАЛЕНИЕ
export async function deleteRestaurant(restaurantId) {
  const endpoint = `${await hostServer}/restaurants/${restaurantId}`;
  console.log('Отправка DELETE-запроса на:', endpoint);
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      console.error('Error deleting restaurant', response.status);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Сетевая ошибка при удалении ресторана:', error);
    return false;
  }
}




//Методы для работы с пользователями__________________________________________
export async function fetchUsers() {
  const response = await fetch(`${await hostServer}/users`);
  const data = await response.json();
  return data;
}

export async function fetchUser() {
  const userName = getCurrentUserName();
  
  if (userName === "unauthorized"){
    return "unauthorized";
  }

  try {
    const response = await fetch(`${await hostServer}/users?username=${userName}`); // Запрашиваем конкретного пользователя по username
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Пользователь не найден
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const user = await response.json();
    return user[0];
  } catch (error) {
    console.error("Error fetching user:", error);
    return null; // Или выбросить ошибку
  }
}

export async function updateUsers(users) {

  console.log("users:" + users);
  const response = await fetch(`${await hostServer}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(users), // Отправляем массив users
  });

  if (!response.ok) {
    throw new Error(`Ошибка HTTP: ${response.status}`);
  }
  return response.ok;
}