var startBtn = document.querySelector('.js-btn-start'),
    pauseBtn = document.querySelector('.js-btn-pause'),
    faseBtn = document.querySelector('.js-btn-face'),
    preloader = document.querySelector('.video-preloader'),
    interface = document.querySelector('.video-interface'),
    fallBack = document.querySelector('.video-fallback');

var video = document.querySelector('video'),
    canvas = document.getElementById('canvas'),
    context = canvas.getContext('2d');

var svg = document.querySelector('#js-faces-targets');

var tracker = new tracking.ObjectTracker("face");
    tracker.setInitialScale(4);
    tracker.setStepSize(2);
    tracker.setEdgesDensity(0.1);

function init() {
    checkGetUserMedia();
    bindEvents();
    createAudio();
}

function bindEvents() {
    startBtn.addEventListener('click', _startCapture);
    pauseBtn.addEventListener('click', _pauseCapture);
    faseBtn.addEventListener('click', function () {
        if (!this.classList.contains('started')) {
            this.classList.add('started');
            tracking.track('#video', tracker, {camera: true});
        } else {
            this.classList.remove('started');
            tracker.removeListener('track', function (e) {
                console.log(e);
            });
        }
    });

    video.addEventListener('canplay', _videoOnCanPlay);
    video.addEventListener('canplaythrough', _videOnLoad);

    tracker.on('track', function(event) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        if (event.data) {
            event.data.forEach(function(rect) {
                /*console.log(rect.x);
                console.log(rect.y);*/
                context.strokeStyle = 'white';
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                context.font = '11px Helvetica';
                context.fillStyle = "#fff";
                //context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                //context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                context.fillText('x: ' + rect.x + 'px', 60, 20);
                context.fillText('y: ' + rect.y + 'px', 60, 40);

                var face = svg.querySelector('#face');

                var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                var textX = document.createElementNS("http://www.w3.org/2000/svg", "text");
                var textY = document.createElementNS("http://www.w3.org/2000/svg", "text");

                /*text.setAttribute('x', 0)

                text.setAttribute('y', i * 20)

                text.textContent = i + ' - ' + makeRandomString();

                g.appendChild(text);

                digits.appendChild(g)*/
            });
        }
    });
}

function createInterface() {
    var start = 0,
        limit = 7;

    generateStroke(start, limit, 13);

    setInterval(function () {
        var g = document.querySelector('#digits').querySelectorAll('g');

        document.querySelector('#js-faces-targets').classList.add('noise');

        start = start + 15;

        setTimeout(function () {
            document.querySelector('#js-faces-targets').classList.remove('noise');

            requestAnimationFrame(function () {
                document.querySelector('#digits').querySelectorAll('text').forEach(function (el) {
                    el.style.transform = 'translateY(-' + start + 'px)';
                })
            })

            generateStroke(limit + 1, limit + 1, parseInt(g[g.length -1].querySelector('text').getAttribute('y')) + 15);

            g = document.querySelector('#digits').querySelectorAll('g');

            g[g.length -1].querySelector('text').animate(
                [
                    { fill: 'red' },
                    { fill: '#000', offset: 0.333},
                    { fill: '#fff' }
                ], {
                    duration: 100,
                    iterations: 6
                }
            );

            limit++;
        }, 3000)
    }, 6000)
}

function generateStroke(start, limit, y) {
    for (let i = start; i <= limit; i++) {
        var digits = svg.querySelector('#digits');
        var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        
        text.setAttribute('x', 0);

        text.setAttribute('y', y);

        text.textContent = i + ' - ' + makeRandomString();

        g.appendChild(text);

        digits.appendChild(g)

        y += 15;
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
}

function _videoOnCanPlay() {
    video.classList.remove('hidden');
}

function _videOnLoad() {
    console.log('onload');
    video.play();
    draw(video, context);
    
    setTimeout(function () {
        console.log(123);
        toImage()
    }, 3000)
}

function _startCapture() {
    preloader.classList.remove('hidden');

    if (navigator.getUserMedia) {
        navigator.mediaDevices.getUserMedia({audio: true, video: true})
            .then(function(mediaStream) {
                video.srcObject = mediaStream;
                interface.classList.remove('hidden');
                createInterface();
                video.onloadedmetadata = function(e) {
                    video.play();

                };
            })
            .catch(function(err) {
                console.log(err);
                console.log(err.name + ": " + err.message);
                fallBack.classList.remove('hidden')
            });
    } else {
        console.log("getUserMedia not supported");
    }

    preloader.classList.add('hidden');

}

function videoFallBack() {
    /*video.poster = 'cover.jpg';
    video.load();*/
}

function _pauseCapture() {
    video.pause();
}

function draw(video) {
    context.drawImage(video, 0, 0, 720, 540);
    requestAnimationFrame(() => {
        draw(video);
});
}

function toImage() {
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    var drawImageData = function(imageData) {
        console.log(123);
        context.putImageData(imageData, 0, 0);
    }

    /*var parameters = { amount: 1, seed: Math.round(Math.random()*100), iterations: 50, quality: 10 };
    glitch(imgData, parameters, function(imageData) {
        // update the canvas' image data
        context.putImageData(imageData, 0, 0);
    });*/

    var ii = 0;
    var interval_id;

    clearInterval(interval_id);

    interval_id = setInterval(function() {
        var parameters = { amount: 1, seed: Math.round(Math.random()*100), iterations: 5, quality: 30 };

        if (ii < 10) {
            console.log(ii);
            glitch(imageData, parameters, drawImageData);
            ii++;
        } else {
            clearInterval(interval_id);
            context.drawImage(video, 0, 0, 720, 540);
        }
    },  40);

    //context.putImageData(imgData,0,0);
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