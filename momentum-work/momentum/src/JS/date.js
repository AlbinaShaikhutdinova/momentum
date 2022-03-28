const time = document.querySelector('.time');
const appDate = document.querySelector('.date');
const greeting = document.querySelector('.greeting');
const body = document.querySelector('body');
const slideNext = document.querySelector('.slide-next');
const slidePrev = document.querySelector('.slide-prev');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const city = document.querySelector('.city');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuoteButton = document.querySelector('.change-quote');
const settings = document.querySelector('.settings-icon');
const langSettings = document.getElementsByClassName('input-language');
const photoSrcSettings = document.getElementsByClassName('input-photo-source');
const settingsSwitch = document.getElementsByClassName('switch');
const photoSrcAPI = document.getElementsByClassName('photo-source-api');
const photoTag = document.getElementsByClassName('settings-photo-tag');
const settingsInput = document.getElementsByClassName('settings-input');
const playListIcon = document.querySelector('.play-list-icon');
let userName = document.querySelector('.name');
let randomNum;

let hiddenElements=[];
const state = {
    language: 'en',
    photoSource: 'github',
    blocks: ['time', 'date','greeting', 'quote', 'weather', 'audio', 'todolist']
}
  

const greetingTranslation = {
    ru: "Добр",
    en: "Good",
}


function showTime() {
    let lang = state.language;
    const date = new Date();
    const currentTime = date.toLocaleTimeString();
    time.textContent=currentTime;
    showDate(lang);
    showGreeting(lang);
    setTimeout(showTime, 1000);
}

function showDate(lang){
    const date = new Date();
    const options = {weekday:'long', month: 'long', day: 'numeric'};
    let currentDate;
    if(lang=='ru')
        currentDate = date.toLocaleDateString('ru-RU', options);
    else  currentDate = date.toLocaleDateString('en-US', options);
    appDate.textContent = currentDate;
}

function showGreeting(lang){
    const timeOfDay = getTimeOfDay(lang);
    if(lang=='ru')
    {
        let ending =getRightEnding(timeOfDay);
        greeting.textContent = `${greetingTranslation[lang]}${ending} ${timeOfDay},`;
    }
    else {
        greeting.textContent = `${greetingTranslation[lang]} ${timeOfDay},`;
    }
}

function getRightEnding(time){
    let str;
    switch(time){
        case 'утро': str='ое';
        break;
        case 'ночи': str='ой';
        break;
        default: str='ый';
    }
    return str;

}

function getTimeOfDay(lang){
    const date = new Date();
    const hours = date.getHours();
    let str='';
    if(lang=='ru'){
        if(hours>=6 && hours<12)
        {
            str='утро';
        }
        else if(hours>=12 && hours<18)
        {
            str='день';
        }
        else if(hours>=00 && hours<6)
        {
            str='ночи';
        }
        else if(hours>=18)
        {
            str='вечер';
        }
    }
    else{
        if(hours>=6 && hours<12)
        {
            str='morning';
        }
        else if(hours>=12 && hours<18)
        {
            str='afternoon';
        }
        else if(hours>=00 && hours<6)
        {
            str='night';
        }
        else if(hours>=18)
        {
            str='evening';
        }
    }
   
    return str;

}

function setLocalStorage() {
    localStorage.setItem('name', userName.value);
    localStorage.setItem('city', city.value);
    localStorage.setItem('language',state.language);
    localStorage.setItem('photoSrc',state.photoSource);
    localStorage.setItem('hiddenElems',JSON.stringify(hiddenElements));
}

function getLocalStorage() {
    if(localStorage.getItem('name')) {
        userName.value = localStorage.getItem('name');
    }
    if(localStorage.getItem('city')) {
        city.value = localStorage.getItem('city');
    }
    if(localStorage.getItem('language')) {
        state.language = localStorage.getItem('language');
    }
    if(localStorage.getItem('photoSrc')) {
        state.photoSource = localStorage.getItem('photoSrc');
    }
    if(localStorage.getItem('hiddenElems')) {
        hiddenElements=JSON.parse(localStorage.getItem('hiddenElems'));
        for(let el of hiddenElements){
            hideWidgets(el);
            document.getElementById(el).querySelector('input').checked=false;
        }
    } 
    setLanguage();
    setPhotoSource();
    showTime();   
}

function getRandomNum(){
    const max = 20;
    const min =1;
    randomNum= Math.floor(Math.random() * (max - min + 1) + min);
}

