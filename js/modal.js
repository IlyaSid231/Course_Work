import { fetchUser, updateRequests } from './api.js';
import IMask from '/node_modules/imask/esm/index.js';
import { modalText } from '/js/texts.js';

let currentLanguage = localStorage.getItem('language') || "ru";

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
    currentLanguage = localStorage.getItem('language') || "ru";
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    const message = await getMessage(params);
    
    const modal = document.createElement('div');
    modal.className = 'modal modal_auth_window';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>${modalText["required_text"][currentLanguage]}<span class="blue_text">${modalText["authorization_text"][currentLanguage]}</span></h3>
        <p>${message[currentLanguage]}</p>
        
        <div class="auth-buttons">
          <button id="loginBtn" class="auth-button login">${modalText["authorization_button"][currentLanguage]}</button>
          <button id="registerBtn" class="auth-button register">${modalText["registration_text"][currentLanguage]}</button>
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
  currentLanguage = localStorage.getItem('language') || "ru";
  // Создание затемненного фона
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  
  // Создание самого модального окна
  const modal = document.createElement('div');
  modal.className = 'modal modal_request_window';
  modal.innerHTML = `
    <h3>${modalText["leaveRequest_text"][currentLanguage]}</h3>
    <p>${modalText["platform_representative"][currentLanguage]} <span class="blue_text">${restaurantName[currentLanguage]}&nbsp;</span> ${modalText["connect_text"][currentLanguage]}</p>
    
    <form id="requestForm">
    <div class="input-group flex flex-direction-column align-center justify-center">
        <div class="form-group">
          <input type="text" id="modal_req_name_area" name="name" required placeholder="${modalText["modal_req_name_placeholder"][currentLanguage]}">
        </div>

        <div class="form-group">
          <input type="tel" id="phone" name="phone" required placeholder="${modalText["modal_req_phone_placeholder"][currentLanguage]}">
        </div>

        <div class="form-group">
          <input type="text" id="modal_req_question_area" name="question" maxlength="100" placeholder="${modalText["modal_req_question_placeholder"][currentLanguage]}">
        </div>
    </div>
        <button type="submit" class="sybmit_button">${modalText["submit_button_text"][currentLanguage]}</button>
    </form>
    </form>
  `;

  // Добавляем в DOM
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  
  const currentUser = await fetchUser();
  if (currentUser && currentUser != "unauthorized") {
    document.getElementById('modal_req_name_area').value = currentUser.username || '';
    document.getElementById('phone').value = currentUser.phone || '';
  }
  
  initializeMask();

  // Обработчик отправки формы
  modal.querySelector('#requestForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const messages = {
      ru: {
        incorrectNumber: 'Введенный номер некорректен! Попробуйте снова',
        invalidData: 'Ошибка, введены некорректные данные! Попробуйте еще раз',
        successfulSubmission: 'Заявка успешно оставлена!',
      },
      en: {
          incorrectNumber: 'The entered number is incorrect! Please try again',
          invalidData: 'Error, invalid data entered! Please try again',
          successfulSubmission: 'Application successfully submitted!',
      },
    };
    
    if(!checkValidation(this)){

      alert(messages[currentLanguage].incorrectNumber);
      overlay.remove();
      document.body.style.overflow = '';
      return;
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
      alert(messages[currentLanguage].invalidData);
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
    alert(messages[currentLanguage].successfulSubmission);
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

  if (!mask.masked.isComplete) {
    checkResult = false;
  }
  
  return checkResult;
}



