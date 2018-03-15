var startBtn = document.querySelector('.js-btn-start'),
    pauseBtn = document.querySelector('.js-btn-pause'),
    preloader = document.querySelector('.video-preloader');

var video = document.querySelector('video'),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

var ostAudio = document.querySelector('#ost'),
    shagiAudio = document.querySelector('#ost');

context.globalCompositeOperation = 'source-out';

var tracker = new tracking.ObjectTracker("face");
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

//tracking.track('video', tracker, { camera: true });

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


function init() {
    checkGetUserMedia();
    bindEvents();
    generateStroke();
    createAudio();


    setInterval(function () {
        document.querySelector('#js-faces-targets').classList.add('noise');

        var t = setTimeout(function () {
            document.querySelector('#js-faces-targets').classList.remove('noise');
        }, 3000)
    }, 5000)
}

function bindEvents() {
    startBtn.addEventListener('click', _startCapture);
    pauseBtn.addEventListener('click', _pauseCapture);

    video.addEventListener('canplay', _videoOnCanPlay);
    video.addEventListener('canplaythrough', _videOnLoad)
}

function generateStroke() {
    for (let i = 0; i <= 10; i++) {
        var svg = document.querySelector('#js-faces-targets')
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");

        text.setAttribute('x', 30)
        text.setAttribute('y', i * 30)
        text.textContent = i + 1 + makeRandomString();

        g.appendChild(text);

        svg.appendChild(g)
    }
}

function createAudio() {

        var context = new window.AudioContext();
        var buffers = [], sources=[], destination;

        var stop = function(index){
            sources[0].stop(0);
            sources[1].stop(1);
        }

        var play = function(index){
            sources = [context.createBufferSource(), context.createBufferSource()];

            sources[0].buffer = buffers[0];
            sources[1].buffer = buffers[1];

            destination = context.destination;

            gainNodes = [context.createGain(),context.createGain()];

            gainNodes[0].gain.value  = 10;
            gainNodes[1].gain.value  = 5;

            sources[0].connect(gainNodes[0]);
            sources[1].connect(gainNodes[1]);

            gainNodes[0].connect(destination);
            gainNodes[1].connect(destination);
            
            console.log(sources[0]);
            console.log(destination);
            
            sources[0].start(0);
            sources[1].start(0);
        }

        var initSound = function(arrayBuffer, bufferIndex) {
            context.decodeAudioData(arrayBuffer, function(decodedArrayBuffer) {
                buffers[bufferIndex] = decodedArrayBuffer;
                if(buffers[0] && buffers[1]) document.querySelector('body').classList.add('readytoplay');
            }, function(e) {
                console.log('Error decoding file', e);
            });
        }

        var loadSoundFile = function(url, bufferIndex) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                initSound(this.response, bufferIndex); // this.response is an ArrayBuffer.
            };
            xhr.send();
        }

        loadSoundFile('ost.mp3',0);
        loadSoundFile('shagi_po_zemle.mp3',1);


        play();
        /*$('.range1').on('change', function(e){
            if(!gainNodes) return;
            gainNodes[0].gain.value  = 1 - $('.range1').val();
            gainNodes[1].gain.value  = $('.range1').val();
        });*/
}

function _videoOnCanPlay() {
    preloader.classList.add('hidden');
    video.classList.remove('hidden');
}

function _videOnLoad() {
    console.log('onload');
    video.play();
    createInterface()
    //draw(video, context);
}

function _startCapture() {
    preloader.classList.remove('hidden');

    /*if (navigator.getUserMedia) {
        navigator.mediaDevices.getUserMedia({audio: true, video: {width: 700, height: 350}})
            .then(function(mediaStream) {
                video.srcObject = mediaStream;
                video.onloadedmetadata = function(e) {
                    video.play();
                };
            })
            .catch(function(err) {
                console.log(err);
                console.log(err.name + ": " + err.message);
                videoFallBack()
            });
    } else {
        console.log("getUserMedia not supported");
    }*/
}

function videoFallBack() {
    video.src = 'fallback-video.mp4';
    video.load();
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

function makeRandomString() {
    var text = "",
        textArr = [],
        possible = "0123456789",
        parts = [5, 5, 5],
        begin = 0;

    for (var i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    for (i in parts) {
        var part = parts[i];

        var subStr = text.substring(begin, part + begin);
        begin = part;
        var last = subStr.lastIndexOf(";");
        if (last < 0) last = subStr.lastIndexOf(" ");

        textArr.push(subStr);

    }

    return textArr.join(' ');
}


init();