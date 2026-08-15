/* ==========================================================
   RANG RADIO
========================================================== */


const audio =
    document.getElementById("audioPlayer");

const playButton =
    document.getElementById("playButton");

const songTitle =
    document.getElementById("songTitle");

const songArtist =
    document.getElementById("songArtist");

const visualizer =
    document.getElementById("visualizer");

const ctx =
    visualizer.getContext("2d");


/* ==========================================================
   SONG LIBRARY
========================================================== */

const playlists = {

    romantic: [

        {
            title: "Tum Hi Ho",
            artist: "Romantic • Rang Radio",
            file: "audio/romantic-1.mp3"
        },

        {
            title: "Pehla Nasha",
            artist: "Romantic • Rang Radio",
            file: "audio/romantic-2.mp3"
        },

        {
            title: "Aankhon Se Tune",
            artist: "Romantic • Rang Radio",
            file: "audio/romantic-3.mp3"
        }

    ],


    safar: [

        {
            title: "Yeh Haseen Wadiyan",
            artist: "Safar • Rang Radio",
            file: "audio/safar-1.mp3"
        },

        {
            title: "Ilahi",
            artist: "Safar • Rang Radio",
            file: "audio/safar-2.mp3"
        },

        {
            title: "Safarnama",
            artist: "Safar • Rang Radio",
            file: "audio/safar-3.mp3"
        }

    ],


    bhagwanji: [

        {
            title: "Om Namah Shivaya",
            artist: "Bhakti • Rang Radio",
            file: "audio/bhakti-1.mp3"
        },

        {
            title: "Achyutam Keshavam",
            artist: "Bhakti • Rang Radio",
            file: "audio/bhakti-2.mp3"
        },

        {
            title: "Shree Ram Jai Ram",
            artist: "Bhakti • Rang Radio",
            file: "audio/bhakti-3.mp3"
        }

    ]

};


/* ==========================================================
   CURRENT STATE
========================================================== */

let currentTheme =
    "romantic";

let currentSong =
    0;


/* ==========================================================
   CHANGE THEME
========================================================== */

const themeButtons =
    document.querySelectorAll(".theme-link");

const themes =
    document.querySelectorAll(".theme");


themeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const selectedTheme =
                button.dataset.theme;


            changeTheme(
                selectedTheme
            );

        }
    );

});


function changeTheme(theme) {

    currentTheme =
        theme;

    currentSong =
        0;


    /* Navigation */

    themeButtons.forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.theme === theme
        );

    });


    /* Main theme */

    themes.forEach(section => {

        section.classList.toggle(
            "active",
            section.dataset.themeSection === theme
        );

    });


    /* Load first song */

    loadSong(
        currentSong
    );

}


/* ==========================================================
   LOAD SONG
========================================================== */

function loadSong(index) {

    const playlist =
        playlists[currentTheme];

    const song =
        playlist[index];


    songTitle.textContent =
        song.title;


    songArtist.textContent =
        song.artist;


    audio.src =
        song.file;


    audio.load();

}


/* ==========================================================
   PLAY / PAUSE
========================================================== */

async function toggleMusic() {

    try {

        if (audio.paused) {

            await audio.play();

            playButton.textContent =
                "❚❚";

        }

        else {

            audio.pause();

            playButton.textContent =
                "▶";

        }

    }

    catch(error) {

        console.log(
            "Please add your MP3 files to the audio folder."
        );

    }

}


/* ==========================================================
   NEXT SONG
========================================================== */

function nextSong() {

    const playlist =
        playlists[currentTheme];


    currentSong++;

    if (
        currentSong >=
        playlist.length
    ) {

        currentSong = 0;

    }


    loadSong(
        currentSong
    );


    audio.play()
        .then(() => {

            playButton.textContent =
                "❚❚";

        })
        .catch(() => {});

}


/* ==========================================================
   PREVIOUS SONG
========================================================== */

function previousSong() {

    const playlist =
        playlists[currentTheme];


    currentSong--;

    if (currentSong < 0) {

        currentSong =
            playlist.length - 1;

    }


    loadSong(
        currentSong
    );


    audio.play()
        .then(() => {

            playButton.textContent =
                "❚❚";

        })
        .catch(() => {});

}


/* ==========================================================
   AUTOMATICALLY PLAY NEXT SONG
========================================================== */

audio.addEventListener(
    "ended",
    () => {

        nextSong();

    }
);


/* ==========================================================
   AUDIO VISUALIZER
========================================================== */

let audioContext;

let analyser;

let source;

let dataArray;


function setupVisualizer() {

    if (audioContext) {
        return;
    }


    audioContext =
        new (
            window.AudioContext ||
            window.webkitAudioContext
        )();


    analyser =
        audioContext.createAnalyser();


    analyser.fftSize =
        128;


    dataArray =
        new Uint8Array(
            analyser.frequencyBinCount
        );


    source =
        audioContext
        .createMediaElementSource(
            audio
        );


    source.connect(
        analyser
    );


    analyser.connect(
        audioContext.destination
    );


    drawVisualizer();

}


audio.addEventListener(
    "play",
    () => {

        setupVisualizer();

        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume();

        }

    }
);


/* ==========================================================
   DRAW VISUALIZER
========================================================== */

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
        visualizer.clientWidth;

    const height =
        visualizer.clientHeight;


    const dpr =
        window.devicePixelRatio || 1;


    visualizer.width =
        width * dpr;

    visualizer.height =
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


    const bars = 35;

    const barWidth =
        width / bars;


    for (
        let i = 0;
        i < bars;
        i++
    ) {

        const index =
            Math.floor(
                i *
                dataArray.length /
                bars
            );


        const value =
            dataArray[index];


        const barHeight =
            Math.max(
                3,
                value /
                255 *
                height
            );


        const x =
            i * barWidth;


        const y =
            height -
            barHeight;


        const gradient =
            ctx.createLinearGradient(
                0,
                height,
                0,
                0
            );


        gradient.addColorStop(
            0,
            "#ff4f83"
        );


        gradient.addColorStop(
            .5,
            "#ff9f35"
        );


        gradient.addColorStop(
            1,
            "#7a61ff"
        );


        ctx.fillStyle =
            gradient;


        ctx.beginPath();


        ctx.roundRect(
            x + 2,
            y,
            barWidth - 4,
            barHeight,
            5
        );


        ctx.fill();

    }

}


/* ==========================================================
   IDLE ANIMATION
========================================================== */

function drawIdleVisualizer() {

    if (!visualizer) {
        return;
    }


    const width =
        visualizer.clientWidth;

    const height =
        visualizer.clientHeight;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const time =
        Date.now() / 350;


    const bars = 35;

    const barWidth =
        width / bars;


    for (
        let i = 0;
        i < bars;
        i++
    ) {

        const movement =
            Math.sin(
                time +
                i * .35
            );


        const barHeight =
            5 +
            Math.abs(
                movement
            ) * 15;


        const x =
            i * barWidth;


        const y =
            height -
            barHeight;


        ctx.fillStyle =
            "#ff6c91";


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


setInterval(
    drawIdleVisualizer,
    50
);


/* ==========================================================
   INITIAL SONG
========================================================== */

loadSong(0);
