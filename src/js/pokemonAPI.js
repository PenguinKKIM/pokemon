let offset = 0;
const limit = 20;
let isFetching = false;

const searchForm = document.querySelector(".searchForm");
const searchText = document.querySelector(".searchText");
const searchBtn = document.querySelector(".searchBtn");

async function setPokeNameEn(offset, limit) {
  try {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/?offset=${offset}&limit=${limit}`;
    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      const pokeNum = data.results.map(item => {
        const urlNum = item.url.match(/\/pokemon-species\/(\d+)\/$/);
        return urlNum ? urlNum[1] : null;
      });
      return pokeNum;
    } else {
      console.error(response.status);
      return [];
    }
  } catch (error) {
    console.error("서버와의 통신이 실패하였습니다.", error);
    throw error;
  }
}

async function setPokeNameKor(pokeNum) {
  try {
    const pokeNames = pokeNum.map(async name => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
      if (response.ok) {
        const data = await response.json();
        const pokemonKoreanNames = data.names.find(name => name.language.name === "ko").name;
        return pokemonKoreanNames;
      } else {
        console.error(response.status);
        return null;
      }
    });
    const setKorName = await Promise.all(pokeNames);
    return setKorName.filter(name => name !== null);
  } catch (error) {
    console.error("한국어 이름을 가져오는 도중 오류가 발생했습니다.", error);
    return [];
  }
}

async function setPokeImg(pokeNum) {
  // https://pokeapi.co/api/v2/pokemon-form/
  try {
    const pokeImgs = pokeNum.map(async name => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${name}`);
      if (response.ok) {
        const data = await response.json();
        const pokeImg = data.sprites.front_default;
        return pokeImg;
      } else {
        console.log(response.status);
        return null;
      }
    });
    const setPokeImg = await Promise.all(pokeImgs);
    return setPokeImg;
  } catch (error) {
    console.error(error);
  }
}

async function setPokeTypes(pokeNum) {
  // https://pokeapi.co/api/v2/pokemon-form/
  try {
    const pokeTypes = pokeNum.map(async name => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon-form/${name}`);
      if (response.ok) {
        const data = await response.json();
        const pokeTypes = data.types.map(type => type.type.name);
        return pokeTypes;
      } else {
        console.log(response.status);
        return null;
      }
    });
    const setPokeType = await Promise.all(pokeTypes);
    return setPokeType;
  } catch (error) {
    console.error(error);
  }
}

async function displayPokemons() {
  if (isFetching) return;
  isFetching = true;

  const pokeNum = await setPokeNameEn(offset, limit);
  const pokemonKoreanNames = await setPokeNameKor(pokeNum);
  const pokemonImgs = await setPokeImg(pokeNum);
  const pokeTypes = await setPokeTypes(pokeNum);

  const listElement = document.querySelector(".pokemonList");

  if (!listElement) {
    console.error("표시할 아이템이 없습니다");
    return;
  }

  pokemonKoreanNames.forEach((koreanName, index) => {
    const listItem = document.createElement("li");
    listItem.classList.add("pokemon-list__item");

    const nameDiv = document.createElement("div");
    const nameText = document.createTextNode(koreanName);
    nameDiv.appendChild(nameText);
    listItem.appendChild(nameDiv);
    nameDiv.classList.add("pokemon-list__name");

    const imgItem = document.createElement("img");
    imgItem.src = pokemonImgs[index];
    listItem.appendChild(imgItem);
    listElement.appendChild(listItem);
    imgItem.classList.add("pokemon-list__img");

    const typeItems = document.createElement("div");
    pokeTypes[index].forEach(type => {
      const typeItem = document.createElement("div");
      typeItem.innerText = type;
      typeItems.appendChild(typeItem);
      typeItem.classList.add("pokemon-list__type");
      switch (type) {
        case "grass":
          typeItem.classList.add("grass");
          typeItem.innerText = "풀";
          break;
        case "poison":
          typeItem.classList.add("poison");
          typeItem.innerText = "독";
          break;
        case "fire":
          typeItem.classList.add("fire");
          typeItem.innerText = "불꽃";
          break;
        case "normal":
          typeItem.classList.add("normal");
          typeItem.innerText = "노말";
          break;
        case "fighting":
          typeItem.classList.add("fighting");
          typeItem.innerText = "격투";
          break;
        case "flying":
          typeItem.classList.add("flying");
          typeItem.innerText = "비행";
          break;
        case "ground":
          typeItem.classList.add("ground");
          typeItem.innerText = "땅";
          break;
        case "rock":
          typeItem.classList.add("rock");
          typeItem.innerText = "돌";
          break;
        case "bug":
          typeItem.classList.add("bug");
          typeItem.innerText = "벌레";
          break;
        case "ghost":
          typeItem.classList.add("ghost");
          typeItem.innerText = "고스트";
          break;
        case "steel":
          typeItem.classList.add("steel");
          typeItem.innerText = "강철";
          break;
        case "water":
          typeItem.classList.add("water");
          typeItem.innerText = "물";
          break;
        case "electric":
          typeItem.classList.add("electric");
          typeItem.innerText = "전기";
          break;
        case "psychic":
          typeItem.classList.add("psychic");
          typeItem.innerText = "에스퍼";
          break;
        case "ice":
          typeItem.classList.add("ice");
          typeItem.innerText = "얼음";
          break;
        case "dragon":
          typeItem.classList.add("dragon");
          typeItem.innerText = "드래곤";
          break;
        case "dark":
          typeItem.classList.add("dark");
          typeItem.innerText = "악";
          break;
        case "fairy":
          typeItem.classList.add("fairy");
          typeItem.innerText = "페어리";
          break;
        case "unknown":
          typeItem.classList.add("unknown");
          typeItem.innerText = "불명";
          break;
        case "shadow":
          typeItem.classList.add("shadow");
          typeItem.innerText = "새도우";
          break;
      }
    });
    listItem.appendChild(typeItems);
    listElement.appendChild(listItem);
    typeItems.classList.add("pokemon-list__types");
  });

  isFetching = false;
  offset += limit;
}

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

displayPokemons();

window.addEventListener(
  "scroll",
  throttle(async function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      await displayPokemons();
    }
  }, 200),
);
