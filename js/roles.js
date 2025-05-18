"use strict";

import { fetchUser, fetchAllRestaurants, addRestaurant, updateRestaurant, deleteRestaurant } from "/js/api.js";
import { showError, checkValidation } from "./validation.js";
import { errorMessages } from "./error_messages.js";
import { editMask } from "./phone.js";

let restaurants = [];
let currentLanguage = localStorage.getItem("language") || "ru";
const user = await fetchUser();
const adminPanel = document.getElementById("admin-panel");
const secondSection = document.getElementById("second_section");

// Показываем/скрываем админ-панель
async function toggleAdminPanel() {
    if (user && user.role === "admin") {
        adminPanel.style.display = "block";
        secondSection.style.display = "none";
    } else {
        adminPanel.style.display = "none";
    }
}

// Открытие модального окна
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById("modal-overlay");
    modal.classList.add("admin-modal--visible");
    overlay.classList.add("modal-overlay--visible");
    document.body.classList.add("lock");
    modal.querySelectorAll("input").forEach(input_element => {
        if (input_element.id == "edit-phone" || input_element.id == "add-phone"){
            input_element.nextElementSibling.remove();
            input_element.classList.remove("field_error");
            return;
        }
        if (input_element.nextElementSibling && input_element.nextElementSibling.classList.contains('error_message')) {
            input_element.nextElementSibling.remove();
            input_element.classList.remove("field_error");
        }
        if(input_element.id === "edit-id"){
            const idSection = document.getElementById("id_section");
            if(idSection.nextElementSibling && idSection.nextElementSibling.classList.contains('error_message')){
                idSection.nextElementSibling.remove();
                idSection.classList.remove("field_error");
            }
        }
        input_element.value = '';
    })
}

// Закрытие модального окна
function closeModal() {
    const overlay = document.getElementById("modal-overlay");
    document.querySelectorAll(".admin-modal").forEach((modal) => modal.classList.remove("admin-modal--visible"));
    overlay.classList.remove("modal-overlay--visible");
    document.body.classList.remove("lock");
}


function setItem(inputs){
    const servicesToWrite = [];
    const ruServices = inputs[13].value.split(","); 
    const enServices = inputs[14].value.split(",");
    for (let i = 0; i < ruServices.length; i++) {
        servicesToWrite.push({
            ru: ruServices[i].trim(),
            en: enServices[i].trim()
        });
    }

    const featuresToWrite = [];
    const ruFeatures = inputs[15].value.split(","); 
    const enFeatures = inputs[16].value.split(",");
    for (let i = 0; i < ruFeatures.length; i++) {
        featuresToWrite.push({
            ru: ruFeatures[i].trim(),
            en: enFeatures[i].trim()
        });
    }

    const item = {
            id: 0,
            title: { ru: inputs[0].value, en: inputs[1].value },
            rating: parseFloat(inputs[2].value),
            reviews: parseInt(inputs[3].value),
            metro: { ru: inputs[4].value, en: inputs[5].value },
            address: { ru: inputs[6].value, en: inputs[7].value },
            working_hours: inputs[8].value,
            phone: inputs[9].value,
            type: { ru: inputs[10].value, en: inputs[11].value },
            capacity: inputs[12].value.split(",").map(Number),
            services: servicesToWrite,
            features: featuresToWrite,
            average_price: parseInt(inputs[17].value),
            menu_price: parseInt(inputs[18].value),
            rent_price: parseInt(inputs[19].value),
            images: inputs[20].value.split(","),
            number_of_halls: parseInt(inputs[21].value),
            area: inputs[22].value.split(",").map(Number),
    };
    return item;
}

// Обработка добавления товара
async function addRestaurantButton(){
    const inputs = [
        document.getElementById("add-title"),
        document.getElementById("add-title-en"),
        document.getElementById("add-rating"),
        document.getElementById("add-reviews"),
        document.getElementById("add-metro"),
        document.getElementById("add-metro-en"),
        document.getElementById("add-address"),
        document.getElementById("add-address-en"),
        document.getElementById("add-working-hours"),
        document.getElementById("add-phone"),
        document.getElementById("add-type"),
        document.getElementById("add-type-en"),
        document.getElementById("add-capacity"),
        document.getElementById("add-services"),
        document.getElementById("add-services-en"),
        document.getElementById("add-features"),
        document.getElementById("add-features-en"),
        document.getElementById("add-average-price"),
        document.getElementById("add-menu-price"),
        document.getElementById("add-rent-price"),
        document.getElementById("add-images"),
        document.getElementById("add-number-of-halls"),
        document.getElementById("add-area"),
    ];

    const item = setItem(inputs);

    const maxId = restaurants.reduce((max, restaurant) => {
        return restaurant.id > max ? restaurant.id : max;
    }, 0);

    item.id = maxId;
    

    await addRestaurant(item);
    restaurants = await fetchAllRestaurants();
    alert("Товар добавлен");
    inputs.forEach((input) => (input.value = ""));
    closeModal();
};


