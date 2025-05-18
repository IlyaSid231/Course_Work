"use strict"

import { errorMessages } from "./error_messages.js";
import { mask, phoneInput } from "./phone.js";
import { fetchUsers, fetchUser, updateUsers } from "/js/api.js";

let users;
let currentLanguage = localStorage.getItem('language') || "en";

(async () => {
    users = await fetchUsers();
})();

document.querySelectorAll('input').forEach(el => {
    el.addEventListener('blur', () => {
        if (el.value.length === 0 && el.id != "middle_name") {
            showError(el, errorMessages["required_field"][currentLanguage])
        }
        else if (el.id == "phone") {
            if (mask.masked.isComplete) {
                if (phoneInput.nextElementSibling && phoneInput.nextElementSibling.textContent === errorMessages["required_field"][currentLanguage]) {
                    phoneInput.classList.remove("field_error");
                    phoneInput.nextElementSibling.parentNode.removeChild(phoneInput.nextElementSibling)
                }
            }
            else {
                if (!phoneInput.nextElementSibling) {
                    showError(phoneInput, errorMessages["uncorrect_phone"][currentLanguage])
                }
            }
        }
        else if (el.value.length === 1 && (el.id == "name" || el.id == "middle_name" || el.id == "last_name")) {
            showError(el, errorMessages["lenght_more_1"][currentLanguage])
        }
        else if (el.id == 'nick' && el.value.length <= 5) {
            showError(el, errorMessages["length_nickname"][currentLanguage]);
        }
        else if (el.type == "email" && !(el.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/))) {
            showError(el, errorMessages["uncorrect_email"][currentLanguage])
        }
        else if (el.classList.contains("date")) {
            var currentDate = new Date();
            var selectedDate = new Date(el.value);
            var ageLimit = 16 * 365.25 * 24 * 60 * 60 * 1000;

            if (currentDate - selectedDate < ageLimit) {
                showError(el, errorMessages["uncorrect_date"][currentLanguage])
            }
        }
        else if (el.id === "first_password") {
            if (checkValidPassword(el.value) === 0) {
                showError(el, errorMessages["password_length"][currentLanguage]);
            }
            else if (checkValidPassword(el.value) === 1) {
                showError(el, errorMessages["capital_letter_in_password"][currentLanguage]);
            }
            else if (checkValidPassword(el.value) === 2) {
                showError(el, errorMessages["digit_in_password"][currentLanguage]);
            }
            else if (checkValidPassword(el.value) === 3) {
                showError(el, errorMessages["special_symbol_in_password"][currentLanguage]);
            }
            else if (checkValidPassword(el.value) === 4) {
                showError(el, errorMessages["lowercase_letter_in_password"][currentLanguage]);
            }
            if (document.getElementById("second_password").value != 0) {
                if (el.value != document.getElementById("second_password").value) {
                    showError(document.getElementById("second_password"), errorMessages["password_not_match"][currentLanguage])
                }
            }
        }
        else if (el.id === "second_password") {
            let first_password_value = document.getElementById("first_password").value
            if (first_password_value != el.value) {
                showError(el, errorMessages["password_not_match"][currentLanguage]);
            }
        }
    })
});


document.getElementById('registration_form').addEventListener('submit',async function (event) {
    event.preventDefault()
    console.log(users);
    if (checkValidation(this) == true) {
        if (checkRepeatData(this, users) == false) {
            let currentUser = await fetchUser();

            if(currentUser != "unauthorized" && currentUser.role != "admin"){
                localStorage.setItem("currentUserName", "unauthorized");
                currentUser = "unauthorized";
            }

            let currentRole;
            
            if (currentUser == "unauthorized") {
                currentRole = "user"
            }
            else {
                currentRole = "admin"
            }
            let user = {
                username: document.getElementById("nick").value,
                password: document.getElementById("second_password").value,
                email: document.getElementById("email").value,
                phone: document.getElementById("phone").value,
                birth_date: document.querySelector(".date").value,
                first_name: document.getElementById("name").value,
                last_name: document.getElementById("last_name").value,
                middle_name: document.getElementById("middle_name").value,
                role: currentRole
            };
            if (currentRole !== "admin") {
                localStorage.setItem("currentUserName", user.username);
            }
            users.push(user);
            await updateUsers(users);
            goBack();
        }
    }
})

