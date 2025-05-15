import { fetchUser, updateRequests } from './api.js';
import { errorMessages } from "/pages/registration/js/error_messages.js";
import IMask from '/node_modules/imask/esm/index.js';

const currentLanguage = localStorage.getItem('language') || "ru";

async function getMessage(params){
  let message;
  if(params==="addRequest"){
    message = {
      "ru": "Для оформления заявки необходимо войти в систему.",
      "en": "To submit an application, you must log in to the system"
    };
  }
  else if(params==="showRequests"){
    message = {
      "ru": "Для просмотра оставленных заявок необходимо войти в систему.",
      "en": "To view submitted requests, you must log in to the system."
    };
  }
  else if(params==="addFavorite"){
    message = {
      "ru": "Для добавления в избранное необходимо войти в систему.",
      "en": "To add to favorites you need to log in"
    };
  }
  else if(params==="user"){
     message = {
      "ru": "Войдите или зарегистрируйтесь для авторизации на сайте.",
      "en": "Log in or sign up to log in to the site."
    };
  }
  else if(params==="showFavorites"){
    message = {
      "ru": "Для просмотра избранных ресторанов необходимо войти в систему.",
      "en": "To view your favorite restaurants you must be logged in."
    };
  }
  else {
        // Обработка случая, если параметр неизвестен
        message = {
            "ru": "Неизвестный запрос.",
            "en": "Unknown request."
        };
      }
  return message;
}

export async function authorizationModalWindow(params) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const message = await getMessage(params);
    
    const modal = document.createElement('div');
    modal.className = 'modal modal_auth_window';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Требуется <span class="blue_text">авторизация</span></h3>
        <p>${message[currentLanguage]}</p>
        
        <div class="auth-buttons">
          <button id="loginBtn" class="auth-button login">Войти</button>
          <button id="registerBtn" class="auth-button register">Регистрация</button>
        </div>
      </div>
    `;
  
    // Добавление в DOM
    document.body.appendChild(overlay);
    overlay.appendChild(modal);
    document.body.style.overflow = 'hidden';
  
    // Обработчики кнопок
    document.getElementById('loginBtn').addEventListener('click', () => {
      document.body.style.overflow = '';
      window.location.href = "/pages/authorization/authorization.html";
    });
  
    document.getElementById('registerBtn').addEventListener('click', () => {
      document.body.style.overflow = '';
      window.location.href = "/pages/registration/registration.html";
    });
  
    // Закрытие модального окна
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        document.body.style.overflow = '';
      }
    });
  }


export async function createRequestModal(elementId, restaurantId, restaurantName, requests) {
  
  // Создание затемненного фона
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Создание самого модального окна
  const modal = document.createElement('div');
  modal.className = 'modal modal_request_window';
  modal.innerHTML = `
    <h3>ОСТАВИТЬ ЗАЯВКУ</h3>
    <p>Представитель площадки <span class="blue_text">${restaurantName}</span> свяжется с вами и организует просмотр удобным способом.</p>
    
    <form id="requestForm">
    <div class="input-group flex flex-direction-column align-center justify-center">
        <div class="form-group">
          <input type="text" id="modal_req_name_area" name="name" required placeholder="Ваше имя">
        </div>

        <div class="form-group">
          <input type="tel" id="phone" name="phone" required placeholder="Ваш номер телефона">
        </div>

        <div class="form-group">
          <input type="text" id="modal_req_question_area" name="question" maxlength="100" placeholder="Ваш вопрос (макс. 100 символов)">
        </div>
    </div>
        <button type="submit" class="sybmit_button">Отправить</button>
    </form>
    </form>
  `;

  // Добавляем в DOM
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  
  const currentUser = await fetchUser();
  console.log(currentUser);
  if (currentUser && currentUser != "unauthorized") {
    document.getElementById('modal_req_name_area').value = currentUser.username || '';
    document.getElementById('phone').value = currentUser.phone || '';
  }
  
  initializeMask();

  // Обработчик отправки формы
  modal.querySelector('#requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if(!checkValidation(this)){
      alert('Введенный номер некорректен! Попробуйте снова');
      overlay.remove();
      document.body.style.overflow = '';
    }
    const newRequest = {
      id:  requests.length > 0 ? Math.max(...requests.map(fav => fav.id)) + 1 : 1,
      username: currentUser.username,
      restaurantId: restaurantId,
      date: new Date().toISOString().split('T')[0],
      contactPhone: document.getElementById('phone').value,
      contactName: document.getElementById('modal_req_name_area').value,
      question: document.getElementById('modal_req_question_area').value
    };

    const updatedRequests = [...requests, newRequest];
    if(!(await updateRequests(updatedRequests))){
      alert('Ошибка, введены некорректные данные попробуйте еще раз!');
      overlay.remove();
      document.body.style.overflow = '';
      return;
    };


    //Обновляем стили и текст кнопки
    const element = document.getElementById(elementId);
    element.className = "leave_request_button_sent";
    element.textContent = 'Отозвать заявку';
    
    overlay.remove();
    document.body.style.overflow = '';
    alert('Заявка успешно оставлена!');
  });

  // Закрытие по клику на оверлей
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      document.body.style.overflow = '';
    }
  });
}


let mask;
const phoneInput = document.getElementById('phone');

function initializeMask() {
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput) {
    const maskOptions = {
      mask: '+{375} (00) 000-00-00',
      lazy: false
    };

    mask = IMask(phoneInput, maskOptions);
  } else {
    console.error("Элемент с id='phone' не найден.");
  }
}

function checkValidation() {

  let checkResult = true;

  // Проверяем, соответствует ли введенное значение маске
  if (!mask.masked.isComplete) {
    checkResult = false;
  }
  
  return checkResult;
}



