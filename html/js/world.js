/** 
	class World
	singleton
	represents the output canvas
	@constructor 
*/
voyc.World = function() {
	this.elem = {};
	this.co = [];
	this.gamma = 0;
	this.w = 0;
	this.h = 0;

	this.marginRect = {l:0,t:0,r:0,b:0};

	this.scale = {
		now:0,
		min:0,
		max:0,
		step:0,
		game:0
	}
	this.diameter = 0;
	this.radius = 0;
	this.radiusKm = 6371;
	this.projection = {};
	this.globe = {};
	this.layer = [];  // array of layer objects, layer is a canvas

	this.moved = true;
	this.dragging = false;
	
	this.option = {
		scaleStep: .14,  // percentage of scale
		spinStep: 6,  // degrees
		margin:30,  // pixels
	};

	this.iterator = {};
	this.iterateeLand = {};
	this.iterateeCountries = {};
	this.iterateeEmpire = {};
	this.iterateeTreasure = {};
	this.iterateeGrid = {};
	this.iterateeFeature = {};
	this.iterateeHitTest = {};
	this.iterateeInit = {};
	
	this.riverpass = 0;

	this.stitchctx = {}
}

/** @const */
voyc.World.radiusKm = 6371; // earth radius in kilometers

voyc.World.prototype.setup = function(elem, co, w, h, scalefactor) {
	this.elem = elem;
	this.co = co;
	this.w = w;
	this.h = h;
	
	this.marginRect = {
		l:0 + this.option.margin,
		t:0 + this.option.margin,
		r:this.w - this.option.margin,
		b:this.h - this.option.margin
	};

	// scale in pixels
	this.diameter = Math.min(this.w, this.h);
	this.radius = Math.round(this.diameter / 2);
	this.scale.min = this.radius * .5;  // small number, zoomed out
	this.scale.max = this.radius * 6;   // large number, zoomed in
	this.scale.step = Math.round((this.scale.max - this.scale.min) * this.option.scaleStep);
	this.scale.now = this.radius * scalefactor
	
	//this.projection = new voyc.OrthographicProjection();
	//this.projection = new voyc.MercatorProjection();
	this.projection = new voyc.DualProjection();
	this.projection.mix = voyc.Projection.orthographic;

	this.projection.rotate([0-this.co[0], 0-this.co[1], 0-this.gamma]);
	this.projection.translate([this.w/2, this.h/2]);  // position the circle within the canvas (centered) in pixels
	this.projection.scale(this.scale.now);                  // size of the circle in pixels
	
	//this.pathsvg = d3.geo.path();
	//this.pathsvg.projection(this.projection);
/*
	changes:
	dump svg layers - not used, code still available in plunder
	dump div layers - use separate html, like hud and sketch
	keep canvas layers only
	draw all static layers on one canvas
	use separate sets of layers for river animations
	therefore: only one stitch for background
	only lines and polygons require stitching, not points, ie not river and hero animations
	hittest works by iterating collection, not canvas 
	write layer logic to use separate or shared canvas
*/
	// create map layers and attach in bottom-to-top order
	this.layer[voyc.layer.BACKGROUND] = this.createLayerDiv('background');  // solid black div style
	this.layer[voyc.layer.FASTBACK] = this.createLayer(false, 'fastback');  // land and water
	this.layer[voyc.layer.FEATURES] = this.createLayer(false, 'features');  // mountains, deserts
	this.layer[voyc.layer.SLOWBACKA] = this.createLayer(true, 'slowbacka'); // hi-res tiles
	this.layer[voyc.layer.RIVER0] = this.createLayer(true, 'river0');
	this.layer[voyc.layer.RIVER1] = this.createLayer(true, 'river1');
	this.layer[voyc.layer.RIVER2] = this.createLayer(true, 'river2');
	this.layer[voyc.layer.REFERENCE] = this.createLayer(false, 'reference');   // graticule
	this.layer[voyc.layer.EMPIRE] = this.createLayer(false, 'empire');         // political polygons
	this.layer[voyc.layer.FOREGROUND] = this.createLayer(false, 'foreground'); // treasure
	this.layer[voyc.layer.HERO] = this.createLayer(false, 'hero');
	this.layer[voyc.layer.HUD] = this.createLayerDiv('hud');

        var canvas = document.createElement('canvas')
        canvas.width = this.w * 2
        canvas.height = this.h
        this.stitchctx = canvas.getContext('2d');

	// setup interator objects
	this.iterator = new voyc.GeoIterate();
	
	this.iterateeLand = new voyc.GeoIterate.iterateePolygonClipping();
	this.iterateeLand.projection = this.projection
	this.iterateeLand.ctx = this.getLayer(voyc.layer.FASTBACK).ctx;

	this.iterateeCountries = new voyc.GeoIterate.iterateePolygonClipping();
	this.iterateeCountries.projection = this.projection;
	this.iterateeCountries.ctx = this.getLayer(voyc.layer.REFERENCE).ctx;

	//this.iterateeEmpire = new voyc.GeoIterate.iterateePolygonClipping();
	//voyc.merge(this.iterateeEmpire, new voyc.GeoIterate.iterateeDrawPerGeometry);
	//this.iterateeEmpire.projection = this.projection;
	//this.iterateeEmpire.ctx = this.getLayer(voyc.layer.EMPIRE).ctx;
	//this.iterateeEmpire.colorstack = voyc.empireColors;
	//this.iterateeEmpire.geometryStart = function(geometry) {
	//	geometry['q'] = geometry['b'] < voyc.geosketch.time.now && voyc.geosketch.time.now < geometry['e'];
	//	if (geometry['q']) {
	//		this.ctx.beginPath();
	//	}
	//	return geometry.q;
	//};
	//this.iterateeEmpire.collectionStart = function(collection) {
	//	this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
	//};

	//this.iterateeTreasure = new voyc.GeoIterate.iterateePoint();
	//this.iterateeTreasure.projection = this.projection;
	//this.iterateeTreasure.ctx = this.getLayer(voyc.layer.FOREGROUND).ctx;

	this.iterateeGrid = new voyc.GeoIterate.iterateeLine();
	this.iterateeGrid.projection = this.projection;
	this.iterateeGrid.ctx = this.getLayer(voyc.layer.REFERENCE).ctx;
	this.iterateeGrid.ctx.strokeStyle = '#888';
	this.iterateeGrid.ctx.lineWidth = .5;
	this.iterateeGrid.ctx.strokeOpacity = .5;

	this.iterateeFeature = new voyc.GeoIterate.iterateePolygonClipping();
	this.iterateeFeature.projection = this.projection;
	this.iterateeFeature.ctx = this.getLayer(voyc.layer.FEATURES).ctx;

	//this.iterateeHitTest = new voyc.GeoIterate.iterateeHitTest();
	//this.iterateeHitTest.projection = this.projection;

	//this.iterateeHitTestTreasure = new voyc.GeoIterate.iterateeHitTestPoint();
	//this.iterateeHitTestTreasure.projection = this.projection;

	//this.iterateeInit = new voyc.GeoIterate.iterateeInit();

	//this.iterateeRiver = new voyc.GeoIterate.iterateeLine();
	//this.iterateeRiver.projection = this.projection;
	//this.iterateeRiver.ctx = this.getLayer(voyc.layer.FEATURES).ctx;
	//this.iterateeRiver.point = function(pt) {
	//	var p = this.projection.project(pt);
	//	if (p) {
	//		if (!this.pointCount) {
	//			this.ctx.moveTo(p[0],p[1]);
	//		}
	//		else {
	//			this.ctx.lineTo(p[0],p[1]);
	//		}
	//		this.pointCount++;
	//		this.pt.push(p);
	//	}
	//	else {
	//		//console.log('invisible point');
	//		this.pointCount = 0;
	//	}
	//}
	//this.iterateeRiver.geometryStart = function(geometry) {
	//	this.pt = [];
	//	return true
	//}
	//this.iterateeRiver.geometryEnd = function(geometry) {
	//	geometry.pt = this.pt;
	//}

	//this.iterateeRiverAnim = new voyc.GeoIterate.iterateeLine();
	//this.iterateeRiverAnim.projection = this.projection;
	//this.iterateeRiverAnim.nth = 5;
	//this.iterateeRiverAnim.start = 0;
	//this.iterateeRiverAnim.geometryStart = function(geom) {
	//	for (var i=0; i<geom.pt.length; i++) {
	//		if (!((i + this.start) % this.nth)) {
	//			this.ctx.beginPath();
	//			this.ctx.arc(geom.pt[i][0], geom.pt[i][1], this.radius, 0, 2*Math.PI);
	//			this.ctx.fill();
	//		}
	//	}
	//	return false;
	//}
	//this.iterateeRiverAnim.collectionEnd = function(collection) {
	//	this.start--;
	//	if (this.start <= 0) {
	//		this.start = this.nth;
	//	}
	//	collection.start = this.start;
	//}
	//this.iterateeRiverAnim.collectionStart = function(collection) {
	//	this.ctx.fillStyle = '#00F';
	//	this.ctx.lineWidth = 0;
	//	if (!collection.start) {
	//		collection.start = this.nth;
	//	}
	//	this.start = collection.start;
	//}
}

