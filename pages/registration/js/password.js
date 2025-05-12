String.prototype.shuffle = function () {
    var a = this.split('');

    for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a.join("");
}


let btnPass = document.querySelectorAll(".btn_password");

btnPass.forEach(function (btn) {
    btn.onclick = function () {
        let target = this.getAttribute('data-target'),
            inputPass = document.querySelector(target);

        if (inputPass.getAttribute('type') === 'password') {
            inputPass.setAttribute('type', 'text');
            btn.classList.add('active_password_btn');
        } else {
            inputPass.setAttribute('type', 'password');
            btn.classList.remove('active_password_btn');
        }

    }
})