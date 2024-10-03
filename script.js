document.addEventListener('DOMContentLoaded', () => {
    const coinsElement = document.getElementById('coinCount');
    const energyElement = document.getElementById('energyCount');
    const clickImage = document.getElementById('clickImage');

    let coins = parseInt(localStorage.getItem('coins')) || 0;
    let energy = parseInt(localStorage.getItem('energy')) || 100;
    let maxEnergy = parseInt(localStorage.getItem('maxEnergy')) || 100;
    let clickUpgradeCost = parseInt(localStorage.getItem('clickUpgradeCost')) || 10;
    let limitUpgradeCost = parseInt(localStorage.getItem('limitUpgradeCost')) || 20;
    let regenUpgradeCost = parseInt(localStorage.getItem('regenUpgradeCost')) || 30;
    let regenRate = parseInt(localStorage.getItem('regenRate')) || 1;

    let clickMultiplier = parseInt(localStorage.getItem('clickMultiplier')) || 1;
    let energyConsumptionPerClick = parseInt(localStorage.getItem('energyConsumptionPerClick')) || 1;

    const defaultImageSrc = 'image.png'; // Початкова картинка
    const clickedImageSrc = 'image-clicked.png'; // Картинка після кліку

    coinsElement.textContent = coins;
    energyElement.textContent = energy;
    document.getElementById('clickUpgradeCost').textContent = clickUpgradeCost;
    document.getElementById('limitUpgradeCost').textContent = limitUpgradeCost;
    document.getElementById('regenUpgradeCost').textContent = regenUpgradeCost;

    function saveGameState() {
        localStorage.setItem('coins', coins);
        localStorage.setItem('energy', energy);
        localStorage.setItem('maxEnergy', maxEnergy);
        localStorage.setItem('clickUpgradeCost', clickUpgradeCost);
        localStorage.setItem('limitUpgradeCost', limitUpgradeCost);
        localStorage.setItem('regenUpgradeCost', regenUpgradeCost);
        localStorage.setItem('regenRate', regenRate);
        localStorage.setItem('clickMultiplier', clickMultiplier);
        localStorage.setItem('energyConsumptionPerClick', energyConsumptionPerClick);
    }

    clickImage.addEventListener('click', () => {
        if (energy >= energyConsumptionPerClick) {
            coins += clickMultiplier;
            energy -= energyConsumptionPerClick;
            coinsElement.textContent = coins;
            energyElement.textContent = energy;

            // Зміна картинки на нову при кліку
            clickImage.src = clickedImageSrc;

            // Повернення до початкової картинки через 300 мс
            setTimeout(() => {
                clickImage.src = defaultImageSrc;
            }, 300);

            saveGameState();
        } else {
            alert('Недостатньо енергії!');
        }
    });

    setInterval(() => {
        if (energy < maxEnergy) {
            energy = Math.min(maxEnergy, energy + regenRate);
            energyElement.textContent = energy;
            saveGameState();
        }
    }, 2000);

    // Функція для відкриття і закриття модальних вікон
    const shopButton = document.getElementById('shopButton');
    const tasksButton = document.getElementById('tasksButton');
    const shopModal = document.getElementById('shop');
    const tasksModal = document.getElementById('tasks');
    const closeButtons = document.querySelectorAll('.close');

    // Відкриття модальних вікон
    shopButton.addEventListener('click', () => {
        shopModal.classList.remove('hidden');
    });

    tasksButton.addEventListener('click', () => {
        tasksModal.classList.remove('hidden');
    });

    // Закриття модальних вікон
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            shopModal.classList.add('hidden');
            tasksModal.classList.add('hidden');
        });
    });

    // Закриття модального вікна при кліку поза його межами
    window.addEventListener('click', (event) => {
        if (event.target === shopModal) {
            shopModal.classList.add('hidden');
        }
        if (event.target === tasksModal) {
            tasksModal.classList.add('hidden');
        }
    });
});
