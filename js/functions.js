var __DEFAULT_PERIOD = 0;
var pid, $periodSelect;
var __DEFAULT_REGION = 0;
var rid, $regionSelect;

$(document).ready(function () {

	$.featherlight.defaults.beforeOpen = function () {
		$("body").addClass("stopScroll");
	};
	$.featherlight.defaults.afterClose = function () {
		$("body").removeClass("stopScroll");
	};

	// Idle timer to close all filter panels if inactivity detected for 15 seconds
	$.idleTimer(15000);
	$(document).bind("idle.idleTimer", function () {
		$(".filterPane").removeClass("filterPaneOpen");
		$(this).find("span.textLabel").html("FILTER");
		$(this).find(".filterIcon").removeClass("open");
	});

	$(".featherlight").on("scroll", function (e) {
		e.stopPropagation();
	});

	// Filter Button 
	$(".filterButton").click(function (e) {

		e.preventDefault();

		$(this).find(".filterIcon").toggleClass("open");
		$(this).closest("div").find(".filterPane").toggleClass("filterPaneOpen");

		//Toggle Text Filter -> Close -> Filter
		if ($.trim($(this).find("span.textLabel").html()) === "FILTER") {
			$(this).find("span.textLabel").html("CLOSE&nbsp;");
		} else {
			$(this).find("span.textLabel").html("FILTER");
		}

	});

	$(".filterPane input, .filterPane select").on("change", function () {
		var $this = $(this);
		var filterSet = $this.parents("form").data("set");

		var filters = {};
		filters[this.name] = $this.val();
		if (filterSet)
			EV.setFilters(filters, filterSet);
		else
			EV.setFilters(filters, $this.parents(".filterPane").get(0).id);
	});

	var $menu = $("#menu");
	//How It Works Lightbox
	var howItWorksLightboxOpts = {iframe: "howitworks.html", iframeWidth: 980, iframeHeight: 650};
	$menu.find("li a.howitworks").featherlight(howItWorksLightboxOpts);
	$("#methodology").find("a").featherlight(howItWorksLightboxOpts);

	//Click header to return home
	$(".headerWrapper img, .headerWrapper h4").click(function (e) {
		e.preventDefault();
		window.location = "index.html";
	});

	var $menuHeader = $("body.home #menuHeader");
	var $periodSelectorMainPage = $(".periodSelectorMainPage");
	var isScrollPeriodMainPage = ($periodSelectorMainPage.length > 0);
	if (isScrollPeriodMainPage)
		$periodSelectorMainPage.next().height($periodSelectorMainPage.outerHeight(true));
	$(document).scroll(function () {
		if (isScrollPeriodMainPage) {
			//TODO: 270 is height of original
			if (window.pageYOffset > 194) {
				$periodSelectorMainPage.css({position: "fixed", top: $menuHeader.outerHeight() + "px", left: "0"});
				$periodSelectorMainPage.next().show();
			} else {
				$periodSelectorMainPage.css({position: "relative", top: "0", left: "0"});
				$periodSelectorMainPage.next().hide();
			}
		}

		//Scroll down to add heading
		if (window.pageYOffset > 100)
			$menuHeader.addClass("scrollDown");
		else
			$menuHeader.removeClass("scrollDown");

	});


	$(".showMoreButton, .showMoreButtonGrey").on("click", function (e) {

		e.preventDefault();

		var $this = $(this);
		var id = $this.data("def");
		if (!id)
			return;
		var flipViz = $this.data("flipviz");

		var def = EV.getDefinition(id);
		var height;
		var vid = def.viewer.getId();

		$this.toggleClass("showMoreMode");
		if ($this.hasClass("showMoreMode")) {
			$this.text("Show less");

			if (flipViz) {
				def.$id.find("#" + vid + "_" + id + "-small").hide();
				var $showViz = def.$id.find("#" + vid + "_" + id + "-large");
				$showViz.show();
				height = $showViz.outerHeight();
				def.flipped = true;
			} else {
				height = def.$id.find("#" + vid + "_" + id).outerHeight();
			}
		} else {
			$this.text("Show more");

			if (flipViz) {
				def.$id.find("#" + vid + "_" + id + "-small").show();
				def.$id.find("#" + vid + "_" + id + "-large").hide();
				def.flipped = false;
			}

			height = def.height || EV.settings.viewHeight;
		}

		var pOffset = $(document).height() - window.scrollY;
		def.$id.height(height);

		def.viewer.setHeight(height);
		//def.viewer.refresh(); //API method but causes high charts to re-animate
		def.$id.find(".floatPanel, .contentPanel").height(height); // DOM method, no re-animation

		var cOffset = $(document).height() - window.scrollY;
		if (pOffset > cOffset)
			window.scrollBy(0, cOffset - pOffset);
	});

	//Profile / Topic Menu
	$("#profileFrontdoor").find("h1").click(function (e) {
		e.preventDefault();
		var menu = $(this).data("menu");
		$("#" + menu).addClass("displayed");
	});

	$(".overlayCloseButton").click(function (e) {
		e.preventDefault();
		$(".candidateMenu").removeClass("displayed");
	});

	// SHARE MENU //

	//Share Menu click function
	$("a.share").click(function (e) {
		e.preventDefault();
		$("#menu").find("li:nth-child(2)").toggleClass("liWidth");
		$(this).fadeOut();
		$("#shareIcons").addClass("shareContainerShow");
		//$(this).toggleClass("shareHidden");   // in html5 a negative top margin at the top of the page doesn't seem to work.
		setTimeout(function () {
			$("a.shareIcon").addClass("showIcons");
		}, 50);
	});

	//Share Menu Mouse leave functions for share menu
	var timer;
	$menu.find("li:nth-child(2)").on("mouseover", function () {
		//clear time on mouse re-enter/over
		clearTimeout(timer);
	}).on("mouseleave", function () {
		//delays closing of share menu so that it doesn"t appear glitch if mouse leaves the element for a moment
		timer = setTimeout(function () {
			$("#menu").find("li:nth-child(2)").removeClass("liWidth");
			$("a.share").fadeIn();
			//$("a.share").removeClass("shareHidden");  // this doesn't work right in html5
			$("a.shareIcon").removeClass("showIcons");
			$("#shareIcons").removeClass("shareContainerShow");
		}, 1000);
	});


	//Handle click events for each social icon

	//TWITTER
	$("a.twitter").click(function (e) {

		e.preventDefault();

		//Base URL to Twitter Intent
		baseURL = "https://twitter.com/intent/tweet?";

		//Tweet text
		tweetText = "Magellan Data Analysis of Online Tech Reviews and Social Opinions";

		//URL to current page
		currentURL = window.location.href;
		currentURLStripped = currentURL.split('#')[0];
		currentURLStrippedEnc = encodeURIComponent(currentURLStripped);

		//Hashtags
		hashtag = "TechTracker19";

		bareURL = baseURL + "text=Tech%20Tracker%2022" + "&url=" + currentURLStrippedEnc + "&hashtags=TechTracker22&source=webclient";

		window.open(
				bareURL,
				'_blank'
		);

	});

	//FACEBOOK
	$("a.facebook").click(function (e) {

		e.preventDefault();

		//URL to current page
		currentURL = window.location.href;
		currentURLStripped = currentURL.split('#')[0];
		currentURLStrippedEnc = encodeURIComponent(currentURLStripped);

		fullURL = "https://www.facebook.com/sharer.php?u=" + currentURLStripped ;

		window.open(
				fullURL,
				'_blank'
		);

	});


	//LinkedIn
	$("a.linkedin").click(function (e) {

		e.preventDefault();

		//Base URL to Twitter Intent
		baseURL = "https://www.linkedin.com/shareArticle?mini=true";

		//Title
		titleText = "Analysis Of Online Tech Reviews and Social Opinions";

		//URL to current page
		currentURL = window.location.href;
		currentURLStripped = currentURL.split('#')[0];
		currentURLStrippedEnc = encodeURIComponent(currentURLStripped);

		fullURL = baseURL + "&url=" + currentURLStrippedEnc + "&title=" + titleText;

		window.open(
				fullURL,
				'_blank'
		);

	});

	//Email
	$("a.email").click(function (e) {

		e.preventDefault();

		//Base URL to Twitter Intent
		baseURL = "mailto:?";

		//Subject
		subjectText = "Analysis Of Online Tech Reviews and Social Opinions";
		subjectTextEnc = encodeURI(subjectText);

		//URL to current page
		currentURL = window.location.href;
		currentURLStripped = currentURL.split('#')[0];

		//Body
		bodyText = "Check out this analysis Of online tech reviews and social opinions coverage here (powered by OpenText Magellan):  " + currentURLStripped;
		bodyTextEnc = encodeURI(bodyText);

		window.location.href = baseURL + "subject=" + subjectTextEnc + "&body=" + bodyTextEnc;


	});


	pid = getURLParameter("pid", __DEFAULT_PERIOD);

    $periodSelect = $("#periodSelect");
    $periodSelect.html(function (){
	    var periods_sorted = filterAndSortArray(periods_array, "sort");
	   	var markup = "";
	   	$.each(periods_sorted, function (i, p) {
	   		markup += "<option value=\"" + p.id + "\" ";
	   		if (p.id == pid)
	   			markup += "selected ";
	   		markup += ">" + p.name + "</option>";
	   	});
	   	return markup;
    });
	setPeriodLabel();

    $periodSelect.change(function () {
	    var val = $(this).val();
	   	setPeriodLabel();
	   	location.hash = "?pid=" + val + "&rid=" + rid;
    });

	rid = getURLParameter("rid", __DEFAULT_REGION);

    $regionSelect = $("#regionSelect");
    $regionSelect.html(function (){
	    var regions_sorted = filterAndSortArray(regions_array, "sort");
	   	var markup = "";
	   	$.each(regions_sorted, function (i, r) {
	   		markup += "<option value=\"" + r.id + "\" ";
	   		if (r.id == rid)
	   			markup += "selected ";
	   		markup += ">" + r.name + "</option>";
	   	});
	   	return markup;
    });
	setRegionLabel();

    $regionSelect.change(function () {
	    var val = $(this).val();
	   	setRegionLabel();
	   	location.hash = "?pid=" + pid + "&rid=" + val;
    });

});


