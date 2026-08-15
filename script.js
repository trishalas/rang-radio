// ==========================================
// RANG RADIO - THEME SWITCHING
// ==========================================

const themeButtons = document.querySelectorAll(".theme-link");
const themes = document.querySelectorAll(".theme");

let currentTheme = "romantic";
let currentSong = 0;


// ==========================================
// PLAYLISTS
// ==========================================

const playlists = {

    romantic: [
        {
            title: "Romantic Melody",
            artist: "Romantic • Rang Radio",
            file: "audio/romantic-1.mp3"
        }
    ],

    safar: [
        {
            title: "Safar",
            artist: "Safar • Rang Radio",
            file: "audio/safar-1.mp3"
        }
    ],

    bhagwanji: [
        {
            title: "Bhakti",
            artist: "Bhagwanji • Rang Radio",
            file: "audio/bhakti-1.mp3"
        }
    ]

};


// ==========================================
// ELEMENTS
// ==========================================

const audio = document.getElementById("audioPlayer");
const playButton = document.getElementById("playButton");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");


// ==========================================
// THEME BUTTON CLICK
// ==========================================

themeButtons.forEach(button => {

    button.addEventListener("click", function () {

        const selectedTheme =
            this.getAttribute("data-theme");

        switchTheme(selectedTheme);

    });

});


// ==========================================
// SWITCH THEME
// ==========================================

function switchTheme(themeName) {

    console.log("Changing theme to:", themeName);

    currentTheme = themeName;
    currentSong = 0;


    // -------------------------------
    // Update navigation buttons
    // -------------------------------

    themeButtons.forEach(button => {

        const buttonTheme =
            button.getAttribute("data-theme");

        if (buttonTheme === themeName) {

            button.classList.add("active");

        } else {

            button.classList.remove("active");

        }

    });


    // -------------------------------
    // Hide ALL themes
    // -------------------------------

    themes.forEach(theme => {

        theme.classList.remove("active");

    });


    // -------------------------------
    // Show selected theme
    // -------------------------------

    const selectedSection =
        document.querySelector(
            `[data-theme-section="${themeName}"]`
        );


    if (selectedSection) {

        selectedSection.classList.add("active");

        console.log(
            "Theme opened:",
            themeName
        );

    } else {

        console.error(
            "Theme section not found:",
            themeName
        );

    }


    // -------------------------------
    // Change song information
    // -------------------------------

    loadSong(themeName, 0);

}


// ==========================================
// LOAD SONG
// ==========================================

function loadSong(themeName, index) {

    const playlist =
        playlists[themeName];

    if (!playlist) {
        return;
    }

    const song =
        playlist[index];

    if (!song) {
        return;
    }


    songTitle.textContent =
        song.title;

    songArtist.textContent =
        song.artist;


    // Only change audio source
    // if the audio element exists

    if (audio) {

        audio.src =
            song.file;

        audio.load();

    }

}


// ==========================================
// PLAY / PAUSE
// ==========================================

function toggleMusic() {

    if (!audio) {
        return;
    }


    if (audio.paused) {

        audio.play()
            .then(() => {

                playButton.textContent = "❚❚";

            })
            .catch(error => {

                console.log(
                    "Audio file not available yet."
                );

            });

    } else {

        audio.pause();

        playButton.textContent = "▶";

    }

}


// ==========================================
// NEXT SONG
// ==========================================

function nextSong() {

    const playlist =
        playlists[currentTheme];

    if (!playlist) {
        return;
    }


    currentSong++;

    if (
        currentSong >=
        playlist.length
    ) {

        currentSong = 0;

    }


    loadSong(
        currentTheme,
        currentSong
    );


    if (audio) {

        audio.play()
            .then(() => {

                playButton.textContent = "❚❚";

            })
            .catch(() => {});

    }

}


// ==========================================
// PREVIOUS SONG
// ==========================================

function previousSong() {

    const playlist =
        playlists[currentTheme];

    if (!playlist) {
        return;
    }


    currentSong--;

    if (currentSong < 0) {

        currentSong =
            playlist.length - 1;

    }


    loadSong(
        currentTheme,
        currentSong
    );


    if (audio) {

        audio.play()
            .then(() => {

                playButton.textContent = "❚❚";

            })
            .catch(() => {});

    }

}


// ==========================================
// INITIAL LOAD
// ==========================================

loadSong("romantic", 0);