function checkValidation(form) {

    let checkResult = true;

    form.querySelectorAll("input").forEach(input_element => {
        if (input_element.type == "checkbox" || input_element.type == "hidden") {
            return;
        }
        if (input_element.id == "phone") {
            if (!(mask.masked.isComplete)) {
                checkResult = false;
                if (!(phoneInput.nextElementSibling)) {
                    showError(input_element, errorMessages["required_field"][currentLanguage]);
                }
            }
        }

        if (input_element.value.length == 0 && input_element.id != "middle_name") {
            checkResult = false
            if (!(input_element.nextElementSibling && input_element.nextElementSibling.textContent === errorMessages["required_field"][currentLanguage])) {
                showError(input_element, errorMessages["required_field"][currentLanguage])
                checkResult = false;
            }
        }
        
        if (input_element.nextElementSibling && (input_element.nextElementSibling.tagName.toLowerCase() != 'button' && input_element.nextElementSibling.tagName.toLowerCase() != 'input')) {
            checkResult = false;
        }
        
    })

    return checkResult;
}

function checkRepeatData(form, usersData) {
    let result = false;

    let phoneItem = form.querySelector("#phone");
    let emailItem = form.querySelector("#email");
    let nickItem = form.querySelector("#nick");

    for (let i = 0; i < usersData.length; i++) {
        if (phoneItem.value == usersData[i].phone) {
            showError(phoneItem, errorMessages["telephone_again"][currentLanguage]);
            result = true
        }
        if (emailItem.value == usersData[i].email) {
            showError(emailItem, errorMessages["email_again"][currentLanguage]);
            result = true;
        }
        if (nickItem.value == usersData[i].username) {
            showError(nickItem, errorMessages["nickname_again"][currentLanguage]);
            result = true;
        }
    }

    return result;
}


export function checkValidPassword(password) {
    if (password.length < 8 || password.length > 20) {
        return 0; //Limit length
    }
    else if (!(/[A-Z]/.test(password))) {
        return 1; //One uppercase letter
    }
    else if (!(/[0-9]/.test(password))) {
        return 2; //One digit
    }
    else if (!(/[!._,<>#?]/.test(password))) {
        return 3; //One special symbol
    }
    else if (!(/[a-z]/.test(password))) {
        return 4; //One lowercase letter
    }
    else {
        return 5;
    }
}

export function showError(field, errorText) {
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

export function hideError(field, err) {
    field.addEventListener('input', () => {
        field.classList.remove("field_error");
        err.remove();
    })
}

function goBack() {
    window.history.back();
}

function switchPageOnAuthorization() {
    window.location.href = "/pages/authorization/authorization.html";
}

const checkbox = document.getElementById("agree_user_agreement");
const btnConfirm = document.querySelector(".btn_agreement");
const btnReg = document.querySelector(".registration");
const logInButton = document.querySelector(".log_in_button");
const goBackButton = document.querySelector(".back_on_previous_page");

logInButton.addEventListener('click', switchPageOnAuthorization);
goBackButton.addEventListener('click', goBack);

if (localStorage.getItem('currentUserName') != 'unauthorized') {
    btnReg.disabled = false;
}

checkbox.addEventListener("change", function () {
    if (this.checked) {
        btnConfirm.disabled = false;
    } else {
        btnConfirm.disabled = true;
        btnReg.disabled = true;
    }
});

btnConfirm.addEventListener('click', activeBtnReg);

function activeBtnReg() {
    btnReg.disabled = false;
    document.querySelector(".modal_overlay").classList.remove('modal_overlay--visible');
    document.body.classList.remove('lock');
}

window.addEventListener('load', function () {
    const splashScreen = document.getElementById('splash-screen');
    splashScreen.classList.add('hide');
});

const textarea = document.getElementById('user-agreement');
const checkboxField = document.getElementById('agree_user_agreement');
const modal = document.querySelector('.modal');

checkboxField.disabled = true;

textarea.addEventListener('scroll', function(){
    var offset = textarea.offsetHeight + 1;
    if(this.scrollHeight <= (this.scrollTop+offset)){
        checkboxField.disabled = false;
    }
})
