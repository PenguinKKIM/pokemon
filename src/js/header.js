const nav = document.querySelector('.header__nav');
const btn = document.querySelector('.nav-btn');

btn.addEventListener('click', ()=>{
    nav.classList.toggle('hidden');
})