$(window).bind("hashchange", function() {
    var newpid = getURLParameter("pid", __DEFAULT_PERIOD);
    if (newpid != pid) {
        pid = newpid;
	    $periodSelect.val(pid);
        setPeriodLabel();
        EV.setFilters({pPeriod: pid}, "period");
    }

    var newrid = getURLParameter("rid", __DEFAULT_REGION);
    if (newrid != rid) {
        rid = newrid;
	    $regionSelect.val(rid);
        setRegionLabel();
        EV.setFilters({pRegion: rid}, "region");
    }
	
});

function setPeriodLabel() {
	var $label = $("label[for=periodSelect]");
	if (pid == 0)
		$label.html("You are viewing data from the:");
	else
		$label.html("You are viewing data from the:");
}

function setRegionLabel() {
	var $label = $("label[for=regionSelect]");
	if (rid == 0)
		$label.html("You are viewing data from");
	else
		$label.html("You are viewing data from");
}

function getURLParameter(name, valIfNull) {
	var val = (location.hash.match(new RegExp("[?&]" + name + "=([^&]*)")) || [, null])[1];
	if (val == null)
		val = (location.search.match(new RegExp("[?&]" + name + "=([^&]*)")) || [, null])[1];
	if (valIfNull !== undefined && (val === null || val == ""))
		val = valIfNull;
	return val === null ? null : decodeURIComponent(val);
}

