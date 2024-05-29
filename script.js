let coins = 0;
let coinPerClick = 1;
let clickLimit = 1000;
let energy = clickLimit;
let regenRate = 1;
let clickUpgradeCost = 10;
let limitUpgradeCost = 20;
let regenUpgradeCost = 30;

document.addEventListener('DOMContentLoaded', () => {
    const coinCountElement = document.getElementById('coinCount');
    const energyElement = document.getElementById('energy');
    const limitElement = document.getElementById('limit');
    const clickImage = document.getElementById('clickImage');
    const shopButton = document.getElementById('shopButton');
    const tasksButton = document.getElementById('tasksButton');
    const shopModal = document.getElementById('shop');
    const tasksModal = document.getElementById('tasks');
    const closeModalElements = document.querySelectorAll('.close');

    clickImage.addEventListener('click', (event) => {
        if (energy > 0) {
            coins += coinPerClick;
            energy--;
            showCoinPopup(event.clientX, event.clientY, coinPerClick);
            updateDisplay();
        }
    });

    shopButton.addEventListener('click', () => {
        shopModal.style.display = 'block';
    });

    tasksButton.addEventListener('click', () => {
        tasksModal.style.display = 'block';
    });

    closeModalElements.forEach(element => {
        element.addEventListener('click', () => {
            shopModal.style.display = 'none';
            tasksModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target == shopModal) {
            shopModal.style.display = 'none';
        }
        if (event.target == tasksModal) {
            tasksModal.style.display = 'none';
        }
    });

    document.getElementById('upgradeClick').addEventListener('click', () => {
        if (coins >= clickUpgradeCost) {
            coins -= clickUpgradeCost;
            coinPerClick++;
            clickUpgradeCost *= 2;
            updateDisplay();
        }
    });

    document.getElementById('upgradeLimit').addEventListener('click', () => {
        if (coins >= limitUpgradeCost) {
            coins -= limitUpgradeCost;
            clickLimit += 500;
            limitUpgradeCost *= 2;
            updateDisplay();
        }
    });

    document.getElementById('upgradeRegen').addEventListener('click', () => {
        if (coins >= regenUpgradeCost) {
            coins -= regenUpgradeCost;
            regenRate++;
            regenUpgradeCost *= 2;
            updateDisplay();
        }
    });

    document.querySelectorAll('.taskButton').forEach(button => {
        button.addEventListener('click', () => {
            const reward = parseInt(button.getAttribute('data-reward'));
            const link = button.getAttribute('data-link');
            window.open(link, '_blank');
            coins += reward;
            updateDisplay();
        });
    });

    function updateDisplay() {
        coinCountElement.textContent = coins;
        energyElement.textContent = energy;
        limitElement.textContent = clickLimit;
        document.getElementById('clickUpgradeCost').textContent = clickUpgradeCost;
        document.getElementById('limitUpgradeCost').textContent = limitUpgradeCost;
        document.getElementById('regenUpgradeCost').textContent = regenUpgradeCost;
    }

    function showCoinPopup(x, y, amount) {
        const popup = document.createElement('div');
        popup.classList.add('coin-popup');
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
        popup.textContent = `+${amount}`;
        document.body.appendChild(popup);
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }

    // Energy regeneration
    setInterval(() => {
        if (energy < clickLimit) {
            energy += regenRate;
            if (energy > clickLimit) {
                energy = clickLimit;
            }
            updateDisplay();
        }
    }, 1000);

    updateDisplay();
});