voyc.World.prototype.doubleStitch = function(ctx, leftedge) {
	return
        this.stitchctx.drawImage(ctx.canvas, 0, 0);
        this.stitchctx.drawImage(ctx.canvas, this.w, 0);
        ctx.clearRect(0, 0, this.w, this.h);
        ctx.drawImage(this.stitchctx.canvas, 0-leftedge, 0)
}

voyc.World.prototype.mercator = function() {
	this.projection.mix = voyc.Projection.mercator
	this.moved = true
	voyc.geosketch.render(0);

	/* todo: Mercator stitch
		during iteratee project for polygon object
		objects going across the antimeridian project normally
		objects going across the left (or right) edge must be duplicated
			project one onto the right edge
			project the other onto the left edge 
		project() is called by the iterator
		the iterator does the ctx fill() and stroke() commands
		thererfore, the data need not be modified, it can all be handled during drawing
			project() must return null when a point is off screen
			drawer must split the object on all gaps of null points
			or
			drawer must note when a line crosses the boundary
	*/
}

voyc.World.prototype.orthographic = function() {
	this.projection.mix = voyc.Projection.orthographic
	this.moved = true
	voyc.geosketch.render(0);
}

voyc.World.prototype.resize = function(w, h) {
	this.w = w;
	this.h = h;
	this.diameter = Math.min(this.w, this.h);
	this.projection.translate([this.w/2, this.h/2]);  // position the circle within the canvas (centered) in pixels

	this.marginRect = {
		l:0 + this.option.margin,
		t:0 + this.option.margin,
		r:this.w - this.option.margin,
		b:this.h - this.option.margin
	};

	var a = {};
	for (var i in voyc.layer) {
		a = this.getLayer(voyc.layer[i]);
		if (a.type == 'canvas') {
			a.canvas.width  = this.w;
			a.canvas.height = this.h;
			a.canvas.style.width =  this.w + 'px';
			a.canvas.style.height = this.h + 'px';
		}
		else if (a.type == 'svg') {
			a.svg.width  = this.w + 'px';
			a.svg.height = this.h + 'px';
			a.svg.style.width =  this.w + 'px';
			a.svg.style.height = this.h + 'px';
		}
		else if (a.type == 'div') {
			a.div.style.width =  this.w + 'px';
			a.div.style.height = this.h + 'px';
		}
	}
	
	//if (useImageData) {
	//	a.imageData = a.ctx.createImageData(this.w, this.h);
	//}

        this.stitchctx.canvas.width = this.w * 2
        this.stitchctx.canvas.height = this.h
}

