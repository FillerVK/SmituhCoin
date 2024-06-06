document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();
    const auth = firebase.auth();

    const coinsElement = document.getElementById('coinCount');
    const energyElement = document.getElementById('energyCount');

    let coins = 0;
    let energy = 100;
    let userId;
    let clickUpgradeCost = 10;
    let limitUpgradeCost = 20;
    let regenUpgradeCost = 30;

    auth.signInAnonymously().then(() => {
        userId = auth.currentUser.uid;
        loadUserData(userId);
    }).catch((error) => {
        console.error("Authentication error: ", error);
    });

    function loadUserData(userId) {
        db.collection('users').doc(userId).get().then((doc) => {
            if (doc.exists) {
                coins = doc.data().coins;
                energy = doc.data().energy;
                clickUpgradeCost = doc.data().clickUpgradeCost || clickUpgradeCost;
                limitUpgradeCost = doc.data().limitUpgradeCost || limitUpgradeCost;
                regenUpgradeCost = doc.data().regenUpgradeCost || regenUpgradeCost;
                coinsElement.textContent = coins;
                energyElement.textContent = energy;
                document.getElementById('clickUpgradeCost').textContent = clickUpgradeCost;
                document.getElementById('limitUpgradeCost').textContent = limitUpgradeCost;
                document.getElementById('regenUpgradeCost').textContent = regenUpgradeCost;
            } else {
                db.collection('users').doc(userId).set({
                    coins: coins,
                    energy: energy,
                    clickUpgradeCost: clickUpgradeCost,
                    limitUpgradeCost: limitUpgradeCost,
                    regenUpgradeCost: regenUpgradeCost
                });
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    document.getElementById('clickImage').addEventListener('click', () => {
        if (energy > 0) {
            coins += 1;
            energy -= 1;
            coinsElement.textContent = coins;
            energyElement.textContent = energy;

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
            coinsElement.textContent = coins;
            document.getElementById('clickUpgradeCost').textContent = clickUpgradeCost;

            db.collection('users').doc(userId).update({
                coins: coins,
                clickUpgradeCost: clickUpgradeCost
            })
            .then(() => {
                console.log("Click upgrade purchased successfully!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
        } else {
            alert('Недостатньо монет для покупки!');
        }
    });

    document.getElementById('upgradeLimit').addEventListener('click', () => {
        if (coins >= limitUpgradeCost) {
            coins -= limitUpgradeCost;
            limitUpgradeCost *= 2;
            coinsElement.textContent = coins;
            document.getElementById('limitUpgradeCost').textContent = limitUpgradeCost;

            db.collection('users').doc(userId).update({
                coins: coins,
                limitUpgradeCost: limitUpgradeCost
            })
            .then(() => {
                console.log("Limit upgrade purchased successfully!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
        } else {
            alert('Недостатньо монет для покупки!');
        }
    });

    document.getElementById('upgradeRegen').addEventListener('click', () => {
        if (coins >= regenUpgradeCost) {
            coins -= regenUpgradeCost;
            regenUpgradeCost *= 2;
            coinsElement.textContent = coins;
            document.getElementById('regenUpgradeCost').textContent = regenUpgradeCost;

            db.collection('users').doc(userId).update({
                coins: coins,
                regenUpgradeCost: regenUpgradeCost
            })
            .then(() => {
                console.log("Regen upgrade purchased successfully!");
            })
            .catch((error) => {
                console.error("Error updating document: ", error);
            });
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
