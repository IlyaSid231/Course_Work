import "/js/burger_menu.js"

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("register_button").addEventListener('click', async () => {
        window.location.href = '/pages/registration/registration.html';
    })
    document.getElementById("show_at_list_button").addEventListener('click', async () => {
        window.location.href = '/pages/catalog/catalog.html';
    })
});