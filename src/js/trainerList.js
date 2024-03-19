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
    trainerElement.innerHTML = ` <div class="form__field-group">
                                    <label for="id" class="form__label">트레이너 ID</label>
                                    <input type="text" class="form__field form__field--text" id="id" value="${trainer.id}" readonly/>
                                    </div>
                                    <div class="form__field-group">
                                    <label for="name" class="form__label">트레이너 이름</label>
                                    <input type="text" class="form__field form__field--text" id="name" value="${trainer.name}" readonly/>
                                    </div>
                                    <div class="form__field-group">
                                    <label for="address" class="form__label">트레이너 주소</label>
                                    <input type="text" class="form__field form__field--text" id="address" value="${trainer.address}" readonly/>
                                    </div>`;
    if (trainer.profileImage) {
      const image = new Image();
      image.src = trainer.profileImage;
      trainerElement.appendChild(image);
    }
    container.appendChild(trainerElement);
  });
}