voyc.World.prototype.setupData = function() {
	this.data = [];
	this.data.countries = topojson.object(worldtopo, worldtopo['objects']['countries']);
	this.data.land = {
		'type':'GeometryCollection',
		'geometries':[topojson.object(worldtopo, worldtopo['objects']['land'])]
	};
	window['voyc']['data']['grid'] = {
		'type': 'GeometryCollection',
		'geometries': [
			{
				'type': "MultiLineString", 
				'coordinates': voyc.Geo.graticule(),
			}
		]
	}
	
	//this.iterator.iterateCollection(window['voyc']['data']['deserts'], this.iterateeInit);
	//this.iterator.iterateCollection(window['voyc']['data']['highmountains'], this.iterateeInit);
	//this.iterator.iterateCollection(window['voyc']['data']['mediummountains'], this.iterateeInit);
	//this.iterator.iterateCollection(window['voyc']['data']['lowmountains'], this.iterateeInit);
	//this.iterator.iterateCollection(window['voyc']['data']['empire'], this.iterateeInit);
}

voyc.World.prototype.spin = function(dir) {
	switch(dir) {
		case voyc.Spin.LEFT : this.co[0] += this.option.spinStep; break;
		case voyc.Spin.RIGHT: this.co[0] -= this.option.spinStep; break;
		case voyc.Spin.UP   : this.co[1] += this.option.spinStep; break;
		case voyc.Spin.DOWN : this.co[1] -= this.option.spinStep; break;
		case voyc.Spin.CW   : this.gamma += this.option.spinStep; break;
		case voyc.Spin.CCW  : this.gamma -= this.option.spinStep; break;
	}
	this.moved = true;
	this.projection.rotate([0-this.co[0], 0-this.co[1], 0-this.gamma]);
	voyc.geosketch.render(0);
}

