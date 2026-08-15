/* =========================================================
   RANG RADIO
   MUSIC PLAYER + LIVE AUDIO VISUALIZER
========================================================= */


const audio =
    document.getElementById("audioPlayer");

const playButton =
    document.getElementById("playButton");

const heroPlayIcon =
    document.getElementById("heroPlayIcon");

const songTitle =
    document.getElementById("songTitle");

const songArtist =
    document.getElementById("songArtist");

const canvas =
    document.getElementById("visualizer");

const ctx =
    canvas.getContext("2d");


/* =========================================================
   AUDIO ANALYSER
========================================================= */

let audioContext;

let analyser;

let source;

let dataArray;

let isAudioSetup = false;


/* =========================================================
   SETUP AUDIO
========================================================= */

function setupAudio() {

    if (isAudioSetup) {
        return;
    }


    audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    analyser =
        audioContext.createAnalyser();


    analyser.fftSize = 256;


    const bufferLength =
        analyser.frequencyBinCount;


    dataArray =
        new Uint8Array(bufferLength);


    source =
        audioContext.createMediaElementSource(audio);


    source.connect(analyser);

    analyser.connect(
        audioContext.destination
    );


    isAudioSetup = true;


    drawVisualizer();

}


/* =========================================================
   PLAY / PAUSE
========================================================= */

async function toggleMusic() {

    setupAudio();


    if (audioContext.state === "suspended") {

        await audioContext.resume();

    }


    if (audio.paused) {

        try {

            await audio.play();

            updatePlayingState(true);

        }

        catch (error) {

            console.log(
                "Audio could not start:",
                error
            );

        }

    }

    else {

        audio.pause();

        updatePlayingState(false);

    }

}


/* =========================================================
   UPDATE UI
========================================================= */

function updatePlayingState(isPlaying) {

    if (isPlaying) {

        playButton.innerHTML = "❚❚";

        heroPlayIcon.innerHTML = "❚❚";

    }

    else {

        playButton.innerHTML = "▶";

        heroPlayIcon.innerHTML = "▶";

    }

}


/* =========================================================
   AUDIO EVENTS
========================================================= */

audio.addEventListener(
    "play",
    () => updatePlayingState(true)
);


audio.addEventListener(
    "pause",
    () => updatePlayingState(false)
);


audio.addEventListener(
    "ended",
    () => updatePlayingState(false)
);


/* =========================================================
   LIVE VISUALIZER
========================================================= */

