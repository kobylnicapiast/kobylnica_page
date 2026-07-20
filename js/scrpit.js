const anthemBtn = document.getElementById("anthemBtn");
const anthemAudio = document.getElementById("anthemAudio");

if (anthemBtn && anthemAudio) {

    anthemBtn.addEventListener("click", () => {

        if (anthemAudio.paused) {
            anthemAudio.play();
            anthemBtn.classList.add("playing");
        } else {
            anthemAudio.pause();
            anthemAudio.currentTime = 0;
            anthemBtn.classList.remove("playing");
        }

    });

    anthemAudio.addEventListener("ended", () => {
        anthemBtn.classList.remove("playing");
    });

}