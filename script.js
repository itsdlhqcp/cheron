// Get video and control elements
const video = document.getElementById('mainVideo');
const muteBtn = document.getElementById('muteBtn');
const playBtn = document.getElementById('playBtn');
const volumeIcon = document.getElementById('volumeIcon');
const playIcon = document.getElementById('playIcon');
const loading = document.getElementById('loading');
const qualityIndicator = document.getElementById('qualityIndicator');

// Video loading and auto-play setup
video.addEventListener('loadedmetadata', function() {
    // Hide loading screen
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 1000);

    // Force play the video
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('Video started playing automatically');
        }).catch(error => {
            console.log('Auto-play prevented by browser:', error);
            // Show play button if autoplay fails
            showPlayPrompt();
        });
    }

    // Update quality indicator based on video dimensions
    const width = video.videoWidth;
    const height = video.videoHeight;
    
    if (width >= 3840 && height >= 2160) {
        qualityIndicator.textContent = '4K Ultra HD';
    } else if (width >= 1920 && height >= 1080) {
        qualityIndicator.textContent = 'Full HD';
    } else if (width >= 1280 && height >= 720) {
        qualityIndicator.textContent = 'HD';
    } else {
        qualityIndicator.textContent = 'Standard';
    }
});

// Function to show play prompt if autoplay fails
function showPlayPrompt() {
    const playPrompt = document.createElement('div');
    playPrompt.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                   background: rgba(0,0,0,0.8); display: flex; justify-content: center; 
                   align-items: center; z-index: 10000; cursor: pointer;">
            <div style="text-align: center; color: white;">
                <div style="font-size: 4em; margin-bottom: 20px;">▶️</div>
                <h2 style="font-size: 2em; margin-bottom: 10px;">Click to Play Video</h2>
                <p style="font-size: 1.2em;">Experience the ultimate 4K journey</p>
            </div>
        </div>
    `;
    document.body.appendChild(playPrompt);
    
    playPrompt.addEventListener('click', function() {
        video.play();
        video.muted = false; // Enable sound
        volumeIcon.className = 'fas fa-volume-up';
        playPrompt.remove();
    });
}

// Auto-play on page load
window.addEventListener('load', function() {
    // Force video to load and play
    video.load();
    
    // Attempt to play after a short delay
    setTimeout(() => {
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video auto-started on page load');
            }).catch(error => {
                console.log('Auto-play blocked, user interaction required');
            });
        }
    }, 500);
});

// Enable sound on first user interaction anywhere on the page
let soundEnabled = false;
function enableAudio() {
    if (!soundEnabled) {
        video.muted = false;
        volumeIcon.className = 'fas fa-volume-up';
        soundEnabled = true;
        console.log('Audio enabled');
    }
}

// Add event listeners for various user interactions
document.addEventListener('click', enableAudio, { once: true });
document.addEventListener('touchstart', enableAudio, { once: true });
document.addEventListener('keydown', enableAudio, { once: true });

// Mute/Unmute toggle
muteBtn.addEventListener('click', function() {
    if (video.muted) {
        video.muted = false;
        volumeIcon.className = 'fas fa-volume-up';
        muteBtn.title = 'Mute Sound';
    } else {
        video.muted = true;
        volumeIcon.className = 'fas fa-volume-mute';
        muteBtn.title = 'Unmute Sound';
    }
});

// Play/Pause toggle
playBtn.addEventListener('click', function() {
    if (video.paused) {
        video.play();
        playIcon.className = 'fas fa-pause';
        playBtn.title = 'Pause';
    } else {
        video.pause();
        playIcon.className = 'fas fa-play';
        playBtn.title = 'Play';
    }
});

// Ensure continuous looping
video.addEventListener('ended', function() {
    video.currentTime = 0;
    video.play();
});

// Handle video errors
video.addEventListener('error', function() {
    console.error('Video loading error');
    qualityIndicator.textContent = 'Video Error';
    qualityIndicator.style.background = 'rgba(255,0,0,0.7)';
});

// Optimize performance for 4K
video.addEventListener('loadstart', function() {
    // Set optimal playback rate for smooth 4K playback
    video.playbackRate = 1.0;
});

// Handle visibility change to pause/resume when tab is not visible
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        video.pause();
    } else {
        video.play();
    }
});

// Preload optimization
window.addEventListener('load', function() {
    // Force video to load
    video.load();
});