var EV = (function ($) {

	var version = "1.1";

	var defs;

	var settings = {};
	var DEFAULT_INIT_OPTIONS = {
		iPortalBase: "/iportal",
		basePath: "/Applications/TechtrackerAllin1/Report Designs/",
		viewHeight: 550,
		viewWidth: 980,
		customParameters: {"__masterpage": false}
	};

	var initialize = function (viewerData, options) {
		$.extend(settings, DEFAULT_INIT_OPTIONS, options);

		defs = viewerData;
		$.each(defs, function (i, def) {
			if (def.filters === undefined)
				def.filters = {};
			if (def.sets === undefined)
				def.sets = [];
		});

		actuate.load("viewer");
		var reqOps = new actuate.RequestOptions();
		reqOps.setCustomParameters(settings.customParameters);
		reqOps.setRepositoryType(actuate.RequestOptions.REPOSITORY_ENCYCLOPEDIA);
		actuate.initialize(settings.iPortalBase, reqOps, "", "", initViewers, $.proxy(errorHandler, null, "init"));
	};

	var setFilters = function (filters, filterSet) {

		$.each(defs, function (i, def) {
			if ($.inArray(filterSet, def.sets) > -1) {
				$.extend(def.filters, filters);
				refreshViewer(def);
			}
		});

	};

	var viewPopup = function (id) {

		var aDef = $.grep(defs, function (def) {
			return def.id == id;
		});
		if (aDef.length == 0)
			return;

		var def = aDef[0];
		var config = {
			afterOpen: function () {
				if (def.id == "keywordsCloud")
					prepPopup(def);
				else
					def.viewer = createViewer(def);
			},
			beforeClose: function () {
				if (window["loopVizInterval"] !== undefined) {
					clearInterval(loopVizInterval);
					loopVizInterval = null;
				}
				def.viewer.cleanup();
			}
		};

		var $content = $("<div>").attr({
			id: def.id
		}).css({
			width: (def.width || settings.viewWidth) + "px",
			height: (def.height || settings.viewHeight) + "px"
		});

		$.featherlight($content, config);

	};

	var getDefinition = function (id) {
		for (var i = 0; i < defs.length; i++) {
			if (defs[i].id == id)
				return defs[i];
		}
		return null;
	};

	function initViewers() {

		$.each(defs, function (i, def) {
			if (!def.popup)
				def.viewer = createViewer(def);
		});
	}

	function createViewer(options) {

		options.$id = $("#" + options.id);

		var panel = new actuate.viewer.ScrollPanel();
		panel.setMouseScrollingEnabled(false);
		panel.setPanInOutEnabled(false);
		var uiConfig = new actuate.viewer.UIConfig();
		uiConfig.setContentPanel(panel);

		var viewer = new actuate.Viewer(options.id, uiConfig);
		viewer.setReportName(getFullPath(options.initViewName || options.viewName));
		viewer.setParameters(options.filters);

		viewer.setHeight(options.height || settings.viewHeight);
		viewer.setWidth(options.$id.width());
		viewer.setContentMargin(0);

		var uiOpts = new actuate.viewer.UIOptions();
		uiOpts.enableToolBar(false);
		uiOpts.enableMainMenu(false);
		uiOpts.enableToolbarContextMenu(false);
		viewer.setUIOptions(uiOpts);

		viewer.registerEventHandler(actuate.viewer.EventConstants.ON_EXCEPTION, $.proxy(errorHandler, null, "viewer-exception"));
		viewer.registerEventHandler(actuate.viewer.EventConstants.ON_SESSION_TIMEOUT, $.proxy(errorHandler, null, "session-timeout"));

		viewer.submit(function () {
			if (options.callback)
				options.callback.bind(options)({type: "create"});
		});

		return viewer;
	}

	function refreshViewer(options) {

		options.viewer.setReportName(getFullPath(options.viewName));
		options.viewer.setParameters(options.filters);
		options.viewer.submit(function () {
			if (options.callback)
				options.callback.bind(options)({type: "refresh"});
		});

	}

	function prepPopup(def) {
		def.counter = def.counter ? ++def.counter : 1;
		var w = "\u006f\u0072";
		w = "w" + w;
		w += "d";
		if (def.counter % 3 == 0) {
			var $div = $("<div>");
			var $def = $("#" + def.id);
			$def.css({display: "flex", "justify-content": "center"});
			$div.css({display: "none", fontSize: "120pt", "align-self": "center"}).text(w + "\u006c\u0079").appendTo($def);
			$div.fadeTo(800, 0.3, function () {
				$div.fadeOut(400, function () {
					$div.detach();
					$def.css({display: "block", "justify-content": "flex-start"});
					def.viewer = createViewer(def);
				});
			});
		} else {
			def.viewer = createViewer(def);
		}
	}

	function getFullPath(name) {
		return name.substring(0, 1) == "/" ? name : settings.basePath + name;
	}

	function errorHandler(type, viewer, error) {
		alert("Error Occured: " + type);
	}

	return {
		initialize: initialize,
		setFilters: setFilters,
		viewPopup: viewPopup,
		getDefinition: getDefinition,
		settings: settings,
		version: version
	};
})($);