// zoom by value: slider, setup
voyc.World.prototype.zoomValue = function(value) {
	this.setScale(value);
}

// zoom by increment: keystroke, wheel
voyc.World.prototype.zoom = function(dir) {
	var x = 0;
	switch(dir) {
		case voyc.Spin.IN: x = 1; break;
		case voyc.Spin.OUT: x = -1; break;
	}
	var newscale = this.scale.now + (this.scale.now * x * this.option.scaleStep);
	newscale = voyc.clamp(newscale, this.scale.min, this.scale.max);
	this.setScale(newscale);
}

// up = zoom in, like g-earth: up wheel, up slider, up shift-arrow
voyc.World.prototype.setScale = function(newscale) {
	this.scale.now = newscale || this.scale.now
	this.projection.scale(this.scale.now);
	voyc.geosketch.hud.setZoom(this.scale.now);
	this.moved = true;
	voyc.geosketch.render(0);
}

voyc.World.prototype.createLayer = function(useImageData, id) {
	var a = {};
	a.type = 'canvas';
	a.canvas = document.createElement('canvas');
	a.canvas.id = id;
	a.canvas.classList.add('layer');
	a.canvas.classList.add('visible');
	//a.canvas.classList.add('hidden');
	a.canvas.width  = this.w;
	a.canvas.height = this.h;
	a.canvas.style.width =  this.w + 'px';
	a.canvas.style.height = this.h + 'px';
	this.elem.appendChild(a.canvas);
	a.ctx = a.canvas.getContext("2d");
	if (useImageData) {
		a.imageData = a.ctx.createImageData(this.w, this.h);
	}
	return a;
}

voyc.World.prototype.createLayerSVG = function() {
	var a = {};
	a.type = 'svg';
	//a.svg = document.createElement('svg');
	a.svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
	a.svg.classList.add('layer');
	a.svg.classList.add('visible');
	a.svg.classList.add('hidden');
	a.svg.width  = this.w + 'px';
	a.svg.height = this.h + 'px';
	a.svg.style.width =  this.w + 'px';
	a.svg.style.height = this.h + 'px';
	this.elem.appendChild(a.svg);
	return a;
}

voyc.World.prototype.createLayerDiv = function(eid) {
	var a = {};
	a.type = 'div';
	a.div = document.createElement('div');
	a.div.id = eid;
	a.div.classList.add('layer');
	a.div.classList.add('visible');
	//a.div.classList.add('hidden');
	a.div.style.width =  this.w + 'px';
	a.div.style.height = this.h + 'px';
	this.elem.appendChild(a.div);
	return a;
}

