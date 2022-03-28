import playList from './playList';
const play = document.querySelector('.play');
const audio = document.querySelector('audio');
const playNextButton = document.querySelector('.play-next');
const playPrevButton = document.querySelector('.play-prev');
const playListContainer = document.querySelector('.play-list');
const progressBar = document.querySelector('.progress-bar');
//const range = document.querySelector('.audio-progress');
const audioLength = document.querySelector('.audio-time__length');
const volume = document.querySelector('.volume-icon');
const volumeSlider = document.querySelector('.volume-slider');
const audioName = document.querySelector('.audio-name');
const miniPlay = document.getElementsByClassName('playlist-control');
let songArray;
let isPlay = false;
let playNum=0;
let isChanging=false;
let delay = 500;


function playAudio() {
  //audio.src = playList[playNum].src;
  if(isPlay)
  {
      audio.pause();
      isPlay=false;
  }
  else {
    audio.play();
    isPlay=true;
  }
}
 function togglePlay(){
    playAudio();
    if(isPlay)
    {
      play.classList.add('pause');
      document.querySelector('.current').querySelector('.playlist-control').classList.add('pause');
    }
    else {
        play.classList.remove('pause');
        document.querySelector('.current').querySelector('.playlist-control').classList.remove('pause');
    }
 }

function changeCurrentAudio(e){
  const newPlayItem = e.target.closest('.play-item');
  if(newPlayItem.classList.contains('current'))
    togglePlay();
  else {
    if(isPlay)
      document.querySelector('.current').querySelector('.playlist-control').classList.remove('pause');
    songArray[playNum].classList.remove('current');
    playNum=newPlayItem.id;
    setNewAudio();
    isPlay=false;
    togglePlay();
  }


}

 function playNext(){
   if(isPlay)
      document.querySelector('.current').querySelector('.playlist-control').classList.remove('pause');
    songArray[playNum].classList.remove('current');
    if(playNum+2>playList.length)
        playNum=0;
    else playNum++;
    playNewAudio();
 }

 function playPrev(){
    if(isPlay)
      document.querySelector('.current').querySelector('.playlist-control').classList.remove('pause');
    songArray[playNum].classList.remove('current');
    if(playNum-1<0)
        playNum=playList.length - 1;
    else playNum--;
    playNewAudio();
 }

 function playNewAudio(){
    setNewAudio();
    if(isPlay)
        { 
          audio.play();
          document.querySelector('.current').querySelector('.playlist-control').classList.add('pause');      
        }

 }

 function setNewAudio(){
    audioLength.textContent = playList[playNum].duration;
    audio.src = playList[playNum].src;
    audioName.textContent=playList[playNum].title;
    songArray[playNum].classList.add('current');
    audio.currentTime = 0;
 }

 function createPlayList(){
   let i=0;
    playList.forEach(el => {
        const li = document.createElement('li');
        li.classList.add('play-item');
        li.id=i;
        const div = document.createElement('div');
        div.classList.add('playlist-control');
        const span = document.createElement('span');
        span.textContent=el.title;
        li.append(div);
        li.append(span);
        // li.textContent=el.title;
        playListContainer.append(li);
        i++;
    });
    songArray = document.getElementsByClassName('play-item');
    setNewAudio();
 }

setTimeout( function updateProgressBar() {
  if(audio.currentTime==audio.duration)
  {
    playNext();
  }
  progressBar.style.backgroundSize = audio.currentTime / audio.duration * 100 + "%";
  progressBar.value = audio.currentTime / audio.duration * 100;
  document.querySelector(".audio-time__current").textContent = getTimeCodeFromNum(audio.currentTime);
  setTimeout(updateProgressBar,delay);
},delay);



function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;
    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
      seconds % 60
    ).padStart(2, 0)}`;
}

function muteAudio(){
    audio.muted = !audio.muted;
    if(audio.muted)
        volume.classList.add('mute');
    else volume.classList.remove('mute');
}
  

function changeVolume() {
  if(audio.muted)
    muteAudio();
  let target = volumeSlider;
  const min = target.min
  const max = target.max
  const val = target.value
  volumeSlider.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
  if(val==0)
    muteAudio();
  audio.volume=val;
}

function changeAudioProgress(){
    let target = progressBar;
    const min = target.min
    const max = target.max
    const val = target.value
    progressBar.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%';
    audio.currentTime=val/100 * audio.duration;
}

createPlayList();
 playNextButton.addEventListener('click',playNext);
 playPrevButton.addEventListener('click',playPrev);
 play.addEventListener('click', togglePlay);
 volume.addEventListener('click', muteAudio);
 volumeSlider.addEventListener('change',changeVolume);
 progressBar.addEventListener('change',changeAudioProgress);
 for(let el of miniPlay){
   el.addEventListener('click', changeCurrentAudio);
 }

