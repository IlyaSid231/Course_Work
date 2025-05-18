"use strict"

import { errorMessages } from "./error_messages.js";
import { addPhone, editPhone, addMask, editMask } from "./phone.js";
import { currentLanguage } from "./config.js";

const language = currentLanguage;

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


export function checkValidation(inputs) {

    let checkResult = true;

    inputs.forEach(input_element => {

        if (input_element.nextElementSibling && input_element.nextElementSibling.classList.contains('error_message')) {
            input_element.nextElementSibling.remove();
        }

        if (input_element.id == "add-phone") {
            if (!(addMask.masked.isComplete)) {
                checkResult = false;
                if (!(addPhone.nextElementSibling.textContent === errorMessages["uncorrect_phone"][language])) {
                    showError(input_element, errorMessages["uncorrect_phone"][language]);
                }
            }
        }

        if (input_element.id == "edit-phone") {
            if (!(editMask.masked.isComplete)) {
                checkResult = false;
                if (!(editPhone.nextElementSibling.textContent === errorMessages["uncorrect_phone"][language])) {
                    showError(input_element, errorMessages["uncorrect_phone"][language]);
                }
            }
        }

        if (input_element.value.length == 0 && input_element.id != "edit-id") {
            checkResult = false;
            if (!(input_element.nextElementSibling && input_element.nextElementSibling.textContent === errorMessages["required_field"][language])) {
                showError(input_element, errorMessages["required_field"][language])
                checkResult = false;
            }
        }

        if (input_element.value.length == 0 && input_element.id == "edit-id"){
            checkResult = false;
            const idSection = document.getElementById("id_section");
            if (!(idSection.nextElementSibling && idSection.nextElementSibling.textContent === errorMessages["required_field"][language])) {
                showError(idSection, errorMessages["required_field"][language])
                checkResult = false;
            }
        }
        
        if (input_element.nextElementSibling && (input_element.nextElementSibling.tagName.toLowerCase() != 'button' && input_element.nextElementSibling.tagName.toLowerCase() != 'input')) {
            checkResult = false;
        }
        
    })
    return checkResult;
}


document.querySelectorAll('#modal-overlay input').forEach(el => {
    el.addEventListener('blur', () => {
        if (el.value.length === 0 && el.id != "edit-id") {
            if (el.nextElementSibling && el.nextElementSibling.classList.contains('error_message')) {
            el.nextElementSibling.remove();
            }
            showError(el, errorMessages["required_field"][language])
        }
        else if (el.id == "add-phone") {
            if (addMask.masked.isComplete) {
                if (addPhone.nextElementSibling && addPhone.nextElementSibling.textContent === errorMessages["uncorrect_phone"][language]) {
                    addPhone.classList.remove("field_error");
                    addPhone.nextElementSibling.parentNode.removeChild(addPhone.nextElementSibling)
                }
            }
            else {
                if (!(addPhone.nextElementSibling.textContent === errorMessages["uncorrect_phone"][language]))
                {
                    showError(addPhone, errorMessages["uncorrect_phone"][language]);
                }
            }
        }
        else if (el.id == "edit-phone") {
            if (editMask.masked.isComplete) {
                if (editPhone.nextElementSibling && editPhone.nextElementSibling.textContent === errorMessages["required_field"][language]) {
                    editPhone.classList.remove("field_error");
                    editPhone.nextElementSibling.parentNode.removeChild(editPhone.nextElementSibling)
                }
            }
            else {
                if (!editPhone.nextElementSibling) {
                    showError(editPhone, errorMessages["uncorrect_phone"][language])
                }
            }
        }
        else if (el.id == "edit-id" && el.value.length === 0){
            const idSection = document.getElementById("id_section");
            if(idSection.nextElementSibling && idSection.nextElementSibling.classList.contains('error_message')){
                idSection.nextElementSibling.remove();
            }
            showError(idSection, errorMessages["required_field"][language])
        }
    })
});