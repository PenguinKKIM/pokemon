# **[ 트레이너 등록 / 관리 시스템 ]**

### **<필수 요구사항>**
  https://trainer-reg-sys.netlify.app/
- [x] 프로필 페이지를 개발하세요.

- [x] 스크롤이 가능한 형태의 리스팅 페이지를 개발하세요.

- [x] 전체 페이지 데스크탑-모바일 반응형 페이지를 개발하세요.

- [x] 사진을 등록, 수정, 삭제가 가능해야 합니다.

- [x] 유저 플로우를 제작하여 리드미에 추가하세요.

- [x] 페이지가 보여지기 전에 로딩 애니메이션이 보이도록 만들어 보세요.

- [x] 직원 검색 기능을 추가해 보세요.

- [x] infinity scroll 기능을 추가해 보세요.

  - 포켓몬 API 불러오는 곳에서 구현했습니다.

  ```javascript
  function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= limit) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, limit - (Date.now() - lastRan));
      }
    };
  }
  window.addEventListener(
    "scroll",
    throttle(async function () {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        await displayPokemons();
      }
    }, 200),
  );
  ```

  

- [x] LocalStorage를 사용하세요

  - [x] indexedDB 를 사용했습니다.

    ```javascript
    const dbRequest = window.indexedDB.open(DB_NAME, DB_Version); //DB OPEN
    ```

    

- [x] CSS
  - 애니메이션 구현
  - 상대수치 사용(rem, em)

- [x] JavaScript
  - DOM event 조작

## 유저플로우

![](https://raw.githubusercontent.com/PenguinKKIM/pokemon/main/userflow.png)



## 새로 시도해본것

### 데이터 베이스의 사용

- 인터넷에서 불러오는 데이터 베이스와(포켓몬) 로컬에서 저장 할 수 있는 데이터 베이스를 사용했는데, 처음에 적응하느라 힘들었지만,

  막상 사용법을 익히고 나니 엄청 편한 점이 많았었습니다. 특히 IndexedDB 는 나중에 작은 개인프로젝트 할때 유용하게 사용할거같습니다.

### 간편한 모달 API 사용

- Sweetalert 이라는 API를 사용 해봤습니다.

  ```javascript
   Swal.fire({
          html: '<img src="../img/icon/warning_icon.png" style="width:40px; height:40px; margin: 1rem;"><p>이름과 주소는 반드시 입력해야 합니다.</p>',
          confirmButtonColor: "#5185c5",
          confirmButtonText: "확인",
        });
  ```

  기존에 `alert()` 으로 구현하면 alert의 스타일이 변하지 않아 아쉬웠는데, Sweetalert 쓰니 공식 문서만 찬찬히 읽어봐도 스타일이나 버튼 등 을 제 마음대로 바꿀 수 있어서 재밌게 사용했습니다. 앞으로도 종종 사용 할 거 같습니다.

  - 부트 스트랩을 쓸까 하다가 모달 하나만 쓸건데 여러 스타일이 마음대로 정해져서 금방 뺐습니다. 모달만 쓸 방법도 있을까요 ?

## 느낀점

- 익숙해지면 괜찮아진다는 것을 알았습니다. 처음부터 너무 겁먹지 않는게 중요한거같습니다.

## 아쉬운점

- 예외 처리를 최대한 생각하고 했지만 못한 부분이 많아 아쉽습니다 : 수정 폼에 몇개 놓친거같습니다

- 코드를 깔끔하게 정리하지 못해 아쉽습니다 : 기능 구현하기 급급해 이거 저거 막 벌려놓은 기분입니다 ㅠ 리팩토링 때 잘 컴포넌트 화 해서 수정하고 싶습니다.

- min-heigh: 100vh 를 쓰고 싶지 않았는데 무엇을 넣어도 원하는 것 이 안 나와 몇 군데 썼습니다..(index.html 에서 등) ..

- 미리미리 빨리빨리 구상을 하는 습관을 들여야겠습니다.

  

  
