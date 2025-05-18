const menu = document.querySelector('.body_menu');
const menuButton = document.querySelector('.menu_icon');
const menuGround = document.querySelector('.menu_overflow');

const body = document.body;


if(menu && menuButton)
{
    menuButton.addEventListener('click', () => {
        menu.classList.toggle('active_burger_menu');
        menuButton.classList.toggle('active_burger_menu');
        menuGround.classList.toggle('show');
        body.classList.toggle('lock');
    })

    menu.querySelectorAll('.info_text_in_first_block_header p').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active_burger_menu');
            menuButton.classList.remove('active_burger_menu');
            menuGround.classList.remove('show');
            body.classList.remove('lock');
        })
    })
}


const anchors = document.querySelectorAll('a[href*="#"]');

anchors.forEach(anchor => {
    anchor.addEventListener('click', event => {
        event.preventDefault();

        const blockId = anchor.getAttribute('href').substring(1);

        document.getElementById(blockId).scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    })
})