function drawVisualizer() {

    requestAnimationFrame(
        drawVisualizer
    );


    if (!analyser) {

        drawIdleVisualizer();

        return;

    }


    analyser.getByteFrequencyData(
        dataArray
    );


    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    const dpr =
        window.devicePixelRatio || 1;


    canvas.width =
        width * dpr;

    canvas.height =
        height * dpr;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const bars = 40;

    const barWidth =
        width / bars;


    for (
        let i = 0;
        i < bars;
        i++
    ) {

        const dataIndex =
            Math.floor(
                i *
                dataArray.length /
                bars
            );


        const value =
            dataArray[dataIndex];


        const barHeight =
            Math.max(
                4,
                (value / 255) *
                height
            );


        const x =
            i * barWidth;


        const y =
            height - barHeight;


        /* Gradient */

        const gradient =
            ctx.createLinearGradient(
                0,
                height,
                0,
                0
            );


        gradient.addColorStop(
            0,
            "#ffb62e"
        );


        gradient.addColorStop(
            .5,
            "#ff557c"
        );


        gradient.addColorStop(
            1,
            "#d66cff"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();


        ctx.roundRect(
            x + 2,
            y,
            barWidth - 4,
            barHeight,
            4
        );


        ctx.fill();

    }


    /* Draw flowing line */

    drawWave(
        dataArray,
        width,
        height
    );

}


/* =========================================================
   FLOWING WAVE
========================================================= */

function drawWave(
    data,
    width,
    height
) {

    ctx.beginPath();


    const points = 80;


    for (
        let i = 0;
        i < points;
        i++
    ) {

        const index =
            Math.floor(
                i *
                data.length /
                points
            );


        const amplitude =
            data[index] / 255;


        const x =
            (i / (points - 1)) *
            width;


        const center =
            height * .55;


        const y =
            center -
            amplitude *
            height *
            .45;


        if (i === 0) {

            ctx.moveTo(
                x,
                y
            );

        }

        else {

            ctx.lineTo(
                x,
                y
            );

        }

    }


    ctx.strokeStyle =
        "rgba(255,255,255,.8)";


    ctx.lineWidth = 1.5;


    ctx.stroke();

}


/* =========================================================
   IDLE VISUALIZER
========================================================= */

function drawIdleVisualizer() {

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const bars = 40;

    const barWidth =
        width / bars;


    const time =
        Date.now() / 400;


    for (
        let i = 0;
        i < bars;
        i++
    ) {

        const wave =
            Math.sin(
                time + i * .35
            );


        const barHeight =
            10 +
            Math.abs(wave) * 20;


        const x =
            i * barWidth;


        const y =
            height - barHeight;


        const gradient =
            ctx.createLinearGradient(
                0,
                height,
                0,
                0
            );


        gradient.addColorStop(
            0,
            "#ffb62e"
        );


        gradient.addColorStop(
            1,
            "#ff557c"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();


        ctx.roundRect(
            x + 2,
            y,
            barWidth - 4,
            barHeight,
            4
        );


        ctx.fill();

    }

}


/* =========================================================
   SONG DATA
========================================================= */

const songs = [

    {
        title: "Lag Ja Gale",
        artist: "Lata Mangeshkar",
        file: "audio/song.mp3"
    },

    {
        title: "Pehla Nasha",
        artist: "Udit Narayan & Sadhana Sargam",
        file: "audio/song.mp3"
    },

    {
        title: "Chura Liya Hai Tumne",
        artist: "Asha Bhosle & Mohammed Rafi",
        file: "audio/song.mp3"
    },

    {
        title: "Kabhi Kabhi Mere Dil Mein",
        artist: "Mukesh",
        file: "audio/song.mp3"
    },

    {
        title: "Tujhe Dekha To",
        artist: "Kumar Sanu & Lata Mangeshkar",
        file: "audio/song.mp3"
    }

];


let currentSong = 0;


/* =========================================================
   PLAY SELECTED SONG
========================================================= */

function playSong(
    title,
    artist
) {

    songTitle.innerText =
        title;

    songArtist.innerText =
        artist;


    setupAudio();


    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    audio.play()
        .then(() => {

            updatePlayingState(true);

        })
        .catch(
            console.log
        );

}


/* =========================================================
   NEXT SONG
========================================================= */

function nextSong() {

    currentSong++;

    if (
        currentSong >=
        songs.length
    ) {

        currentSong = 0;

    }


    const song =
        songs[currentSong];


    songTitle.innerText =
        song.title;


    songArtist.innerText =
        song.artist;


    audio.src =
        song.file;


    audio.load();


    audio.play()
        .then(() => {

            updatePlayingState(true);

        });

}


/* =========================================================
   PREVIOUS SONG
========================================================= */

function previousSong() {

    currentSong--;

    if (currentSong < 0) {

        currentSong =
            songs.length - 1;

    }


    const song =
        songs[currentSong];


    songTitle.innerText =
        song.title;


    songArtist.innerText =
        song.artist;


    audio.src =
        song.file;


    audio.load();


    audio.play()
        .then(() => {

            updatePlayingState(true);

        });

}


/* =========================================================
   SCROLL TO PLAYER
========================================================= */

function scrollToPlayer() {

    document
        .getElementById("player")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        if (canvas) {

            canvas.width =
                canvas.clientWidth *
                window.devicePixelRatio;

            canvas.height =
                canvas.clientHeight *
                window.devicePixelRatio;

        }

    }
);


/* =========================================================
   START IDLE VISUALIZER
========================================================= */

setInterval(
    () => {

        if (
            !audio ||
            audio.paused
        ) {

            drawIdleVisualizer();

        }

    },
    50
);
