
const sendButton = document.getElementById('sendButton');
sendButton.addEventListener('click', () => {
    const searchInput = document.querySelector('.search_input');
    const filterPlatformType = document.getElementById('filter_platform_type');
    const filterFeatures = document.getElementById('filter_features');
    const filterCapacity = document.getElementById('filter_capacity');
    const filterPrice = document.getElementById('filter_price');
    const filterMore = document.getElementById('filter_more');

    const params = new URLSearchParams();
    params.set('page', 1);
    params.set('search', searchInput.value.trim());
    params.set('platform', filterPlatformType.value || '');
    params.set('feature', filterFeatures.value || '');
    params.set('capacity', filterCapacity.value || '');
    params.set('price', filterPrice.value || '');
    params.set('metro', filterMore.value || '');

    window.location.href = `./pages/catalog/catalog.html?${params.toString()}`;

})

// Получаем элементы
const filterTrigger = document.querySelector('.filter_trigger');
const filterContainer = document.querySelector('.filter_container');
const filterOverflow = document.querySelector('.filter_overflow');
const body = document.body;
const menu = document.querySelector('.body_menu');
const menuButton = document.querySelector('.menu_icon');

// Проверяем наличие элементов
if (filterTrigger && filterContainer) {
    // Обработчик клика по иконке воронки
    filterTrigger.addEventListener('click', () => {
        const isExpanded = filterTrigger.getAttribute('aria-expanded') === 'true';
        filterContainer.classList.toggle('active'); // Переключаем видимость
        filterTrigger.setAttribute('aria-expanded', !isExpanded); // Обновляем состояние доступности


        if (isExpanded) {
            filterOverflow.classList.remove('show'); // Убираем класс, если контейнер закрыт
            body.classList.remove('lock');
        } else {
            filterOverflow.classList.add('show'); // Добавляем класс, если контейнер открыт
            body.classList.toggle('lock');
        }
    });

    // Закрытие контейнера при выборе фильтра
    filterContainer.querySelectorAll('select').forEach(select => {
        select.addEventListener('change', () => {
            filterContainer.classList.remove('active');
            filterTrigger.setAttribute('aria-expanded', 'false');
            filterOverflow.classList.remove('show');
            body.classList.remove('lock');
        });
    });

    // Закрытие при клике вне контейнера
document.addEventListener('click', (event) => {
    // Проверяем, открыты ли фильтры в данный момент
    const isFiltersOpen = filterContainer.classList.contains('active') || 
                         filterTrigger.getAttribute('aria-expanded') === 'true';
    
    // Если фильтры закрыты - ничего не делаем
    if (!isFiltersOpen) return;

    // Элементы бургер-меню, которые нужно игнорировать
    const burgerElements = [
        document.querySelector('.body_menu'),
        document.querySelector('.menu_icon'),
        document.querySelector('.menu_overflow')
    ].filter(Boolean);
    
    // Проверяем, был ли клик вне фильтров и не по элементам бургер-меню
    const isClickOutsideFilters = !filterContainer.contains(event.target) && 
                                !filterTrigger.contains(event.target);
    
    const isClickInsideBurger = burgerElements.some(element => 
        element.contains(event.target)
    );
    
    if (isClickOutsideFilters && !isClickInsideBurger) {
        filterContainer.classList.remove('active');
        filterTrigger.setAttribute('aria-expanded', 'false');
        if (filterOverflow) filterOverflow.classList.remove('show');
        body.classList.remove('lock');
    }
});

    // Предотвращение закрытия при клике внутри контейнера
    filterContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });
}