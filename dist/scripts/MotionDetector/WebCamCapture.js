;(function(App) {
	
	"use strict";
	

	App.WebCamCapture = function(videoElement) {

		var webCamWindow = false;
		var width = document.getElementById('video').width;
		var height = document.getElementById('video').height;
		

		function initialize(videoElement) {
			if(typeof videoElement != 'object') {
				webCamWindow = document.getElementById(videoElement);
			} else {
				webCamWindow = videoElement;
			}

			if (!hasSupport()) {
				console.log('No support found');
			}
		}

		function captureImage(append) {
			var canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			canvas.getContext('2d').drawImage(webCamWindow, 0, 0, width, height);


			if(append) {
				append.appendChild(canvas);	
			}

			return canvas;
		}

		function setSize(w, h) {
			width = w;
			height = h;
		}

		function hasSupport(){
			return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
				navigator.mozGetUserMedia || navigator.msGetUserMedia);
		}

		initialize(videoElement);

		return {
			setSize: setSize,
			hasSupport: hasSupport,
			captureImage: captureImage
		};

	}

})(MotionDetector);