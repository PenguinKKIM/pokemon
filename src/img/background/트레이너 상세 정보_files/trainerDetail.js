const editButton = document.querySelector('.editButton');
const deleteButton = document.querySelector('.deleteButton');
const updateButton = document.querySelector('.updateButton');
const deleteImgButton = document.querySelector('.deleteImgButton');
const imageInput = document.getElementById('imageInput');

const DEFAULT_IMAGE = "../img/default_profile_img.png"
const DB_NAME = 'TrainerDatabase';
const DB_Version = 1;

let currentTrainer;

editButton.addEventListener('click', () => {
    try {
        Swal.fire({
            text: "수정하시겠습니까?",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인",
            showCancelButton: true,
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                editTrainer();
            }
        });
    } catch (error) {
        Swal.fire({
            text: "수정 폼을 활성화 할 수 없습니다",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인",
        });
        console.error(error);
    }
});

deleteButton.addEventListener('click', () => {
    try {
        Swal.fire({
            text: "삭제하시겠습니까?",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인",
            showCancelButton: true,
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                deleteTrainer(currentTrainer.id);
            }
        });
    } catch (error) {
        Swal.fire({
            text: "삭제하는도중 에러가 발생했습니다.",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인",
        })
        console.error(error);
    }
});

updateButton.addEventListener('click', () => {
    try {
        Swal.fire({
            text: "저장 하시겠습니까?",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인",
            showCancelButton: true,
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                upDateTrainer(currentTrainer.id);
            }
        })
    } catch (error) {
        Swal.fire({
            text: "저장하는 도중 에러가 발생했습니다.",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인",
        })
        console.error(error);
    }
})

document.addEventListener('DOMContentLoaded', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const trainerId = queryParams.get('id');
    if (trainerId) {
        fetchTrainerDetails(trainerId);
    } else {
        document.getElementById('trainerDetails').innerHTML = '트레이너 정보를 찾을 수 없습니다.';
    }
});

function fetchTrainerDetails(trainerId) {
    const dbRequest = window.indexedDB.open(DB_NAME, DB_Version); //DB OPEN

    dbRequest.onsuccess = event => {
        const db = event.target.result;
        const transaction = db.transaction(['trainers'], 'readonly');
        const store = transaction.objectStore('trainers');
        const request = store.get(Number(trainerId));

        request.onsuccess = () => {
            const trainer = request.result;
            if (trainer) {
                currentTrainer = trainer;
                displayTrainerDetails(currentTrainer);
            } else {
                document.getElementById('trainerDetails').innerHTML = '트레이너 정보를 찾을 수 없습니다.';
            }
        };
    };
}

function displayTrainerDetails() {
    const detailsContainer = document.querySelector('.tranier-list__items');
    detailsContainer.innerHTML = `
    <div class="form__field-group">
    <label for="id" class="form__label">트레이너 ID</label>
    <input type="text" class="form__field form__field--text" id="id" value="${currentTrainer.id}" readonly/>
    </div>

    <div class="form__field-group">
    <label for="name" class="form__label">트레이너 이름</label>
    <input type="text" class="form__field form__field--text" id="name" value="${currentTrainer.name}" readonly/>
    </div>

    <div class="form__field-group">
    <label for="address" class="form__label">트레이너 주소</label>
    <input type="text" class="form__field form__field--text" id="address" value="${currentTrainer.address}" readonly/>
    </div>

    <div class="form__field-group">
    <label for="address" class="form__label">가입일</label>
    <input type="text" class="form__field form__field--text" id="address" value="${currentTrainer.createdAt}" readonly/>
    </div>

    <div class="form__preview">
    <img src="${currentTrainer.profileImage}" alt="${currentTrainer.name}"/>
    </div>
    `;
}

function editTrainer() {
    editButton.classList.add("hidden");
    updateButton.classList.remove("hidden");
    imageInput.classList.remove("hidden");
    deleteImgButton.classList.remove("hidden");

    const name = document.getElementById("name");
    const address = document.getElementById("address");

    name.readOnly = false;
    address.readOnly = false;
}

async function deleteTrainer(trainerId) {
    const dbRequest = window.indexedDB.open(DB_NAME, DB_Version); //DB OPEN

    dbRequest.onsuccess = async (event) => {
        const db = event.target.result;
        const tx = db.transaction('trainers', 'readwrite');
        const store = tx.objectStore('trainers');

        await store.delete(Number(trainerId));
        await tx.complete;

        Swal.fire({
            text: "트레이너 삭제가 완료되었습니다.",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = "trainerlist.html";
            }
        });
    };

    dbRequest.onerror = (event) => {
        console.error('Database error:', event.target.error);
    };
}

function upDateTrainer(trainerId) {
    const updatedName = document.getElementById("name").value;
    const updatedAddress = document.getElementById("address").value;

    if (!updatedName.trim() || !updatedAddress.trim()) {
        Swal.fire({
            text: "이름과 주소는 반드시 입력해야 합니다.",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인"
        });
        return;
    }

    const file = imageInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imageData = event.target.result;
            upDateToDB(trainerId, updatedName, updatedAddress, imageData);
        }
        reader.readAsDataURL(file);
    } else {
        upDateToDB(trainerId, updatedName, updatedAddress, currentTrainer.profileImage);
    }
}

function upDateToDB(trainerId, name, address, imageData) {
    const dbRequest = window.indexedDB.open(DB_NAME, DB_Version);
    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const tx = db.transaction('trainers', 'readwrite');
        const store = tx.objectStore('trainers');

        const updatedTrainer = {
            id: Number(trainerId),
            name: name,
            address: address,
            profileImage: imageData
        };

        const updateRequest = store.put(updatedTrainer);

        updateRequest.onsuccess = () => {
            Swal.fire({
                text: "트레이너 정보가 성공적으로 업데이트 되었습니다.",
                confirmButtonColor: "#5185c5",
                confirmButtonText: "확인"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "trainerlist.html";
                }
            });
        };

        updateRequest.onerror = (event) => {
            console.error("업데이트 에러:" + event.target.error);
        }
    };
}

deleteImgButton.addEventListener("click", ()=>{
    try {
        Swal.fire({
            text: "기존 이미지를 삭제 하시겠습니까?",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인",
            showCancelButton: true,
            cancelButtonText: "취소",
        }).then((result) => {
            if (result.isConfirmed) {
                updateTrainerImage(currentTrainer.id,DEFAULT_IMAGE);
            }
        });
    } catch (error) {
        Swal.fire({
            text: "이미지 삭제하는 도중 에러가 발생했습니다.",
            confirmButtonColor: "#5185c5",
            confirmButtonText: "확인",
        })
        console.error(error);
    }
})

function updateTrainerImage(trainerId, imageData) {
    const dbRequest = window.indexedDB.open(DB_NAME, DB_Version);
    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['trainers'], 'readwrite');
        const store = transaction.objectStore('trainers');

        const request = store.get(Number(trainerId));
        request.onsuccess = () => {
            const trainer = request.result;
            trainer.profileImage = imageData; // 기본 이미지로 변경

            const updateRequest = store.put(trainer);
            updateRequest.onsuccess = () => {
                Swal.fire({
                    text: "트레이너 프로필 이미지가 성공적으로 삭제 되었습니다.",
                    confirmButtonColor: "#5185c5",
                    confirmButtonText: "확인"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            };
            updateRequest.onerror = (event) => {
                console.error("업데이트 에러:" + event.target.error);
            }
        };
    };
}

imageInput.addEventListener('change', function (event) {
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
