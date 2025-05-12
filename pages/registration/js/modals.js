const userAgreementLink = document.querySelector('.license');
const modalOverlay = document.querySelector('.modal_overlay');
const closeButton = document.querySelector(".close-button");
const btnAgreement = document.querySelector('.btn_agreement');

userAgreementLink.addEventListener('click', () => {
    modalOverlay.classList.add('modal_overlay--visible');
    document.querySelector('.modal_1').classList.add('modal_1--visible');
    document.body.classList.add('lock');
})

window.onclick = function (event) {
    if (event.target == modalOverlay) {
        modalOverlay.classList.remove('modal_overlay--visible');
        document.body.classList.remove('lock');
    }
}

closeButton.onclick = function () {
    modalOverlay.classList.remove('modal_overlay--visible');
    document.body.classList.remove('lock');
}