voyc.World.prototype.getLayer = function(layer) {
	return this.layer[layer];
}

// this is only called once during setup
voyc.World.prototype.show = function() {
	this.getLayer(voyc.layer.BACKGROUND).div.classList.remove('hidden');
	this.getLayer(voyc.layer.FASTBACK).canvas.classList.remove('hidden');
	this.getLayer(voyc.layer.FEATURES).canvas.classList.remove('hidden');
	this.showHiRes(voyc.geosketch.getOption(voyc.option.HIRES));
	this.getLayer(voyc.layer.RIVER0).canvas.classList.remove('hidden');
	this.getLayer(voyc.layer.RIVER1).canvas.classList.remove('hidden');
	this.getLayer(voyc.layer.RIVER2).canvas.classList.remove('hidden');
	this.getLayer(voyc.layer.REFERENCE).canvas.classList.remove('hidden');
	this.getLayer(voyc.layer.EMPIRE).canvas.classList.remove('hidden');
	this.getLayer(voyc.layer.FOREGROUND).canvas.classList.remove('hidden');
	this.getLayer(voyc.layer.HERO).canvas.classList.remove('hidden');
	this.getLayer(voyc.layer.HUD).div.classList.remove('hidden');
}

// dragging, called by Hud when mouse or touch is dragging the globe
voyc.World.prototype.drag = function(pt) {
	if (pt) {
		if (!this.dragging) {  // first time
			this.dragProjection = voyc.clone(this.projection);
		}
		this.dragging = true;
		this.co = this.dragProjection.invert(pt);
		this.projection.center(this.co);
		//this.projection.rotate([0-this.co[0], 0-this.co[1]]);
	}
	else { // last time
		this.dragging = false;
	}
	this.moved = true;
	voyc.geosketch.render(0);
}

voyc.World.prototype.moveToCoord = function(co) {
	this.co = co;
	this.projection.center(this.co);
	this.moved = true;
}

voyc.World.prototype.moveToPoint = function(pt) {
	this.co = this.projection.invert(pt);
	this.projection.center(this.co);
	this.moved = true;
	voyc.geosketch.render(0);
}
voyc.World.prototype.getCenterPoint = function() {
	return ([Math.round(this.w/2), Math.round(this.h/2)]);
}

voyc.World.prototype.showHiRes = function(boo) {
	if (boo) {
		this.getLayer(voyc.layer.SLOWBACKA).canvas.classList.remove('hidden');
//		this.getLayer(voyc.layer.FASTBACK).canvas.classList.add('hidden');
//		this.getLayer(voyc.layer.FEATURES).canvas.classList.add('hidden');
	}
	else {
		this.getLayer(voyc.layer.SLOWBACKA).canvas.classList.add('hidden');
//		this.getLayer(voyc.layer.FASTBACK).canvas.classList.remove('hidden');
//		this.getLayer(voyc.layer.FEATURES).canvas.classList.remove('hidden');
	}
}

voyc.World.prototype.drawOceansAndLand = function() {
	var ctx = this.getLayer(voyc.layer.FEATURES).ctx;
	ctx.clearRect(0, 0, this.w, this.h);
	
	ctx = this.getLayer(voyc.layer.FASTBACK).ctx;
	ctx.clearRect(0, 0, this.w, this.h);
	
	// oceans
	ctx.fillStyle = voyc.color.water;
	ctx.beginPath();
	if (this.projection.mix == voyc.Projection.orthographic)
		ctx.arc(this.w/2, this.h/2, this.projection.k, 0*Math.PI, 2*Math.PI);
	else { // mercator 
		nw = this.projection.project([-180,85])
		se = this.projection.project([180,-85])
		ctx.rect(nw[0], nw[1], se[0]-nw[0], se[1]-nw[1])
	}
	ctx.fill();

	// land
	var land = this.data.land;
	ctx.fillStyle = voyc.color.land;
	ctx.beginPath();
	this.iterator.iterateCollection(this.data.land, this.iterateeLand);
	ctx.fill();
	this.doubleStitch(ctx, 1500)
}