// EDITING______________________________________________
document.getElementById('find_rest_inf').addEventListener('click', async () => {
  const restaurantId = document.getElementById('edit-id').value;
  const idSection = document.getElementById('id_section');

  if (!restaurantId) {
    if(idSection.nextElementSibling && idSection.nextElementSibling.classList.contains('error_message')){
            idSection.nextElementSibling.remove();
    }
    showError(idSection, errorMessages["input_restaurant"][currentLanguage]);
    return;
  }

  try {

    const restaurant = getRestaurantById(restaurantId);
    
    if (!restaurant) {
      showError(idSection, errorMessages["not_found_restaurant"][currentLanguage]);
    return;
    }

    fillEditForm(restaurant);
    
  } catch (error) {
    console.error('Ошибка при поиске ресторана:', error);
    alert('Произошла ошибка при загрузке данных');
  }
});

// Функция для заполнения формы
function fillEditForm(restaurant) {
  // Основные поля
  document.getElementById('edit-title').value = restaurant.title.ru || '';
  document.getElementById('edit-title-en').value = restaurant.title.en || '';
  document.getElementById('edit-rating').value = restaurant.rating || '';
  document.getElementById('edit-reviews').value = restaurant.reviews || '';
  document.getElementById('edit-metro').value = restaurant.metro.ru || '';
  document.getElementById('edit-metro-en').value = restaurant.metro.en || '';
  document.getElementById('edit-address').value = restaurant.address.ru || '';
  document.getElementById('edit-address-en').value = restaurant.address.en || '';
  document.getElementById('edit-working-hours').value = restaurant.working_hours || '';

    const phoneInput = document.getElementById('edit-phone');
    phoneInput.value = restaurant.phone || '';

    if (editMask) {
        editMask.masked.value = phoneInput.value; 
    }

  document.getElementById('edit-type').value = restaurant.type.ru || '';
  document.getElementById('edit-type-en').value = restaurant.type.en || '';
  
  // Массивы и объекты
  document.getElementById('edit-capacity').value = restaurant.capacity?.join(',') || '';
  document.getElementById('edit-average-price').value = restaurant.average_price || '';
  document.getElementById('edit-menu-price').value = restaurant.menu_price || '';
  document.getElementById('edit-rent-price').value = restaurant.rent_price || '';
  document.getElementById('edit-images').value = restaurant.images?.join(',') || '';
  document.getElementById('edit-number-of-halls').value = restaurant.number_of_halls || '';
  document.getElementById('edit-area').value = restaurant.area?.join(',') || '';
  
  // Обработка услуг и особенностей
  const servicesRu = restaurant.services?.map(s => s.ru).join(',') || '';
  const servicesEn = restaurant.services?.map(s => s.en).join(',') || '';
  document.getElementById('edit-services').value = servicesRu;
  document.getElementById('edit-services-en').value = servicesEn;
  
  const featuresRu = restaurant.features?.map(f => f.ru).join(',') || '';
  const featuresEn = restaurant.features?.map(f => f.en).join(',') || '';
  document.getElementById('edit-features').value = featuresRu;
  document.getElementById('edit-features-en').value = featuresEn;
}

function getRestaurantById(id) {
  try {
    const restaurant = restaurants.find(res => res.id === parseInt(id, 10));
    return restaurant || null;
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return null;
  }
}

async function sudmitEditedRestaurant(){
    const id = parseInt(document.getElementById("edit-id").value);
    const inputs = [
        document.getElementById("edit-title"),
        document.getElementById("edit-title-en"),
        document.getElementById("edit-rating"),
        document.getElementById("edit-reviews"),
        document.getElementById("edit-metro"),
        document.getElementById("edit-metro-en"),
        document.getElementById("edit-address"),
        document.getElementById("edit-address-en"),
        document.getElementById("edit-working-hours"),
        document.getElementById("edit-phone"),
        document.getElementById("edit-type"),
        document.getElementById("edit-type-en"),
        document.getElementById("edit-capacity"),
        document.getElementById("edit-services"),
        document.getElementById("edit-services-en"),
        document.getElementById("edit-features"),
        document.getElementById("edit-features-en"),
        document.getElementById("edit-average-price"),
        document.getElementById("edit-menu-price"),
        document.getElementById("edit-rent-price"),
        document.getElementById("edit-images"),
        document.getElementById("edit-number-of-halls"),
        document.getElementById("edit-area"),
    ];
    const item = setItem(inputs);
    item.id = id;
    await updateRestaurant(item);
    restaurants = await fetchAllRestaurants();
    alert("Ресторан обновлен!");
    closeModal();
}


