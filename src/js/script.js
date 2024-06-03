document.addEventListener('DOMContentLoaded', function() {
    // открытие меню бургера
    document.getElementById('burger').addEventListener('click', function() {
        document.querySelector('header').classList.toggle('open');
    });
});