voyc.World.prototype.drawGrid = function() {
	var ctx = this.getLayer(voyc.layer.REFERENCE).ctx;
	ctx.clearRect(0, 0, this.w, this.h);
	//if (voyc.geosketch.getOption(voyc.option.GRATICULE)) {
	if (true) {
		this.iterator.iterateCollection(window['voyc']['data']['grid'], this.iterateeGrid);
	}
}

voyc.World.prototype.drawRivers = function() {
	this.iterateeRiver.ctx.strokeStyle = '#00F';
	this.iterateeRiver.ctx.lineWidth = 3.0;
	this.iterator.iterateCollection(window['voyc']['data']['river'][1], this.iterateeRiver);
	this.iterateeRiver.ctx.lineWidth = 2.5;
	this.iterator.iterateCollection(window['voyc']['data']['river'][2], this.iterateeRiver);
	this.iterateeRiver.ctx.lineWidth = 2.0;
	this.iterator.iterateCollection(window['voyc']['data']['river'][3], this.iterateeRiver);
	this.iterateeRiver.ctx.lineWidth = 1.5;
	this.iterator.iterateCollection(window['voyc']['data']['river'][4], this.iterateeRiver);
	this.iterateeRiver.ctx.lineWidth = 1.0;
	this.iterator.iterateCollection(window['voyc']['data']['river'][5], this.iterateeRiver);
	this.iterateeRiver.ctx.lineWidth = 0.5;
	this.iterator.iterateCollection(window['voyc']['data']['river'][6], this.iterateeRiver);
}

voyc.World.prototype.drawRiversAnim = function() {
	this.riverpass++;
	if (this.riverpass > 2){
		this.riverpass = 0;
	}
	if (this.riverpass == 0) {
		this.iterateeRiverAnim.ctx = this.getLayer(voyc.layer.RIVER0).ctx;
		this.iterateeRiverAnim.ctx.clearRect(0, 0, this.w, this.h);
		this.iterateeRiverAnim.radius = 2.8;
		this.iterator.iterateCollection(window['voyc']['data']['river'][1], this.iterateeRiverAnim);
		this.iterateeRiverAnim.radius = 2.4;
		this.iterator.iterateCollection(window['voyc']['data']['river'][2], this.iterateeRiverAnim);
		this.iterateeRiverAnim.radius = 1.0;
		this.iterator.iterateCollection(window['voyc']['data']['river'][5], this.iterateeRiverAnim);
	}
	if (this.riverpass == 1) {
		this.iterateeRiverAnim.ctx = this.getLayer(voyc.layer.RIVER1).ctx;
		this.iterateeRiverAnim.ctx.clearRect(0, 0, this.w, this.h);
		this.iterateeRiverAnim.radius = 2;
		this.iterator.iterateCollection(window['voyc']['data']['river'][3], this.iterateeRiverAnim);
		this.iterateeRiverAnim.radius = 1.5;
		this.iterator.iterateCollection(window['voyc']['data']['river'][4], this.iterateeRiverAnim);
	}
	if (this.riverpass == 2) {
		this.iterateeRiverAnim.ctx = this.getLayer(voyc.layer.RIVER2).ctx;
		this.iterateeRiverAnim.ctx.clearRect(0, 0, this.w, this.h);
		this.iterateeRiverAnim.radius = 1.2;
		this.iterator.iterateCollection(window['voyc']['data']['river'][6], this.iterateeRiverAnim);
	}
}

//	if (voyc.geosketch.getOption(voyc.option.HIRES)) {
//		var ctx = this.getLayer(voyc.layer.SLOWBACKA).ctx;
//		ctx.clearRect(0, 0, this.w, this.h);
//		var dst = {w:this.w, h:this.h, projection:this.projection, ctx:this.getLayer(voyc.layer.SLOWBACKA).ctx, imageData:this.getLayer(voyc.layer.SLOWBACKA).imageData};
//		voyc.Geo.drawTexture(dst, voyc.geosketch.texture);
//	}


