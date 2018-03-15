var startBtn = document.querySelector('.js-btn-start'),
    pauseBtn = document.querySelector('.js-btn-pause'),
    preloader = document.querySelector('.video-preloader');

var video = document.querySelector('video'),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d'),
    videoStream = null;

context.globalCompositeOperation = 'source-out';


var canvasLayerVideo = 'video',
    canvasLayerVideo = 'interface';

var tracker = new tracking.ObjectTracker("face");
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

tracking.track('video', tracker, { camera: true });

tracker.on('track', function(event) {
    //console.log('tracker track');
    context.clearRect(0, 0, canvas.width, canvas.height);
    //console.log(canvas.width, canvas.height);
    if (event.data) {
        event.data.forEach(function(rect) {
            console.log(rect.x);
            console.log(rect.y);
            context.strokeStyle = '#a64ceb';
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
            context.font = '11px Helvetica';
            context.fillStyle = "#fff";
            //context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
            //context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
            context.fillText('x: ' + rect.x + 'px', 60, 20);
            context.fillText('y: ' + rect.y + 'px', 60, 40);
        });
    }
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
    video.addEventListener('canplaythrough', _videOnLoad)
}

function _videoOnCanPlay() {
    preloader.classList.add('hidden');
    video.classList.remove('hidden');
}

function _videOnLoad() {
    draw(video, context);
}

function _startCapture() {
    preloader.classList.remove('hidden');

    if (navigator.getUserMedia) {
        navigator.mediaDevices.getUserMedia({audio: true, video: {width: 700, height: 350}})
            .then(function(mediaStream) {
                video.srcObject = mediaStream;
                video.onloadedmetadata = function(e) {
                    video.play();
                };
            })
            .catch(function(err) { console.log(err.name + ": " + err.message); });
    } else {
        console.log("getUserMedia not supported");
    }
}

function _pauseCapture() {
    video.pause();

}

function draw(video) {
    context.drawImage(video, 0, 0, 700, 350);
    requestAnimationFrame(() => {
        draw(video);
});
}

function checkGetUserMedia() {
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
}




init();