function getArrayObjectById(arr, id) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].id == id) {
			return arr[i];
		}
	}
	return null;
}

function filterAndSortArray(arr, f) {
	var attr = f || "name";
	return $.grep(arr, function (obj) {
		return obj.enabled;
	}).sort(function (a, b) {
		return a[attr] < b[attr] ? -1 : 1;
	});
}

var periods_array = [
	{id: 3, name: "Last 3 Days", enabled: true, sort: 3},
	{id: 7, name: "Last 7 Days", enabled: true, sort: 7},
	{id: 15, name: "Last 15 Days", enabled: true, sort: 15},
	{id: 30, name: "Last 30 Days", enabled: true, sort: 30},
	{id: 60, name: "Last 60 Days", enabled: true, sort: 60},
	{id: 90, name: "Last 90 Days", enabled: true, sort: 90},
	{id: 0, name: "All Days", enabled: true, sort: Number.MAX_VALUE}
];

var regions_array = [
	{id: 1, name: "Africa", enabled: true, sort: 1},
	{id: 2, name: "Asia", enabled: true, sort: 2},
	{id: 3, name: "Australia", enabled: true, sort: 3},
	{id: 4, name: "Europe", enabled: true, sort: 4},
	{id: 5, name: "North America", enabled: true, sort: 5},
	{id: 6, name: "South America", enabled: true, sort: 6},
	{id: 0, name: "All regions", enabled: true, sort: Number.MAX_VALUE}
];

