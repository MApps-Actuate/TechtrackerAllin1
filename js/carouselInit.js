$(document).ready(function () {

	var timeSlice = 0.1;

	var $progressBar = $("<div>", {id: "progressBar"});
	var $bar = $("<div>", {id: "bar"});
	$progressBar.append($bar).prependTo("#factoidCarousel");

	var $elem = null, tick = null, percentTime = 0, currentItem = 0, totalItems = 0, isPaused = false, doLooping = true;

	//Init the carousel
	$("#factoids").owlCarousel({
		slideSpeed: 500,
		paginationSpeed: 500,
		singleItem: true,
		transitionStyle: "backSlide",
		afterInit: initCarousel,
		afterMove: moved,
		startDragging: function(){isPaused = true;}
	});

	function initCarousel(elem) {
		$elem = elem;
		currentItem = 0;
		totalItems = this.$owlItems.length;
		start();
	}
	function start() {
		percentTime = 0;
		$bar.css({width: percentTime + "%"});
		if (doLooping) {
			isPaused = false;
			tick = setInterval(interval, 10);
		}
	}

	function interval() {
		if (!doLooping) {
			clearInterval(tick);
			return;
		}

		if (isPaused === false) {
			percentTime += timeSlice;
			$bar.css({width: percentTime + "%"});

			if (percentTime >= 100) {
				if (currentItem < totalItems - 1) {
					$elem.trigger("owl.next");
				} else {
					doLooping = false;
					clearInterval(tick);
				}
			}
		}
	}

	function moved() {
		clearInterval(tick);
		currentItem = this.currentItem;
		start();
	}

	$("#factoidCarousel").on("mouseover", function () {
		isPaused = true;
	}).on("mouseout", function () {
		isPaused = false;
	});

	$("#factoidLeft").click(function () {
		doLooping = false;
		$elem.trigger("owl.prev")
	});

	$("#factoidRight").click(function () {
		doLooping = false;
		$elem.trigger("owl.next")
	});

});