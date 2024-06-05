document.addEventListener('DOMContentLoaded', function() {
    // открытие меню бургера
    document.getElementById('burger').addEventListener('click', function() {
        document.querySelector('header').classList.toggle('open');
    });


    // слайдер
    const services = [];
    const baseService = {
        name: "CHECK-UP",
        for: "для мужчин",
        list: ["Гормональный скрининг", "Тестостерон", "Свободный тестостерон", "Глобулин, связывающий половые гормоны"],
        price: { current: "2800₽", old: "3500₽" },
        img: "images/secondPhoto.jpg"
    };
    
    for (let i = 0; i < 4; i++) {
        services.push({ ...baseService });
    }
    
    let currentIndex = 0;
    
    const servicesName = document.querySelector('.services__info-title');
    const servicesFor = document.querySelector('.services__info-for');
    const servicesList = document.querySelector('.services__info-list');
    const servicesNowPrice = document.querySelector('.services__now-price');
    const servicesOldPrice = document.querySelector('.services__old-price');
    const servicesImg = document.querySelector('.services__image');
    const paginationText = document.querySelector('.pagination__text');
    const paginationAllServices = document.querySelector('.pagination__all-services');
    const servicesContent = document.querySelector('.services__content');
    
    paginationAllServices.textContent = `/${services.length}`;
    
    function updateService(index) {
        const service = services[index];
        servicesName.textContent = service.name;
        servicesFor.textContent = service.for;
        servicesList.innerHTML = service.list.map(item => `<li>${item}</li>`).join('');
        servicesNowPrice.textContent = service.price.current;
        servicesOldPrice.textContent = service.price.old;
        servicesImg.src = service.img;
        paginationText.firstChild.textContent = index + 1;
    }
    
    function slideService(direction) {
        servicesContent.style.transform = `translateX(${direction * 100}%)`;
        
        setTimeout(() => {
            currentIndex = (currentIndex + direction + services.length) % services.length;
            updateService(currentIndex);
            servicesContent.style.transition = 'none';
            servicesContent.style.transform = `translateX(${-direction * 100}%)`; 
            setTimeout(() => {
                servicesContent.style.transition = 'transform 0.5s'; 
                servicesContent.style.transform = 'translateX(0)'; 
            }, 20);
        }, 500);
    }
    
    document.querySelector('.arrow-left').addEventListener('click', () => slideService(1));
    document.querySelector('.arrow-right').addEventListener('click', () => slideService(-1));
    
    updateService(currentIndex);

    // модальное окно
    const modal = document.getElementById('modal');
    const closeBtn = document.getElementById('closeBtn');
    const openBtns = document.querySelectorAll('.btn__subscribe_green, .btn__subscribe_white');

    openBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    });

    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });


    // запрос на сервер
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        fetch('send_mail.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data); 
            if (data.includes('Сообщение отправлено')) {
                modal.style.display = 'none';
                form.reset(); 
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при отправке сообщения');
        });
    });
});