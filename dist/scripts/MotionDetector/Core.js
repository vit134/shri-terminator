;(function(App) {

	"use strict";
	

	App.Core = function() {

		var rendering = false;
        var stopped;

		var width = 72;
		var height = 54;

		var webCam = null;
		var imageCompare = null;

		var currentImage = null;
		var oldImage = null;

		var movementBlock = document.getElementById('movement');

		var topLeft = [Infinity,Infinity];
		var bottomRight = [0,0];

		var raf = (function(){
			return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
			function( callback ){
				window.setTimeout(callback, 1000/60);
			};
		})();


		function initialize() {
			imageCompare = new App.ImageCompare();
			webCam = new App.WebCamCapture(document.getElementById('video'));

			rendering = true;

			main();
		}


		function render() {
			oldImage = currentImage;
			currentImage = webCam.captureImage(false);

			if(!oldImage || !currentImage) {
				return;
			}

			var vals = imageCompare.compare(currentImage, oldImage, width, height);

			topLeft[0] = vals.topLeft[0] * 10;
			topLeft[1] = vals.topLeft[1] * 10;

			bottomRight[0] = vals.bottomRight[0] * 10;
			bottomRight[1] = vals.bottomRight[1] * 10;

			document.getElementById('f_x').textContent = topLeft[0];
			document.getElementById('f_y').textContent = topLeft[1];

            movementBlock.style.top = topLeft[1] + 'px';
            movementBlock.style.left = topLeft[0] + 'px';

            movementBlock.style.width = (bottomRight[0] - topLeft[0]) + 'px';
            movementBlock.style.height = (bottomRight[1] - topLeft[1]) + 'px';

			topLeft = [Infinity,Infinity];
			bottomRight = [0,0]
		}

		function stop() {
            stopped = true;

            movementBlock.style.top = 0;
            movementBlock.style.left = 0;

            movementBlock.style.width = 0;
            movementBlock.style.height = 0;
        }

        function start() {
            stopped = false;

            initialize();
        }


		function main() {
			if (!stopped) {
                try {
                    render();
                } catch (e) {
                    console.log(e);
                    return;
                }

                if (rendering == true) {
                    raf(main.bind(this));
                }
            }
		}



		return {
		    stop: stop,
            start: start
        }
	};
})(MotionDetector);