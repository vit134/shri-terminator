var startBtn = document.querySelector('.js-btn-start'),
    pauseBtn = document.querySelector('.js-btn-pause'),
    preloader = document.querySelector('.video-preloader');

var video = document.querySelector('video'),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    videoStream = null;

var tracker = new tracking.ObjectTracker("face");
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

tracking.track('video', tracker, { camera: true });

tracker.on('track', function(event) {
    //console.log('tracker track');
    context.clearRect(0, 0, canvas.width, canvas.height);
    //console.log(canvas.width, canvas.height);
    event.data.forEach(function(rect) {
        context.strokeStyle = '#a64ceb';
        context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        context.font = '11px Helvetica';
        context.fillStyle = "#fff";
        //context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
        //context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
        context.fillText('x: ' + rect.x + 'px', 60, 2git 0);
        context.fillText('y: ' + rect.y + 'px', 60, 40);
    });
});


/*var gui = new dat.GUI();
gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
gui.add(tracker, 'stepSize', 1, 5).step(0.1);*/


function init() {
    checkGetUserMedia()
    bindEvents();
}

function bindEvents() {
    startBtn.addEventListener('click', _startCapture);
    pauseBtn.addEventListener('click', _pauseCapture);

    video.addEventListener('canplay', _videoOnCanPlay);
}

function _videoOnCanPlay() {
    preloader.classList.add('hidden');
    video.classList.remove('hidden');
}

function _startCapture() {
    preloader.classList.remove('hidden');

    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: true, video: {} },
            function(stream) {
                video.srcObject = videoStream = stream;
                video.onloadedmetadata = function(e) {
                    video.play();
                };
            },
            function(err) {
                console.log("The following error occurred: " + err.name);
            }
        );
    } else {
        console.log("getUserMedia not supported");
    }
}

function _pauseCapture() {
    video.pause();

}

function checkGetUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
}




init();