function setBg(){ 
    const img = new Image();
    const timeOfDay = getTimeOfDay('en');
    let bgNum = randomNum.toString().padStart(2,'0');  
    img.src = `https://raw.githubusercontent.com/AlbinaShaikhutdinova/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;  
    img.onload = () => {      
      body.style.backgroundImage = `url(${img.src})`;
    }; 
    
    
}
function getNextSlideGH(){
    if(randomNum===20)
        randomNum=1;
    else randomNum+=1;
    setBg();
}
function getPrevSlideGH(){
    if(randomNum===1)
        randomNum=20;
    else randomNum-=1;
    setBg();
}

function getSlideNext(){
    switch(state.photoSource){
        case 'github':getNextSlideGH();
        break;
        case 'unsplash':getLinkToImageUnsplash();
        break;
        case 'flickr': getLinkToImageFlickr();
        break;
    }
}
function getSlidePrev(){
    switch(state.photoSource){
        case 'github':getPrevSlideGH();
        break;
        case 'unsplash':getLinkToImageUnsplash();
        break;
        case 'flickr': getLinkToImageFlickr();
        break;
    }
}

async function getWeather() {  
    if(!city.value|| city.value=='Minsk'||city.value=='Минск')
    {
        if(state.language=='en')
            city.value='Minsk';
        else city.value='Минск';
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${state.language}&appid=769445a3d2e95bee914ff68da3f345a8&units=metric`;
    try{
        const res = await fetch(url);
        const data = await res.json(); 
        weatherIcon.className = 'weather-icon owf';
        weatherIcon.classList.add(`owf-${data.weather[0].id}`);
        temperature.textContent = `${Math.round(data.main.temp)}°C`;
        weatherDescription.textContent = `${data.weather[0].description}`;
        if(state.language=='ru')
        {
            wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)} м/с`;
            humidity.textContent = `Влажность: ${data.main.humidity}%`;
        }
        else{
            wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
            humidity.textContent = `Humidity: ${data.main.humidity}%`;
        }
    }
    catch{
        weatherDescription.textContent="";
        wind.textContent = "";
        humidity.textContent ="";
        if(state.language=='ru')
        {
            temperature.textContent='Ошибка!\n Город не найден';
        }
        else{
            temperature.textContent='Error!\n City not found';
        }

    }
    
    //console.log(data.weather[0].id, data.weather[0].description, data.main.temp);
    
   
}


async function getQuotes() {    
    if(state.language=='en'){
        const quotes = './data.json';       
        const rand = getBigRandomNum(1643,1);
        const res = await fetch(quotes);
        const data = await res.json(); 
        quote.textContent=`${data[rand].text}`;
        author.textContent=data[rand].author;
    }
    else{
        const quotes = './data-ru.json';       
        const rand = getBigRandomNum(14,1);
        const res = await fetch(quotes);
        const data = await res.json(); 
        quote.textContent=`${data[rand].text}`;
        author.textContent=data[rand].author;
    } 
}

function getBigRandomNum(max, min){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function showSettings(){
    const container = document.querySelector('.settings-container');
    container.classList.toggle('hidden');
}

function setLanguage(e){
    try{
        state.language = e.target.value;
    }
    catch{
        for(let el of langSettings)
        {
            if(state.language==el.value)
                el.checked=true;
        }
    }
    getWeather();
    setNamePlaceholder(state.language);
    getQuotes();
    translateSettings();
    setTodoLanguage();
}
function setTodoLanguage(){
    const todoIcon = document.querySelector('.todo-icon');
    const inputTodo = document.querySelector('.input-text.todo');
    const todoTitle = document.querySelector('.todo-container').querySelector('.section-title');
    if(state.language=='en')
    {
        todoIcon.textContent='Todo';
        inputTodo.placeholder='todo';
        todoTitle.textContent='Todo List';
    }
    else{
        todoIcon.textContent='Список дел';
        inputTodo.placeholder='Новое дело...';
        todoTitle.textContent='Список дел';
    }
}

function setNamePlaceholder(lang){
    if(lang=='en')
        userName.placeholder='enter your name';
    else userName.placeholder='введите ваше имя';
}
function setPhotoSource(e){
    for(let el of settingsInput)
    {
        el.style.height=0;
        el.value="";
    }
    for(let el of photoTag)
    {
        el.style.height=0;
        el.style.opacity=0;
    }
    try{
        state.photoSource=e.target.value;
    }
    catch{
        for(let el of photoSrcSettings)
        {
            if(state.photoSource==el.value)
                el.checked=true;
        }
    }
   goToBg();

}

function goToBg(){
    switch(state.photoSource){
        case 'github': setBg();
        break;
        case 'unsplash':getLinkToImageUnsplash();
        break;
        case 'flickr': getLinkToImageFlickr();
        break;
    }
}

async function getLinkToImageUnsplash() {
    let tag = getTag();
    const url = `https://api.unsplash.com/photos/random?orientation=landscape&query=${tag}&client_id=Fs60Jc87IwVGVA_Di-b1jtjbNPFmebyljvS0UiJjg5g`;
    const res = await fetch(url);
    const data = await res.json();
    const img = new Image();
    img.src = data.urls.regular;
    img.onload = () => {      
      body.style.backgroundImage = `url(${img.src})`;
    }; 
}
   
