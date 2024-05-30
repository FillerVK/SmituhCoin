document.addEventListener('DOMContentLoaded', () => {
    const userId = 'unique_user_id'; // Замість цього використовуйте унікальний ідентифікатор користувача

    const db = firebase.firestore();

    // Елементи для відображення монет та енергії
    const coinsElement = document.getElementById('coinCount');
    const energyElement = document.getElementById('energyCount');
    
    let coins = 0;
    let energy = 100;

    // Отримання даних при завантаженні сторінки
    db.collection('users').doc(userId).get().then((doc) => {
        if (doc.exists) {
            coins = doc.data().coins;
            energy = doc.data().energy;
            coinsElement.textContent = coins;
            energyElement.textContent = energy;
        } else {
            // Створити новий документ якщо не існує
            db.collection('users').doc(userId).set({
                coins: coins,
                energy: energy
            });
        }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });

    document.getElementById('clickImage').addEventListener('click', () => {
        if (energy > 0) {
            coins += 1;
            energy -= 1;
            coinsElement.textContent = coins;
            energyElement.textContent = energy;

            // Оновлення даних в Firestore
            db.collection('users').doc(userId).update({
                coins: coins,
                energy: energy
            })
            .then(() => {
                console.log("Document successfully updated!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
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

            // Оновлення даних в Firestore
            db.collection('users').doc(userId).update({
                coins: coins,
                energy: energy
            })
            .then(() => {
                window.location.href = link;
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
        });
    });
});
