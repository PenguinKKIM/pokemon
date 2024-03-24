document.getElementById("profileImg").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.querySelector(".form__preview img");
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const dbRequest = window.indexedDB.open(DB_NAME, DB_Version); //DB OPENs

  dbRequest.onupgradeneeded = event => {
    db = event.target.result;
    if (!db.objectStoreNames.contains("trainers")) {
      db.createObjectStore("trainers", { keyPath: "id", autoIncrement: true });
    } //id num 자동부여 = sql의 autoIncrement 와 같은것
  };

  dbRequest.onerror = event => {
    console.error("Database error:", event.target.error);
  };

  dbRequest.onsuccess = event => {
    db = event.target.result;
  };
});
