
import { hostServer } from '/js/config.js';

    const serverUrl =await hostServer;
    const restaurant = JSON.parse(sessionStorage.getItem('currentRestaurant'));

    // Slider logical--------------------------------------------
    const images = restaurant.images || [];
     const mainSwiperParams = {
        loop: false,
        slidesPerView: 1,
        centeredSlides: false,
        speed: 500,
        navigation: {
            nextEl: '.main-swiper .swiper-button-next',
            prevEl: '.main-swiper .swiper-button-prev',
        },
    };

    // Параметры для модального слайдера
    const modalSwiperParams = {
        loop: false,
        slidesPerView: 1,
        centeredSlides: true,
        speed: 500,
        navigation: {
            nextEl: '.modal-swiper .swiper-button-next',
            prevEl: '.modal-swiper .swiper-button-prev',
        },
    };

    // Инициализация основного слайдера
    const mainSwiper = new Swiper('.main-swiper', mainSwiperParams);
    
    // Добавление слайдов в основной слайдер
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        const imgElement = document.createElement('img');
        imgElement.src = `${serverUrl}${img}`;
        imgElement.alt = `Restaurant image ${index}`;
        imgElement.className = 'swiper-slide-image';
        slide.appendChild(imgElement);
        mainSwiper.appendSlide(slide);
    });

    // Инициализация модального слайдера
    const modalSwiper = new Swiper('.modal-swiper', modalSwiperParams);
    
    // Добавление слайдов в модальный слайдер
    images.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `<img src="${serverUrl}${img}" alt="Restaurant image ${index}" class="modal-slide-image">`;
        modalSwiper.appendSlide(slide);
    });

    // Открытие модального окна при клике на слайд
    document.querySelectorAll('.swiper-slide-image').forEach((img, index) => {
        img.addEventListener('click', () => {
            modalSwiper.slideTo(index);
            document.getElementById('images_modal').style.display = 'flex';
        });
    });

    // Закрытие модального окна
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('images_modal').style.display = 'none';
    });

    // Закрытие при клике вне слайдера
    document.getElementById('images_modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('images_modal')) {
            document.getElementById('images_modal').style.display = 'none';
        }
    });