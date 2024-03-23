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

const DEFAULT_IMAGE = "../img/default_profile_img.png";
const DB_NAME = "TrainerDatabase";
const DB_Version = 1; //소수인식 못함 쓰지말것

let db;

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

  const form = document.querySelector(".form");
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const address = document.getElementById("address").value;
    const introText = document.getElementById("introText").value;

    const profileImg = document.getElementById("profileImg").files[0];

    if (!name.trim() || !address.trim()) {
      Swal.fire({
        text: "이름과 주소는 반드시 입력해야 합니다.",
        confirmButtonColor: "#5185c5",
        confirmButtonText: "확인",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const trainerData = {
        name,
        address,
        introText,
        profileImage: e.target.result,
        createdAt: new Date(),
      };
      const transaction = db.transaction(["trainers"], "readwrite");
      const store = transaction.objectStore("trainers");
      store.add(trainerData);

      transaction.oncomplete = () => {
        Swal.fire({
          text: "트레이너 등록이 완료되었습니다!",
          confirmButtonColor: "#5185c5",
          confirmButtonText: "확인",
        }).then(result => {
          if (result.isConfirmed) {
            window.location.href = "trainerlist.html";
          }
        });
      };

      transaction.onerror = event => {
        console.error("Error saving data:", event.target.error);
      };
    };
    if (profileImg) {
      reader.readAsDataURL(profileImg);
    } else {
      reader.onload({ target: { result: DEFAULT_IMAGE } });
    }
  });
});
