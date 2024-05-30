document.addEventListener('DOMContentLoaded', () => {
    const userId = 'unique_user_id'; // Замість цього використовуйте унікальний ідентифікатор користувача
    const coinCountElement = document.getElementById('coinCount');
    const energyCountElement = document.getElementById('energyCount');
    const clickImage = document.getElementById('clickImage');
    let coins = 0;
    let energy = 1000;

    // Отримання монет та енергії при завантаженні сторінки
    fetch(`/get_coins?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            coins = data.coins;
            coinCountElement.textContent = coins;
        });

    fetch(`/get_energy?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            energy = data.energy;
            energyCountElement.textContent = energy;
        });

    clickImage.addEventListener('click', () => {
        if (energy > 0) {
            coins += 1;
            energy -= 1;
            coinCountElement.textContent = coins;
            energyCountElement.textContent = energy;

            // Оновлення монет та енергії на сервері
            fetch('/update_coins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, coins: coins, energy: energy })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status !== 'success') {
                    alert('Не вдалося зберегти монети та енергію!');
                }
            });
        } else {
            alert('Недостатньо енергії!');
        }
    });

    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', () => {
            closeButton.closest('.modal').classList.add('hidden');
        });
    });

    document.getElementById('shopButton').addEventListener('click', () => {
        document.getElementById('shop').classList.remove('hidden');
    });

    document.getElementById('tasksButton').addEventListener('click', () => {
        document.getElementById('tasks').classList.remove('hidden');
    });

    document.querySelectorAll('.taskButton').forEach(taskButton => {
        taskButton.addEventListener('click', () => {
            const reward = parseInt(taskButton.dataset.reward);
            const link = taskButton.dataset.link;
            window.open(link, '_blank');
            coins += reward;
            coinCountElement.textContent = coins;

            // Оновлення монет на сервері після виконання завдання
            fetch('/update_coins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: userId, coins: coins, energy: energy })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status !== 'success') {
                    alert('Не вдалося зберегти монети та енергію!');
                }
            });
        });
    });
});
