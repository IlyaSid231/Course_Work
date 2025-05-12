import { fetchUser } from '/js/api.js'

const h1 = document.querySelector("h1");
const userAgreement = document.querySelector(".license");
const logInBtn = document.querySelector('.log_in_button');

let currentUser =await fetchUser();

if(!currentUser){
    currentUser = "unauthorized";
}

if(currentUser != "unauthorized")
    if(currentUser.role == "admin"){
        h1.textContent = "Add new admin";
        userAgreement.style.display = "none";
        logInBtn.style.display = "none";
}
