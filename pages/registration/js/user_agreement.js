const userAgreementElement = document.getElementById('user-agreement');

let path;

if (localStorage.getItem('language') == "ru") {
  path = '../registration/resources/user_agreement_ru.txt'
}
else {
  path = '../registration/resources/user_agreement_en.txt'
}

fetch(path)
  .then(response => response.text())
  .then(data => {
    userAgreementElement.innerHTML = data;
  })
  .catch(error => {
    console.error('Error load user agreement:', error);
  });