var candidates_array = [
	{id:1, name:"Apple iPhone 13 mini"    ,party:"Apple"   ,enabled:true},
	{id:2, name:"Google Pixel 6"	      ,party:"Google"  ,enabled:true},
	{id:3, name:"Apple iPhone 13"	      ,party:"Apple"   ,enabled:true},
	{id:4, name:"Samsung Galaxy S20 FE"   ,party:"Samsung" ,enabled:true},
	{id:5, name:"OnePlus 8T"		      ,party:"OnePlus" ,enabled:true},
	{id:6, name:"Oppo Find X2 Pro"	      ,party:"Oppo"    ,enabled:true},
	{id:7, name:"Oppo Find X3 Neo"	      ,party:"Oppo"    ,enabled:true},
	{id:8, name:"Apple iPhone 13 Pro Max" ,party:"Apple"   ,enabled:true},
	{id:9, name:"Oppo Find X3 Pro"		  ,party:"Oppo"    ,enabled:true},
	{id:10,name:"Samsung Galaxy S21 Ultra",party:"Samsung" ,enabled:true},
	{id:11,name:"Realme GT Master Edition",party:"Realme"  ,enabled:true},
	{id:12,name:"Xiaomi Redmi Note 10 5G" ,party:"Xiaomi"  ,enabled:true},
	{id:13,name:"Samsung Galaxy A52s 5G"  ,party:"Samsung" ,enabled:false},
	{id:14,name:"Motorola Edge 20"        ,party:"Motorola",enabled:true},
	{id:15,name:"Samsung Galaxy A21s"     ,party:"Samsung" ,enabled:true},
	{id:16,name:"Realme 8i"               ,party:"Realme"  ,enabled:true},
	{id:17,name:"Asus Zenfone 8"          ,party:"Asus"    ,enabled:true},
	{id:18,name:"Samsung Galaxy Z flip 3" ,party:"Samsung" ,enabled:true},
	{id:19,name:"OnePlus 9 pro"           ,party:"OnePlus" ,enabled:true},
	{id:20,name:"OnePlus nord 2"          ,party:"OnePlus" ,enabled:true},
	{id:21,name:"Xiaomi 11T Pro"          ,party:"Xiaomi"  ,enabled:true},
	{id:22,name:"Huawei P40 Pro+"         ,party:"Huawei"  ,enabled:true},
	{id:23,name:"Wiko Power U30"          ,party:"Wiko"    ,enabled:true},
	{id:24,name:"Sony Xperia 5 III"       ,party:"Sony"    ,enabled:true},
	{id:25,name:"Apple iPhone 12"         ,party:"Apple"   ,enabled:true},
	{id:26,name:"Asus ROG Phone 3"        ,party:"Asus"    ,enabled:true}
];

var topics_array = [
	{id: 1, name: "Style", enabled: false},
	{id: 2, name: "Accessories", enabled: true},
	{id: 3, name: "Storage", enabled: true},
	{id: 4, name: "Camera", enabled: true},
	{id: 5, name: "Speaker", enabled: true},
	{id: 6, name: "Colors", enabled: true},
	{id: 7, name: "Security", enabled: true},
	{id: 8, name: "Sim Card", enabled: true},
	{id: 9, name: "Support", enabled: true},
	{id: 10, name: "Durability", enabled: true},
	{id: 11, name: "Adapters", enabled: true},
	{id: 12, name: "Community", enabled: true},
	{id: 13, name: "Cables", enabled: true},
	{id: 14, name: "Resolution", enabled: true},
	{id: 15, name: "Bluetooth", enabled: true},
	{id: 16, name: "GPS", enabled: true},
	{id: 17, name: "Apps & Games", enabled: true},
	{id: 18, name: "Battery Life", enabled: true},
	{id: 19, name: "Safety", enabled: true},
	{id: 20, name: "Features", enabled: true}
];

