"use strict"

import { errorMessages } from "./error_messages.js";
import { fetchUsers} from "/js/api.js";

let users;
var currentLanguage = localStorage.getItem("language") || "en";
var currentUser;

(async () => {
    users = await fetchUsers();
})();

document.getElementById('registration_form').addEventListener('submit', function (event) {
    event.preventDefault()
    console.log(users)
    if (checkValidation(this) == true) {
        let first_field = document.querySelector(".input_log_in_data");
        let second_field = document.querySelector(".password");
        if (isUserInUsers(first_field.value, second_field.value)) {

            localStorage.setItem("currentUserName", currentUser.username);
            const previousPageUrl = document.referrer;
            if(previousPageUrl.includes('catalog') && currentUser.role != "admin"){
                switchPageOnCatalog(); //TODO
            }
            else{
                switchPageOnHome();
            }
        }
        else {
            showError(second_field, errorMessages["uncorrect_date"][currentLanguage]);
        }
    }
})

function isUserInUsers(first_field, second_field) {
    for (let i = 0; i < users.length; i++) {
        let phone = String(users[i].phone).replaceAll(" ", "").replaceAll("-", "").replace("(", "").replace(")", "");
        if (first_field == users[i].username || first_field == phone || first_field == users[i].email) {
            if (second_field == users[i].password) {
                currentUser = users[i];
                return true;
            }
        }
    }
    return false;
  }


function checkValidation(form) {
    let checkResult = true;

    form.querySelectorAll("input").forEach(input_element => {
        if (input_element.value.length == 0) {
            checkResult = false;
            if (!(input_element.nextElementSibling && input_element.nextElementSibling.textContent === "Обязательное поле")) {
                showError(input_element, errorMessages["required_field"][currentLanguage])
            }
        }
    })

    return checkResult;
}

function showError(field, errorText) {
    if (field.nextElementSibling && field.nextElementSibling.textContent === errorText) {
        return
    }

    field.classList.add("field_error");

    const err = document.createElement('span');
    field.after(err);
    err.classList.add("error_message");
    err.textContent = errorText;

    hideError(field, err);
}

function hideError(field, err) {
    field.addEventListener('input', () => {
        field.classList.remove("field_error");
        err.remove();
    })
}

function switchPageOnHome() {
    window.location.href = "/index.html";
}

function switchPageOnCatalog(){
    window.location.href = "./catalog/catalog.html";
}

window.addEventListener('load', function() {
    const splashScreen = document.getElementById('splash-screen');
    splashScreen.classList.add('hide');
  });