async function getLinkToImageFlickr() {
    let tag = getTag();
    if(randomNum===20)
        randomNum=1;
    else randomNum+=1;
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=8536f88dce4dc65b5f068d33810bc920&tags=${tag}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    const img = new Image();
    img.src = data.photos.photo[randomNum].url_l;
    img.onload = () => {      
      body.style.backgroundImage = `url(${img.src})`;
    }; 
}

function getWidgets(e){
    let target = e.currentTarget;
    console.log(target);
    const pageItemId = target.closest('.page-item').id;
    if(target.querySelector('input').checked)
    {   
        if(hiddenElements.includes(pageItemId))
        {
            const index = hiddenElements.indexOf(pageItemId);
            hiddenElements.splice(index, 1);
        }
        showWidgets(pageItemId);
    }
    else{
        hiddenElements.push(pageItemId);
        hideWidgets(pageItemId);
    }
}

function showWidgets(pageItemId){
    switch(pageItemId){
        case 'i_1':{
            document.querySelector('.weather').style.visibility = "visible";
            document.querySelector('.weather').style.opacity ="1";
        }

        break;
        case 'i_2':{
            document.querySelector('.player').style.visibility = "visible";
            document.querySelector('.player').style.opacity ="1";
        }
        break;
        case 'i_3':{
            document.querySelector('.quote-container').style.visibility = "visible";
            document.querySelector('.quote-container').style.opacity ="1";
        }
        break;
        case 'i_4':{
            time.style.visibility = "visible";
            time.style.opacity ="1";
        }
        break;
        case 'i_5':{
            appDate.style.visibility = "visible";
            appDate.style.opacity ="1";
        }
        break;
        case 'i_6':{
            document.querySelector('.greeting-container').style.visibility = "visible";
            document.querySelector('.greeting-container').style.opacity ="1";
        }
        break;
        case 'i_7':{
            document.querySelector('.todo-icon').style.visibility = "visible";
            document.querySelector('.todo-icon').style.opacity = "0.8";
        }
        break;
    }
}

function hideWidgets(pageItemId){
    switch(pageItemId){
        case 'i_1':{
            setTimeout(() =>{document.querySelector('.weather').style.visibility = "hidden"},500);
            document.querySelector('.weather').style.opacity = "0";
        }
        break;
        case 'i_2':{
            setTimeout(() =>{document.querySelector('.player').style.visibility = "hidden"},500);
            document.querySelector('.player').style.opacity = "0";
        }
        break;
        case 'i_3':{
            setTimeout(() =>{document.querySelector('.quote-container').style.visibility = "hidden"},500);
            document.querySelector('.quote-container').style.opacity = "0";
        }
        break;
        case 'i_4':{
            setTimeout(() =>{time.style.visibility = "hidden"},500);
            time.style.opacity = "0";
        }
        break;
        case 'i_5':{
            setTimeout(() =>{appDate.style.visibility = "hidden"},500);
            appDate.style.opacity = "0";
        }
        break;
        case 'i_6':{
            setTimeout(() =>{document.querySelector('.greeting-container').style.visibility = "hidden"},500);
            document.querySelector('.greeting-container').style.opacity = "0";
        }
        break;
        case 'i_7':{
            setTimeout(() =>{document.querySelector('.todo-icon').style.visibility = "hidden"},500);
            document.querySelector('.todo-icon').style.opacity = "0";
        }
        break;
    }

}

function showTagChoice(e){
    const lbl = e.target.closest('label');
    const nextLabel =lbl.nextElementSibling;
    nextLabel.style.height = '40px';
    nextLabel.style.opacity = '1';
    nextLabel.querySelector('input').style.height='30px';
}


