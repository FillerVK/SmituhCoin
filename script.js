document.addEventListener('DOMContentLoaded', () => {
    const userId = 'unique_user_id'; // Замість цього використовуйте унікальний ідентифікатор користувача

    // Елементи для відображення монет та енергії
    const coinsElement = document.getElementById('coinCount');
    const energyElement = document.getElementById('energyCount');
    
    let coins = 0;
    let energy = 100;

    // Отримання даних при завантаженні сторінки
    fetch(`/get_user_data?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            coins = data.coins;
            energy = data.energy;
            coinsElement.textContent = coins;
            energyElement.textContent = energy;
        });

    document.getElementById('clickImage').addEventListener('click', () => {
        if (energy > 0) {
            coins += 1;
            energy -= 1;
            coinsElement.textContent = coins;
            energyElement.textContent = energy;

            // Оновлення даних на сервері
            fetch('/update_user_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, coins: coins, energy: energy })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status !== 'success') {
                    alert('Не вдалося зберегти дані!');
                }
            });
        } else {
            alert('Недостатньо енергії!');
        }
    });

    // Налаштування модальних вікон магазину та завдань
    const shopModal = document.getElementById('shop');
    const tasksModal = document.getElementById('tasks');
    const closeModalButtons = document.querySelectorAll('.close');

    document.getElementById('shopButton').addEventListener('click', () => {
        shopModal.classList.remove('hidden');
    });

    document.getElementById('tasksButton').addEventListener('click', () => {
        tasksModal.classList.remove('hidden');
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            shopModal.classList.add('hidden');
            tasksModal.classList.add('hidden');
        });
    });

    document.querySelectorAll('.taskButton').forEach(button => {
        button.addEventListener('click', (event) => {
            const reward = parseInt(event.target.dataset.reward);
            const link = event.target.dataset.link;
            coins += reward;
            coinsElement.textContent = coins;

            // Оновлення даних на сервері
            fetch('/update_user_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, coins: coins, energy: energy })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    window.location.href = link;
                } else {
                    alert('Не вдалося зберегти дані!');
                }
            });
        });
    });
});
