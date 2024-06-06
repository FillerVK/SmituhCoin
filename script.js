document.addEventListener('DOMContentLoaded', () => {
    const coinsElement = document.getElementById('coinCount');
    const energyElement = document.getElementById('energyCount');

    let coins = parseInt(localStorage.getItem('coins')) || 0;
    let energy = parseInt(localStorage.getItem('energy')) || 100;
    let maxEnergy = parseInt(localStorage.getItem('maxEnergy')) || 100;
    let clickUpgradeCost = parseInt(localStorage.getItem('clickUpgradeCost')) || 10;
    let limitUpgradeCost = parseInt(localStorage.getItem('limitUpgradeCost')) || 20;
    let regenUpgradeCost = parseInt(localStorage.getItem('regenUpgradeCost')) || 30;
    let regenRate = parseInt(localStorage.getItem('regenRate')) || 1;

    let clickMultiplier = parseInt(localStorage.getItem('clickMultiplier')) || 1;
    let energyConsumptionPerClick = parseInt(localStorage.getItem('energyConsumptionPerClick')) || 1;

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

    document.getElementById('clickImage').addEventListener('click', () => {
        if (energy >= energyConsumptionPerClick) {
            coins += clickMultiplier;
            energy -= energyConsumptionPerClick;
            coinsElement.textContent = coins;
            energyElement.textContent = energy;
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

    const shopModal = document.getElementById('shop');
    const tasksModal = document.getElementById('tasks');
    const closeModalButtons = document.querySelectorAll('.close');

    document.getElementById('shopButton').addEventListener('click', () => {
        shopModal.classList.remove('hidden');
        shopModal.style.display = 'block';
    });

    document.getElementById('tasksButton').addEventListener('click', () => {
        tasksModal.classList.remove('hidden');
        tasksModal.style.display = 'block';
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            shopModal.classList.add('hidden');
            shopModal.style.display = 'none';
            tasksModal.classList.add('hidden');
            tasksModal.style.display = 'none';
        });
    });

    document.getElementById('upgradeClick').addEventListener('click', () => {
        if (coins >= clickUpgradeCost) {
            coins -= clickUpgradeCost;
            clickUpgradeCost *= 2;
            clickMultiplier *= 2;
            energyConsumptionPerClick *= 2;
            coinsElement.textContent = coins;
            document.getElementById('clickUpgradeCost').textContent = clickUpgradeCost;
            saveGameState();
        } else {
            alert('Недостатньо монет для покупки!');
        }
    });

    document.getElementById('upgradeLimit').addEventListener('click', () => {
        if (coins >= limitUpgradeCost) {
            coins -= limitUpgradeCost;
            limitUpgradeCost *= 2;
            maxEnergy += 500;
            coinsElement.textContent = coins;
            saveGameState();
        } else {
            alert('Недостатньо монет для покупки!');
        }
    });

    document.getElementById('upgradeRegen').addEventListener('click', () => {
        if (coins >= regenUpgradeCost) {
            coins -= regenUpgradeCost;
            regenUpgradeCost *= 2;
            regenRate += 1;
            coinsElement.textContent = coins;
            document.getElementById('regenUpgradeCost').textContent = regenUpgradeCost;
            saveGameState();
        } else {
            alert('Недостатньо монет для покупки!');
        }
    });

    document.querySelectorAll('.taskButton').forEach(button => {
        button.addEventListener('click', (event) => {
            const reward = parseInt(event.target.dataset.reward);
            const link = event.target.dataset.link;
            coins += reward;
            coinsElement.textContent = coins;
            saveGameState();
            window.location.href = link;
        });
    });
});