function getTag(){
    for(let el of settingsInput)
    {
        if(el.value!==""){
            return el.value;
        }
        
    }
    return getTimeOfDay('en');
}

const settingsRu = {
    langSet: 'Язык',
    enSet:'Английский',
    ruSet:'Русский',
    photoSrcSet:'Источник фото',
    ghSet:'GitHub',
    unsplashSet:'Unsplash API',
    flickrSet:'Flickr API',
    tagSet:'Добавить тег:',
    elementsSet:'Показывать элементы',
    weatherSet:'Погода',
    audioSet:'Плеер',
    quoteSet:'Цитата дня',
    timeSet:'Время',
    datSet:'Дата',
    greetSet:'Приветствие',
    todoSet:'Список дел',
}
const settingsEn = {
    langSet: 'Language',
    enSet:'English',
    ruSet:'Russian',
    photoSrcSet:'Photo source',
    ghSet:'GitHub',
    unsplashSet:'Unsplash API',
    flickrSet:'Flickr API',
    tagSet:'Add tag',
    elementsSet:'Show elements',
    weatherSet:'Weather widget',
    audioSet:'Player',
    quoteSet:'Quote of the day',
    timeSet:'Time',
    datSet:'Date',
    greetSet:'Greeting',
    todoSet:'Todo',
}

function translateSettings(){
    const items = document.getElementsByClassName('setting-item');
    let setLang="";
    if(state.language=='en'){
       setLang=settingsEn;
    }
    else  setLang=settingsRu;
    for(let item of items){
        if(item.classList.contains('language'))
        {item.querySelector('.section-title').textContent=setLang.langSet;
        item.getElementsByClassName('radio-container')[0].querySelector('span').textContent=setLang.enSet;
        item.getElementsByClassName('radio-container')[1].querySelector('span').textContent=setLang.ruSet;}
        else if(item.classList.contains('photo-source'))
        {
            item.querySelector('.section-title').textContent=setLang.photoSrcSet;
            item.getElementsByClassName('radio-container')[0].querySelector('span').textContent=setLang.ghSet;
            item.getElementsByClassName('radio-container')[1].querySelector('span').textContent=setLang.unsplashSet;
            item.getElementsByClassName('radio-container')[2].querySelector('span').textContent=setLang.flickrSet;
            item.getElementsByClassName('settings-photo-tag')[0].querySelector('span').textContent=setLang.tagSet;
            item.getElementsByClassName('settings-photo-tag')[1].querySelector('span').textContent=setLang.tagSet;
        }
        else if(item.classList.contains('show'))
        {
            item.querySelector('.section-title').textContent=setLang.elementsSet;
            item.getElementsByClassName('page-item')[0].querySelector('span').textContent=setLang.weatherSet;
            item.getElementsByClassName('page-item')[1].querySelector('span').textContent=setLang.audioSet;
            item.getElementsByClassName('page-item')[2].querySelector('span').textContent=setLang.quoteSet;
            item.getElementsByClassName('page-item')[3].querySelector('span').textContent=setLang.timeSet;
            item.getElementsByClassName('page-item')[4].querySelector('span').textContent=setLang.datSet;
            item.getElementsByClassName('page-item')[5].querySelector('span').textContent=setLang.greetSet;
            item.getElementsByClassName('page-item')[6].querySelector('span').textContent=setLang.todoSet;

        }



    }
    
}

function togglePlayList(){
    const playList = document.querySelector('.play-list');
    playList.classList.toggle('show');
}
  
  window.addEventListener('load', getLocalStorage)
  window.addEventListener('beforeunload', setLocalStorage)
  slideNext.addEventListener('click', getSlideNext);
  slidePrev.addEventListener('click', getSlidePrev);
  city.addEventListener('change', getWeather);
  changeQuoteButton.addEventListener('click', getQuotes);
  settings.addEventListener('click', showSettings);
  playListIcon.addEventListener('click', togglePlayList);
  for(let el of settingsSwitch)
  {
      el.addEventListener('change', getWidgets);
  }
  for(let el of langSettings)
  {
      el.addEventListener('change', setLanguage);
  }
  for(let el of photoSrcSettings)
  {
      el.addEventListener('change',setPhotoSource );
  }
  for(let el of photoSrcAPI)
  {
      el.addEventListener('change', showTagChoice);
  }
  for(let el of settingsInput)
  {
      el.addEventListener('change', goToBg);
  }

  getQuotes();
  getWeather();
  showTime();
  getRandomNum();

