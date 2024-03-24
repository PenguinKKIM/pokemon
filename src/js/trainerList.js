const DB_NAME = "TrainerDatabase";
const DB_Version = 1;
const loadingElement = document.querySelector(".loading");

document.addEventListener("DOMContentLoaded", () => {
  loading(true);
  const dbRequest = window.indexedDB.open(DB_NAME, DB_Version);

  dbRequest.onsuccess = event => {
    const db = event.target.result;
    readAllData(db);
  };

  dbRequest.onerror = event => {
    console.error("Database error:", event.target.error);
    loading(false);
  };
});

function readAllData(db) {
  const transaction = db.transaction(["trainers"], "readonly");
  const store = transaction.objectStore("trainers");
  const request = store.getAll();

  request.onsuccess = () => {
    console.log("Data retrieved:", request.result);
    displayDataOnPage(request.result);
    loading(false);
  };
}

const searchForm = document.querySelector(".searchForm");
const searchInput = document.querySelector(".searchInput");

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const searchKeyword = searchInput.value;
  console.log(searchKeyword);
  searchTrainers(searchKeyword);
});

function searchTrainers(searchKeyword) {
  loading(true);
  const dbRequest = window.indexedDB.open(DB_NAME, DB_Version);

  dbRequest.onsuccess = event => {
    const db = event.target.result;
    const transaction = db.transaction(["trainers"], "readonly");
    const store = transaction.objectStore("trainers");
    const results = [];

    store.openCursor().onsuccess = event => {
      const cursor = event.target.result;
      if (cursor) {
        if (
          cursor.value.name.includes(searchKeyword) ||
          cursor.value.address.includes(searchKeyword) ||
          String(cursor.value.id) === searchKeyword
        ) {
          results.push(cursor.value);
        }
        cursor.continue();
      } else {
        displayDataOnPage(results);
        loading(true);
      }
    };
  };

  dbRequest.onerror = event => {
    console.error("Database error:", event.target.error);
  };
}

function displayDataOnPage(data) {
  const container = document.querySelector(".trainer-list");
  container.innerHTML = "";

  data.forEach(trainer => {
    const trainerElement = document.createElement("li");
    trainerElement.classList.add("trainer-list__items");
    trainerElement.innerHTML = ` 
    <div class="trainer-list__item">

    <div class="form__field-group">
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
    </div>

    </div>`;

    if (trainer.profileImage) {
      const image = new Image();
      image.src = trainer.profileImage;
      trainerElement.appendChild(image);
    }
    container.appendChild(trainerElement);

    const btn = document.createElement("button");
    btn.classList.add("form__button");
    btn.innerText = "상세보기";
    btn.addEventListener("click", () => {
      window.location.href = `trainerdetail.html?id=${trainer.id}`;
    });
    trainerElement.appendChild(btn);
  });
}

function loading(isLoading) {
  if (isLoading) {
    loadingElement.style.display = "flex";
    setTimeout(() => {
      loadingElement.style.display = "none";
    }, 5000);
  } else {
    loadingElement.style.display = "none";
  }
}