// DELETE______________________
async function deleteChoozenRestaurant(){
    const id = parseInt(document.getElementById("delete-id").value);
    await deleteRestaurant(id);
    restaurants = await fetchAllRestaurants();
    alert("Товар удален");
    document.getElementById("delete-id").value = "";
    closeModal();
}


// REMOVE LOCAL STORAGE _______________________________________

function removeLocalStorage(){
    const currentUserName = localStorage.getItem('currentUserName');

var checkBox_1 = document.querySelector(".switch");
    const event = new Event('change');
    checkBox_1.dispatchEvent(event);
    document.documentElement.classList.remove('dark');
    document.querySelector(".switch input").checked = false;
    document.getElementById("header_favorite_button").style.filter = "brightness(1)";
    document.getElementById("header_request_button").style.filter = "brightness(1)";
    document.getElementById("header_user_button").style.filter = "brightness(1)";
    document.getElementById("blind_version_btn").style.filter = "brightness(1)";
    document.getElementById("header_logo_image").style.filter = "brightness(1)";
    document.getElementById("footer_logo_image").style.filter = "brightness(1)";

    // Очищаем localStorage
    localStorage.clear();

    // Восстанавливаем значение currentUserName
    if (currentUserName) {
        localStorage.setItem('currentUserName', currentUserName);
    }

    const currentLanguage = 'ru';
    const langButtons = document.querySelectorAll("[data-btn]");

    function setNeedBtn() {
    langButtons.forEach(item => {
            if (item.dataset.btn == currentLanguage) {
                item.style.display = "none"
            }
            else {
                item.style.display = "block"
            }
        })
    }

    setNeedBtn();

}








// Активация кнопок при валидных данных___________________________________

["add-submit", "edit-submit"].forEach((id) => {
    const button = document.getElementById(id);
    const buttonSection = button.parentNode;
    const inputs = buttonSection.parentElement.querySelectorAll("input");
    button.addEventListener("click", async () => {
            if (checkValidation(inputs)) 
            {
                if (id === "add-submit") 
                {
                    addRestaurantButton();
                }
                if (id === "edit-submit") 
                {
                   sudmitEditedRestaurant();
                }
            } 
            else 
            {
                alert('Recheck interanced value');
            }
        });
});

document.getElementById('delete-submit').addEventListener('click', async () => {
    const deleteInput =  document.getElementById('delete-id');
    const restaurantId = deleteInput.value;

    if (!restaurantId) {
        if (deleteInput.nextElementSibling && deleteInput.nextElementSibling.classList.contains('error_message')) {
            deleteInput.nextElementSibling.remove();
        }
        showError(deleteInput, errorMessages["input_restaurant"][currentLanguage]);
        return;
    }

    try {

        const restaurant = getRestaurantById(restaurantId);
        
        if (!restaurant) {
            if (deleteInput.nextElementSibling && deleteInput.nextElementSibling.classList.contains('error-message')) {
                deleteInput.nextElementSibling.remove();
            }
            showError(deleteInput, errorMessages["not_found_restaurant"][currentLanguage]);
            return;
        }

        deleteChoozenRestaurant();

    } catch (error) {
        console.error('Ошибка при поиске ресторана:', error);
        alert('Произошла ошибка при загрузке данных');
    }
});


// ________________________________________________________________________







// Обработчики открытия и закрытия модальных окон
document.querySelectorAll(".admin-action-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        if(btn.id != "addAdmin"){
            const modalId = btn.getAttribute("data-modal");
            openModal(`${modalId}-modal`);
        }
    });
});

document.querySelectorAll(".close-button").forEach((btn) => {
    btn.addEventListener("click", closeModal);
});

document.getElementById("modal-overlay").addEventListener("click", (e) => {
    if (e.target === document.getElementById("modal-overlay")) {
        closeModal();
    }
});

// Инициализация
(async () => {
    await toggleAdminPanel();
    restaurants = await fetchAllRestaurants();

    document.getElementById('addAdmin').addEventListener('click', () => {
        window.location.href = '/pages/registration/registration.html';
    });
    document.getElementById('clearLocalStorage').addEventListener('click', () => {
        removeLocalStorage();
    });
})();