//	if (voyc.geosketch.getOption(voyc.option.PRESENTDAY)) {
//		ctx.strokeStyle = '#f88';
//		ctx.beginPath();
//		this.iterator.iterateCollection(this.data.countries, this.iterateeCountries);
//		ctx.stroke();
//	}

voyc.World.prototype.drawFeatures = function() {
	return
	var ctx = this.getLayer(voyc.layer.FEATURES).ctx;
	ctx.clearRect(0, 0, this.w, this.h);

	// deserts
	var pattern = ctx.createPattern(voyc.geosketch.asset.get('desert'), 'repeat');
	ctx.fillStyle = pattern;
	//ctx.fillStyle = voyc.color.desert;
	ctx.beginPath();
	this.iterator.iterateCollection(window['voyc']['data']['deserts'], this.iterateeFeature);
	ctx.fill();

	// high mountains
	var pattern = ctx.createPattern(voyc.geosketch.asset.get('mtnhi'), 'repeat');
	ctx.fillStyle = pattern;
	ctx.beginPath();
	this.iterator.iterateCollection(window['voyc']['data']['highmountains'], this.iterateeFeature);
	ctx.fill();

	// medium mountains
	var pattern = ctx.createPattern(voyc.geosketch.asset.get('mtnmed'), 'repeat');
	ctx.fillStyle = pattern;
	ctx.beginPath();
	this.iterator.iterateCollection(window['voyc']['data']['mediummountains'], this.iterateeFeature);
	ctx.fill();

	// lo mountains
	var pattern = ctx.createPattern(voyc.geosketch.asset.get('mtnlo'), 'repeat');
	ctx.fillStyle = pattern;
	ctx.beginPath();
	this.iterator.iterateCollection(window['voyc']['data']['lowmountains'], this.iterateeFeature);
	ctx.fill();

	return;
/*	
	// medium mountains
	ctx.fillStyle = '#963';
	ctx.beginPath(), path.ctx(ctx)(voyc.data.mediummountains), ctx.fill();

	// low mountains
	ctx.fillStyle = '#060';
	ctx.beginPath(), path.ctx(ctx)(voyc.data.lowmountains), ctx.fill();

	// plateaux
	ctx.fillStyle = '#ff9';
	ctx.beginPath(), path.ctx(ctx)(voyc.data.plateaux), ctx.fill();

	// swamps
	ctx.fillStyle = '#0f0';
	ctx.beginPath(), path.ctx(ctx)(voyc.data.swamps), ctx.fill();

	// foothills
	ctx.fillStyle = '#3c3';
	ctx.beginPath(), path.ctx(ctx)(voyc.data.foothills), ctx.fill();

	// valleys
	ctx.fillStyle = '#0f0';
	ctx.beginPath(), path.ctx(ctx)(voyc.data.valleys), ctx.fill();

	// plains
	ctx.fillStyle = '#0f0';
	ctx.beginPath(), path.ctx(ctx)(voyc.data.valleys), ctx.fill();

	// tundras
	ctx.fillStyle = '#ffe6ff';
	ctx.beginPath(), path.ctx(ctx)(window['voyc']['data']['tundras']), ctx.fill();
*/
}

/** @enum */
voyc.layer = {
	BACKGROUND:0,
	SLOWBACKA:1,
	FASTBACK:2,
	FEATURES:3,
	RIVER0:4,
	RIVER1:5,
	RIVER2:6,
	REFERENCE:7,
	EMPIRE:8,
	FOREGROUND:9,
	HERO:10,
	HUD:11,
}

/** @struct */
voyc.color = {
	land: 'rgb(216,218,178)',
	water: 'rgb(111,166,207)',
	desert: 'rgb(235,220,198)',
	highmountain: 'rgb(123,139,125)',
}
/** @const */
voyc.empireColors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];

/** @enum */
voyc.Spin = {
	STOP:0,
	CW:1,
	CCW:2,
	IN:3,
	OUT:4,
	RIGHT:5,
	LEFT:6,
	UP:7,
	DOWN:8,
}		