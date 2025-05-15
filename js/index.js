
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