var media_array = [
	{id: 1, name: "Yahoo! Tech", enabled: true},
	{id: 2, name: "TheNext", enabled: true},
	{id: 3, name: "cNet", enabled: true},
	{id: 4, name: "gsmarena.com", enabled: true},
	{id: 5, name: "Makeuseof.com", enabled: true},
	{id: 6, name: "igyan.in", enabled: false},
	{id: 7, name: "TheVerge", enabled: true},
	{id: 8, name: "Techmeme", enabled: true},
	{id: 9, name: "TechPP.com", enabled: true},
	{id: 10, name: "Recode", enabled: true},
	{id: 11, name: "Gadgets360", enabled: true},
	{id: 12, name: "Fonarena", enabled: true},
	{id: 13, name: "Heavy.com", enabled: true},
	{id: 14, name: "Gadgetmentions.com", enabled: true},
	{id: 15, name: "AndroidAuthority.com", enabled: true},
	{id: 16, name: "engadget.com", enabled: true},
	{id: 17, name: "storytap.in", enabled: true},
	{id: 18, name: "Technobuffalo.com", enabled: true},
	{id: 19, name: "Apple Insider", enabled: true},
	{id: 20, name: "ZDNet", enabled: true},
	{id: 21, name: "Techradar.com", enabled: true},
	{id: 22, name: "CultOfMac", enabled: true},
	{id: 23, name: "Twitter", enabled: true},
	{id: 24, name: "Elite Daily", enabled: false},
	{id: 25, name: "NY Daily News", enabled: false},
	{id: 26, name: "LA Times", enabled: false},
	{id: 27, name: "TechCrunch", enabled: true},
	{id: 28, name: "Time", enabled: false},
	{id: 29, name: "Consumer Reports.org", enabled: true},
	{id: 30, name: "Slate", enabled: false},
	{id: 31, name: "Upworthy", enabled: false},
	{id: 32, name: "USNews", enabled: false},
	{id: 33, name: "Vice", enabled: false},
	{id: 34, name: "Houston Chronicle", enabled: false},
	{id: 35, name: "Gawker", enabled: false},
	{id: 36, name: "Chicago Tribune", enabled: false},
	{id: 37, name: "MIT Technology Review", enabled: true},
	{id: 38, name: "Redmond Pie", enabled: true},
	{id: 39, name: "Boston.com", enabled: false},
	{id: 40, name: "The Atlantic", enabled: false},
	{id: 41, name: "Dallas Morning News", enabled: false},
	{id: 42, name: "Politico", enabled: false},
	{id: 43, name: "The Hill", enabled: false},
	{id: 44, name: "Tech2.com", enabled: true},
	{id: 45, name: "InfoWars", enabled: false},
	{id: 46, name: "TechSpy", enabled: true},
	{id: 47, name: "Wired", enabled: true},
	{id: 48, name: "Christian Science Monitor", enabled: false},
	{id: 49, name: "WND", enabled: false},
	{id: 50, name: "Daily KOS", enabled: false},
	{id: 51, name: "Think Progress", enabled: false},
	{id: 52, name: "Political Wire", enabled: false},
	{id: 53, name: "FactCheck.org", enabled: false},
	{id: 54, name: "America Blog", enabled: false},
	{id: 55, name: "Daily Caller", enabled: false},
	{id: 56, name: "Chicks on the Right", enabled: false},
	{id: 57, name: "New Republic", enabled: false},
	{id: 58, name: "Five Thirty Eight", enabled: false},
	{id: 59, name: "Reuters", enabled: false},
	{id: 60, name: "ABC News", enabled: false},
	{id: 61, name: "Labnol.org", enabled: true},
	{id: 62, name: "Digitaltrends.com", enabled: true},
	{id: 63, name: "Fossbytes.com", enabled: true}
];