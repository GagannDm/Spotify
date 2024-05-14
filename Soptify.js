let currentSong = new Audio();
let toggle = 0;
let songs;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "0:00";
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    return minutes + ":" + (remainingSeconds < 10 ? "0" : "") + Math.floor(remainingSeconds);
}

async function getSongs() {
    let songs = await fetch("http://127.0.0.1:3000/Web_Development/Simple_Projects/Spotify/Songs");
    let response = await songs.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songsArray = [];
    for (let i = 0; i < as.length; i++) {
        let element = as[i];
        if (element.href.endsWith(".mp3")) {
            songsArray.push(element.href.split("/Songs/")[1]);
        }
    }
    return songsArray;
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/Web_Development/Simple_Projects/Spotify/Songs/" + track;
    if (!pause) {
        currentSong.play();
        play.src = "svg/pause.svg";
    }
    document.querySelector(".song-info").innerHTML = decodeURI(track);

}


async function main() {
    let songs = await getSongs();
    playMusic(songs[0], true)
    //  Shows all the songs in PlayLIst
    let songsUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (let song of songs) {
        songsUL.innerHTML = songsUL.innerHTML + `<li>
                                                    <img src="svg/music.svg" alt="">
                                                    <div class="songinfo">
                                                        <span>${song.replaceAll("%20", " ")}</span>
                                                        <div>Gagan</div>
                                                    </div>
                                                    <img class="invert" src="svg/newPlay.svg" alt="">
                                                </li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            let track = e.querySelector(".songinfo").firstElementChild.innerHTML.trim();
            playMusic(track);
        })
    });

    let play = document.querySelector("#play");
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "svg/palybtn.svg"

        }
    });

    document.querySelector(".song-time").innerHTML = "0:00" + "/" + "0:00";

    // Listen event for TimeUpdate
    currentSong.addEventListener("timeupdate", () => {
        let duration = (secondsToMinutesSeconds(currentSong.duration));
        let currentTime = secondsToMinutesSeconds(currentSong.currentTime);
        document.querySelector(".song-time").innerHTML = currentTime + "/" + duration;
        document.querySelector(".circle").style.left = 19 + currentSong.currentTime / currentSong.duration * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        // console.log(e.offsetX / e.target.getBoundingClientRect().width * 100);
        document.querySelector(".circle").style.left = e.offsetX / e.target.getBoundingClientRect().width * 100 + "%";
    })

    // Add an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        if (toggle == 0) {
            let left = document.querySelector(".left");
            left.style.display = "block";
            left.style.left = "0%";
            left.style.transition = "transition: all 0.3s ease-out";
            toggle = 1;
        }
        else if (toggle == 1) {
            let left = document.querySelector(".left");
            left.style.display = "none";
            left.style.left = "-100%";
            left.style.position = "absolute";
            left.style.transition = "left 3s ease-in-out 3s";
            toggle = 0;
        }
    })
    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
        else {
            playMusic(songs[songs.length - 1]);
        }


    })
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").splice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
        else {
            playMusic(songs[0]);
        }
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener
    ("change",(e)=>{
        currentSong.volume=parseInt(e.target.value)/100
        
    })
}


main();
