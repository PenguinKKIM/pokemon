document.getElementById('profileImg').addEventListener('change', function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.querySelector('.form__preview img');
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});


document.addEventListener('DOMContentLoaded', () => {

  const DB_NAME = 'TrainerDatabase';
  const DB_Version = 1; //소수인식 못함 쓰지말것

  let db;
  const dbRequest = window.indexedDB.open(DB_NAME, DB_Version); //DB OPEN

  dbRequest.onupgradeneeded = event => {
    db = event.target.result;
    if (!db.objectStoreNames.contains('trainers')) {
      db.createObjectStore('trainers', { keyPath: 'id', autoIncrement: true });
    } //id num 자동부여 = sql의 autoIncrement 와 같은것
  };

  dbRequest.onerror = event => {
    console.error('Database error:', event.target.error);
  };

  dbRequest.onsuccess = event => {
    db = event.target.result;
  };

  const form = document.querySelector('.form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const profileImg = document.getElementById('profileImg').files[0];

    const reader = new FileReader();
    reader.onload = function (e) {
      const trainerData = {
        name,
        address,
        profileImage: e.target.result,
      };
      const transaction = db.transaction(['trainers'], 'readwrite');
      const store = transaction.objectStore('trainers');
      store.add(trainerData);

      transaction.oncomplete = () => {
        console.log('Trainer data saved successfully!');
      };

      transaction.onerror = event => {
        console.error('Error saving data:', event.target.error);
      };
    };
  });
});
