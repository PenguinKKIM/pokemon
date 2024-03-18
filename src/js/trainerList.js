document.addEventListener('DOMContentLoaded', () => {
    const DB_NAME = 'TrainerDatabase';
    const DB_Version = 1;

    const dbRequest = window.indexedDB.open(DB_NAME, DB_Version);

    dbRequest.onsuccess = event => {
        const db = event.target.result;
        readAllData(db);
    };
});

function readAllData(db) {
    const transaction = db.transaction(['trainers'], 'readonly');
    const store = transaction.objectStore('trainers');
    const request = store.getAll();

    request.onsuccess = () => {
        console.log('Data retrieved:', request.result);
        displayDataOnPage(request.result);
    };
}

function displayDataOnPage(data) {
    const container = document.querySelector('.trainer-list');
    data.forEach(trainer => {
        const trainerElement = document.createElement('li');
        trainerElement.classList.add('tranier-list__item');
        trainerElement.innerHTML = `<div><p>트레이너 ID :<input type = "text" value=${trainer.id} readonly/></p><p>트레이너 이름: ${trainer.name}</p><p>트레이너 주소: ${trainer.address}</p></div>`;
        if(trainer.profileImage) {
            const image = new Image();
            image.src = trainer.profileImage;
            trainerElement.appendChild(image);
        }
        container.appendChild(trainerElement);
    });
}
