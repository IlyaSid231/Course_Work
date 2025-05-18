"use strict"
//==========================================
import {
    headerAndFooterText,
    indexText,
    registrationText,
    authorizationText,
    filtersText,
    catalogText,
    cardText,
    favoritesText,
    requestsText,
    moreInfText,
    aboutUsText,
    // adminPanelText,
    // basketText,
} from "./texts.js";


let currentLanguage = localStorage.getItem("language") || "ru";
const langButtons = document.querySelectorAll("[data-btn]");
const currentPathName = window.location.pathname;
let currentTextObject = {};

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

function checkPagePathName() {
    console.log(currentPathName);

    if (currentPathName.includes("index.html") || currentPathName == "/") {
        currentTextObject = {...indexText, ...headerAndFooterText, ...filtersText};
    }
    else if (currentPathName.includes("authorization.html")) {
        currentTextObject = authorizationText;
    }
    else if (currentPathName.includes("registration.html")) {
        console.log("competed");
        currentTextObject = registrationText;
    }
    else if (currentPathName.includes("catalog.html")) {
        currentTextObject = {...catalogText, ...headerAndFooterText, ...filtersText, ...cardText};
    }
    else if (currentPathName.includes("favorites-restaurants.html")) {
        currentTextObject = {...favoritesText, ...headerAndFooterText, ...cardText};
    }
    else if (currentPathName.includes("requested-restaurants.html")) {
        currentTextObject = {...requestsText, ...headerAndFooterText, ...cardText};
    }
    else if (currentPathName.includes("restaurant-details.html")) {
        currentTextObject = {...moreInfText, ...headerAndFooterText};
    }
    else if (currentPathName.includes("aboutUs.html")) {
        currentTextObject = {...aboutUsText, ...headerAndFooterText};
    }
    // else {
    //     currentTextObject = indexText;
    // }
}

checkPagePathName();

export function changeLang() {
    for (const key in currentTextObject) {
        const elems = document.querySelectorAll(`[data-lang=${key}]`);
        if (elems) {
           elems.forEach(item => {
                // Проверяем, есть ли дочерние элементы с data-lang
                const hasChildWithLang = item.querySelector('[data-lang]');
                const hasChildWithSpan = item.querySelector('span');
                if (!hasChildWithLang && !hasChildWithSpan) {
                    // Если нет дочерних элементов с data-lang, обновляем textContent
                    item.textContent = currentTextObject[key][currentLanguage];
                } else {
                    // Если есть дочерние элементы с data-lang, обновляем только текстовые узлы
                    item.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                            node.textContent = currentTextObject[key][currentLanguage];
                        }
                    });
                }
                // Обработка placeholder
                if (item.hasAttribute('placeholder')) {
                    item.placeholder = currentTextObject[key][currentLanguage];
                }
            });
        }
    }
    if (currentPathName.includes("authorization.html")) {
        document.querySelector('.input_log_in_data').placeholder = currentTextObject["placeholder_1"][currentLanguage];
        document.querySelector('.password').placeholder = currentTextObject["placeholder_2"][currentLanguage];
    }
}

changeLang();

langButtons.forEach((btn => {
    btn.addEventListener('click', (event) => {
        currentLanguage = event.target.dataset.btn;
        localStorage.setItem('language', event.target.dataset.btn)
        reseatActiveClass(langButtons, 'header_btn_active')
        btn.classList.add('header_btn_active');
        changeLang();
        setNeedBtn();
    });
}));

function reseatActiveClass(arr, activeClass) {
    arr.forEach(elem => {
        elem.classList.remove(activeClass);
    })
}