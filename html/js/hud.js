/**
	class Hud
	singleton
	manages the HUD as the top layer of the display 
*/
var hudlog = false

voyc.Hud = function() {
	// singleton
	if (voyc.Hud._instance) return voyc.Hud._instance;
	else voyc.Hud._instance = this;

	this.elem = {};
	this.keyIsDown = false;
	this.mapzoomer = {};
	this.mapzoomerIsHot = false;
	this.timeslider = {};
	this.timesliderIsHot = false;
	this.menuIsOpen = false;

	// touch gesture constants
	this.periodtap = 500
	this.perioddoubletap = 250
	this.pinchThreshold = .1
	this.twistThreshold = .001

	// touch gesture variables
	this.timetouchmove  = new Date()
	this.timetouchstart = new Date()
	this.timetouchend   = new Date()
	this.timetap        = new Date()
	this.hypo  = false
	this.angle = false
	this.pttouchstart = false

	this.tool = 'point'
}

voyc.Hud.prototype.resize = function(w, h) {
	for (var id of ['mapzoom','projectbtn', 'layerbtn','whereami'])
		if (w < 500)
			voyc.$(id).classList.add('mobile')
		else
			voyc.$(id).classList.remove('mobile')
}

voyc.Hud.prototype.setup = function(elem) {
	this.elem = elem;
	this.menuIsOpen = false;
	this.populateLayerMenu()
	this.setupProjectBtn()
	this.setupToolBar()
	this.setupEditBar()
	this.attachButtons()
	this.attachMapZoomer()
	this.attachTimeSlider()
	this.attachKeyboard()
	this.attachTouch()
	this.attachMouse()
	var w = document.body.clientWidth 
	var h = document.body.clientHeight
	this.resize(w,h)
}

voyc.Hud.prototype.closeModal = function(note) {
	voyc.closePopup();
}

// -------- buttons

voyc.Hud.prototype.populateLayerMenu = function() {
	var s = ''
	for (var id in voyc.geosketch.world.layer) {
		if (voyc.geosketch.world.layer[id].menulabel) {
			var isChecked = voyc.geosketch.world.layer[id].enabled ? 'checked':''
			s += voyc.prepString("<div><span><input type='checkbox' $3 layerid='$1' id='layer$1' class='layermenucheckbox' /><label for='layer$1' > $2</label></span>", [id, voyc.geosketch.world.layer[id].menulabel, isChecked])
			s += voyc.prepString("<button g id='palettebtn$1' class='layerpalettebtn'><img src='i/palette_black_24.png'/></button></div>", [id])
		}
		if (id == 'custom')
			s += "<div><span><b>Custom</b></span></div>"
	}
	s += "<div><span><button class='anchor' id='newlayer'>New...</a></span></div>"

	var layermenu = voyc.$('layermenu')
	layermenu.innerHTML = s

	var list = layermenu.querySelectorAll('.layermenucheckbox')
	list.forEach((e) => {
		e.addEventListener('click', function(evt) {
			evt.stopPropagation()
			var layerid = evt.target.getAttribute('layerid')
			var boo = evt.target.checked
			voyc.geosketch.world.enableLayer(layerid, boo)

			// show the chronometer only when empire layer is enabled
			if (layerid == 'empire') 
				voyc.show(voyc.$('chronometer'), boo)
		}, false)
	})
}

voyc.Hud.prototype.attachButtons = function() {
	var self = this
	document.getElementById('helpbtn').addEventListener('click', function(evt) {
		voyc.$('helplnk').click()
	}, false);

	document.getElementById('announcedone').addEventListener('click', function(evt) {
		evt.stopPropagation();
		self.closeAnnouncement();
	}, false);

	document.getElementById('projectbtn').addEventListener('click', function(evt) {self.onProjectBtn(evt)}, false)

	
	document.getElementById('option-maxscale').addEventListener('change', function(evt) {
		voyc.geosketch.setOption( 'maxscale', parseFloat(evt.target.value))
	}, false)

	document.getElementById('option-showid').addEventListener('change',  function(evt) {
		voyc.geosketch.setOption( 'showid', evt.target.checked)
	}, false)

	document.getElementById('option-animation').addEventListener('change',  function(evt) {
		voyc.geosketch.setOption( 'animation', evt.target.checked)
		voyc.geosketch.animate(evt.target.checked)
	}, false)

	document.getElementById('option-fps').addEventListener('change', function(evt) {
		var fps = parseFloat(evt.target.value)
		voyc.geosketch.setOption( 'fps', fps)
		voyc.geosketch.game.maxfps = fps
	}, false)
}
	
voyc.Hud.prototype.attachTimeSlider = function() {
	var self = this
	voyc.$('timeforwardbtn').addEventListener('click', function(evt) {
		voyc.geosketch.world.stepTime(true)
	}, false)	
	voyc.$('timebackbtn').addEventListener('click', function(evt) {
		voyc.geosketch.world.stepTime(false)
	}, false)	

	this.timeslider = document.getElementById('timeslider');
	this.timeslider.min = voyc.geosketch.world.time.begin;
	this.timeslider.max = voyc.geosketch.world.time.end;

	this.timeslider.addEventListener('mousedown', function(evt) {
		self.timeSliderDown(evt)
	}, false);
	this.timeslider.addEventListener('mousemove', function(evt) {
		self.timeSliderMove(evt)
	}, false);
	this.timeslider.addEventListener('input', function(evt) {
		self.timeSliderMove(evt,true)
	}, false);
	this.timeslider.addEventListener('mouseup', function(evt) {
		self.timeSliderUp(evt)
	}, false);
}

voyc.Hud.prototype.attachKeyboard = function() {
	var self = this
	window.addEventListener('keydown', function(evt) {
		if (evt.keyCode == voyc.Key.ESC) {
			self.unHit()
			return
		}
		if (evt.keyCode == voyc.Key.C && evt.altKey) {
			return
		}
		if (evt.keyCode == voyc.Key.P && evt.altKey) {
			return
		}
		if (evt.ctrlKey) {
			switch (evt.keyCode) {
				case 39: voyc.geosketch.timeForward(); break;
				case 37: voyc.geosketch.timeBackward(); break;
				default: return;
			}
		}
		else if (evt.shiftKey) {
			switch (evt.keyCode) {
				case 39: voyc.geosketch.world.spin(voyc.spin.CW); break;
				case 37: voyc.geosketch.world.spin(voyc.spin.CCW); break;
				case 38: voyc.geosketch.world.zoom(voyc.spin.IN); break;
				case 40: voyc.geosketch.world.zoom(voyc.spin.OUT); break;
				default: return;
			}
		}
		else {
			switch (evt.keyCode) {
				case 39: voyc.geosketch.world.spin(voyc.spin.RIGHT); break;
				case 37: voyc.geosketch.world.spin(voyc.spin.LEFT ); break;
				case 38: voyc.geosketch.world.spin(voyc.spin.DOWN ); break;
				case 40: voyc.geosketch.world.spin(voyc.spin.UP   ); break;
				default: return;
			}
		}
		evt.preventDefault();
		self.keyIsDown = true;
	}, false);

	window.addEventListener('keyup', function(evt) {
		if (self.keyIsDown) {
			self.keyIsDown = false;
			evt.preventDefault();
		}
	}, false);
}

// -------- tool bars

voyc.Hud.prototype.setupToolBar = function() {
	var e = voyc.$('toolbarbtn')
	if (e) e.addEventListener('click', function(evt) {
		evt.stopPropagation(); evt.preventDefault();
	}, false)
	var tools = document.querySelectorAll('.toolbtn')
	var self = this
	for (var tool of tools) {
		tool.addEventListener('click', function(evt) {
			evt.stopPropagation(); evt.preventDefault();
			self.setTool(evt.currentTarget.id.substring(0,evt.currentTarget.id.indexOf('_')))
		}, false)
	}
}
voyc.Hud.prototype.setTool = function(newtool) {
	this.tool = newtool
	if (hudlog) console.log(`tool: ${this.tool}`)

	// highlight the selected tool button
	var toolbtns = document.querySelectorAll('.toolbtn')
	for (var btn of toolbtns)
		btn.classList.remove('down')
	voyc.$(this.tool + '_btn').classList.add('down')	

	// change the cursor
	this.setCursor(newtool)

	// show/hide the edit bar
	if (this.tool == 'sketch')
		voyc.$('editbar').classList.remove('hidden')	
	else
		voyc.$('editbar').classList.add('hidden')	
}
voyc.Hud.prototype.setCursor = function(newcursor) {
	var e = voyc.$('hud')
	for (var cursor of voyc.cursors)
		e.classList.remove(cursor)
	e.classList.add(newcursor)
}

voyc.Hud.prototype.setupEditBar = function() {
	var self = this
	var tools = document.querySelectorAll('.editbtn')
	for (var tool of tools) {
		tool.addEventListener('click', function(evt) {
			evt.stopPropagation(); evt.preventDefault();
			var action = evt.currentTarget.id.substring(0,evt.currentTarget.id.indexOf('_'))
			voyc.geosketch.sketch[action]()
		}, false)
	}
	var tools = document.querySelectorAll('.shapebtn')
	for (var tool of tools) {
		tool.addEventListener('click', function(evt) {
			evt.stopPropagation(); evt.preventDefault();
			var shape = evt.currentTarget.id.substring(0,evt.currentTarget.id.indexOf('_'))
			voyc.geosketch.sketch.setShape(shape)
			for (var tool of tools)
				tool.classList.remove('down')
			evt.currentTarget.classList.add('down')
		}, false)
	}
}

// -------- project button

voyc.Hud.prototype.setupProjectBtn = function() {
	var id = (voyc.geosketch.world.projection.mix == voyc.Projection.orthographic) ? 'globeimg' : 'mercimg'
	voyc.show(voyc.$(id),false)
}
voyc.Hud.prototype.onProjectBtn = function(evt,btn) {
	if (hudlog) console.log(['projectbtn','click',evt.target.id,evt.currentTarget.id])
	evt.preventDefault(); evt.stopPropagation()
	if (evt.currentTarget.firstElementChild.classList.contains('hidden')) {
		voyc.show(voyc.$('mercimg'),false)
		voyc.show(voyc.$('globeimg'),true)
		voyc.geosketch.world.mercator()
	}
	else {
		voyc.show( voyc.$('mercimg'),true)
		voyc.show( voyc.$('globeimg'),false)
		voyc.geosketch.world.orthographic()
	}
}

voyc.Hud.prototype.showWhereami = function (pt) {
	var co = voyc.geosketch.world.projection.invert(pt)
	lngd = (co[0]<=0) ? '&deg;W'  : '&deg;E'
	latd = (co[1]<=0) ? '&deg;S,&nbsp;': '&deg;N,&nbsp;'
	lng = Math.abs(co[0].toFixed(2))
	lat = Math.abs(co[1].toFixed(2))
	s = lat + latd + lng + lngd
	voyc.$('whereami').innerHTML = s
}

voyc.Hud.prototype.showLabel = function (pt,s) {
	var e = voyc.$('label')
	if (pt) {
		e.innerHTML = s
		e.style.left= pt[0] + 'px'
		e.style.top = pt[1] + 'px'
	}
	voyc.show(e, (pt))
}

// -------- time slider

voyc.Hud.prototype.setTime = function(time) {
	var era = (time < 0) ? ' BCE' : ' CE'
	voyc.$('time').innerHTML = Math.abs(time) + era
	this.timeslider.value = time
}

voyc.Hud.prototype.timeSliderDown = function (evt) {
	evt.stopPropagation()
	this.timesliderIsHot = true
	voyc.geosketch.world.grabTime(evt)
}
voyc.Hud.prototype.timeSliderMove = function (evt,force) {
	evt.stopPropagation()
	if (this.timesliderIsHot || force)
		voyc.geosketch.world.setTime(parseInt(evt.target.value,10))
}

voyc.Hud.prototype.timeSliderUp = function (evt) {
	evt.stopPropagation();
	this.timesliderIsHot = false
	voyc.geosketch.world.dropTime(evt)
}

// -------- map zoomer

voyc.Hud.prototype.attachMapZoomer = function() {
	this.mapzoomer = document.getElementById('mapzoomer')
	this.mapzoomer.min = voyc.geosketch.world.scale.min
	this.mapzoomer.max = voyc.geosketch.world.scale.max

	var self = this
	this.mapzoomer.addEventListener('mousedown', function(evt) {self.mapZoomerDown(evt)}, false)
	this.mapzoomer.addEventListener('touchstart', function(evt) {self.mapZoomerDown(evt)}, false)
	this.mapzoomer.addEventListener('input', function(evt) {self.mapZoomerMove(evt)}, false)
	this.mapzoomer.addEventListener('mousemove', function(evt) {self.mapZoomerMove(evt)}, false)
	this.mapzoomer.addEventListener('touchend', function(evt) {self.mapZoomerUp(evt)}, false)
	this.mapzoomer.addEventListener('mouseup', function(evt) {self.mapZoomerUp(evt)}, false)

	document.getElementById('zoomplusbtn').addEventListener('click', function(e) {
		voyc.geosketch.world.zoom(voyc.spin.IN)	
	}, false)
	document.getElementById('zoomminusbtn').addEventListener('click', function(e) {
		voyc.geosketch.world.zoom(voyc.spin.OUT)	
	}, false)
}

// five ways to zoom, to call world.setScale()
//   1. mouse wheel
//   2. click plus or minus
//   3. drag zoom slider
//   4. keyboard shift up or down arrow
//   5. touch two-finger pinch

// zoom UI, like google earth: up is zoom in, down is zoom out
// up = zoom in: up wheel, up slider, up shift-arrow, up plus

voyc.Hud.prototype.mapZoomerDown = function (evt) {
	evt.stopPropagation();
	this.mapzoomerIsHot = true;
	voyc.geosketch.world.grab()
}
voyc.Hud.prototype.mapZoomerMove = function (evt) {
	evt.stopPropagation();
	if (this.mapzoomerIsHot)
		voyc.geosketch.world.setScale(parseInt(evt.target.value,10));
}

voyc.Hud.prototype.mapZoomerUp = function (evt) {
	evt.stopPropagation();
	this.mapzoomerIsHot = false
	voyc.geosketch.world.drop()
}

voyc.Hud.prototype.mapZoomWheel = function(evt) {
	var spin = (evt.deltaY > 0) ? voyc.spin.OUT : voyc.spin.IN
	pt = this.getMousePt(evt)
	voyc.geosketch.world.zoom(spin,pt)	
}

// -------- public

voyc.Hud.prototype.fade = function(elem, boo) {
	if (boo)
		elem.classList.add('in')
	else
		elem.classList.remove('in');
}

voyc.Hud.prototype.announce = function(msg,duration) {
	document.getElementById('announcemsg').innerHTML = msg;
	this.fade(document.getElementById('announce'), true);
	if (duration) {
		var self = this;
		setTimeout(function() {
			self.closeAnnouncement();
		}, duration);
	}
}

voyc.Hud.prototype.closeAnnouncement = function() {
	this.fade(document.getElementById('announce'), false);
}

voyc.Hud.prototype.setZoom = function(newvalue, newfactor) {
	if (!this.mapzoomerIsHot) {
		this.mapzoomer.value = newvalue;
	}
	voyc.$('option-scale').innerHTML = 'scale: ' + newvalue + ', ' + newfactor
}

voyc.Hud.prototype.setCo = function(co,gamma) {
	voyc.$('option-co').innerHTML = co[0].toFixed(2)+', '+co[1].toFixed(2)+', '+gamma
}

// -------- mouse

voyc.Hud.prototype.attachMouse = function() {
	var self = this
	this.elem.addEventListener('mousedown', function(evt) {self.onmousedown(evt), false})
	this.elem.addEventListener('mousemove', function(evt) {self.onmousemove(evt), false})
	this.elem.addEventListener('mouseup',   function(evt) {self.onmouseup(evt)  , false})
	this.elem.addEventListener('dblclick',  function(evt) {self.ondblclick(evt) , false})
	this.elem.addEventListener('wheel',     function(evt) {self.onwheel(evt)    , false})
	this.dragPrev = false
	this.mousebuttondown = false
	this.mousemoved = false
}

voyc.Hud.prototype.getMousePt = function(evt) { 
	var pt = false;
	if (evt.pageX || evt.pageY) {
		pt = [evt.pageX, evt.pageY];
	}
	return pt;
}
	
voyc.Hud.prototype.onmousedown = function(evt) {
	if (hudlog) console.log(['hud','mousedown',evt.target.id,evt.currentTarget.id])
	this.unHit()
	if (evt.target.id != 'hud')
		return (hudlog)&&console.log(['ignored','hud','mousedown',evt.target.id,evt.currentTarget.id])
	evt.preventDefault(); evt.stopPropagation()
	this.dragPrev = this.getMousePt(evt)
	this.mousebuttondown = evt.button
	
	if ((this.tool == 'point') || (this.mousebuttondown == voyc.mouse.middle))
		voyc.geosketch.world.grab()
}

voyc.Hud.prototype.onmousemove = function(evt) {
	if (hudlog) console.log(['hud','mousemove',evt.target.id,evt.currentTarget.id])
	evt.preventDefault(); evt.stopPropagation()
	var pt = this.getMousePt(evt)
	this.showWhereami(pt)
	if (this.dragPrev) {
		if ((this.tool == 'point') || (this.mousebuttondown == voyc.mouse.middle)) {
			voyc.geosketch.world.drag(pt, this.dragPrev);
			this.setCursor('move')
		}
		else if (this.tool == 'sketch')
			voyc.geosketch.sketch.addPoint(pt, this.dragPrev)
		this.dragPrev = pt
		this.mousemoved = true
	}
	else if (this.tool == 'sketch')
		voyc.geosketch.sketch.mousemove(pt)
}

voyc.Hud.prototype.onmouseup = function(evt) {
	if (hudlog) console.log(['hud','mouseup',evt.target.id,evt.currentTarget.id])
	if (this.mousebuttondown === false)
		return (hudlog)&&console.log(['ignored', 'hud','mouseup',evt.target.id,evt.currentTarget.id])
	evt.preventDefault(); evt.stopPropagation()
	var pt = this.getMousePt(evt)
	var click = !(this.mousemoved)

	//if ((this.tool == 'point') || evt.shiftKey) {
	if (this.dragPrev) {
		if (click) {
			var s = voyc.geosketch.world.testHit(pt)
			if (s) this.showLabel(pt,s)
		}
	}
	voyc.geosketch.world.drop()
	if (this.tool == 'sketch')
		if (click)
			voyc.geosketch.sketch.addPoint(pt, this.dragPrev)
	this.setCursor('point')
	this.dragPrev = false
	this.mousebuttondown = false
	this.mousemoved = false
}

voyc.Hud.prototype.unHit = function() {
	this.showLabel(false)
	voyc.geosketch.world.clearHilite()
}

voyc.Hud.prototype.ondblclick = function(evt) {
	// on dblclick, the up and click events have already fired
	if (hudlog) console.log(['hud','dblclick',evt.target.id,evt.currentTarget.id])
	evt.preventDefault(); evt.stopPropagation()
//	if (this.tool == 'sketch')
//		voyc.geosketch.sketch.finish()
}

voyc.Hud.prototype.onwheel = function(evt) {
	evt.preventDefault(); evt.stopPropagation()
	this.mapZoomWheel(evt)
}

// -------- touch

voyc.Hud.prototype.attachTouch = function() {
	var self = this
	this.elem.addEventListener('touchmove', function(evt) {self.ontouchmove(evt), false})
	this.elem.addEventListener('touchstart',function(evt) {self.ontouchstart(evt), false})
	this.elem.addEventListener('touchend',  function(evt) {self.ontouchend(evt)  , false})

	this.timetouchmove = new Date()
	this.timetouchstart = new Date()
	this.timetouchend = new Date()
}

voyc.Hud.prototype.gesture = function(evt) {
	// return four values
	var g = {x:0, y:0, pinch:0, twist:0}

	// two input touch points
	var x1 = evt.targetTouches[0].pageX - evt.target.offsetLeft
	var y1 = evt.targetTouches[0].pageY - evt.target.offsetTop
	var x2 = evt.targetTouches[1].pageX - evt.target.offsetLeft
	var y2 = evt.targetTouches[1].pageY - evt.target.offsetTop

	// the center between the two points, the average
	g['x'] = Math.round((x1 + x2) / 2)
	g['y'] = Math.round((y1 + y2) / 2)

	// length of the hypotenuse between the two points, distance, size of pinch
	var hypo = Math.sqrt(Math.pow(x1-x2,2) + Math.pow(y1-y2,2)) // pythagorus

	// angle of the hypotenuse to horizontal, twist
	var angle = Math.atan((y2-y1)/(x2-x1)) * (180/Math.PI)

	// init on first move 
	if (!this.hypo) this.hypo = hypo
	if (!this.angle) this.angle = angle

	// adjust for crossing the vertical of plus or minus 90 degrees 
 	if (Math.abs(angle) > 45) {
		if (angle<0 && this.angle>0)  { this.angle -= 180 }
		if (angle>0 && this.angle<0)  { this.angle += 180 }
	}

	// change in pinch and twist since previous event
	mhypo = hypo - this.hypo
	if (Math.abs(mhypo) > this.pinchThreshold) {
		g['pinch'] = mhypo
		this.hypo = hypo
	}
	mangle = angle - this.angle
	if (Math.abs(mangle) > this.twistThreshold) {
		g['twist'] = mangle
		this.angle = angle
	}
	return g
}

voyc.Hud.prototype.ptTouch = function(evt) {
	return [Math.round(evt.targetTouches[0].pageX - evt.target.offsetLeft),
		Math.round(evt.targetTouches[0].pageY - evt.target.offsetTop)]
}

voyc.Hud.prototype.ontouchstart = function(evt) {
	if (evt.target == this.elem && evt.currentTarget == this.elem) ; else return
	this.touchdown = true
	var time = new Date()

	this.timetouchstart = time
	this.pttouchstart = this.ptTouch(evt)
	this.ptPrev = this.pttouchstart
}

voyc.Hud.prototype.ontouchmove = function(evt) {
	if (this.touchdown && evt.currentTarget == this.elem) ; else return
	var time = new Date()

	if (evt.touches.length > 1) {
		g = this.gesture(evt)
		this.publish(evt, 'twofingermove', [g['x'], g['y']], g['pinch'], g['twist'])
	}
	else {
		this.publish(evt, 'onefingermove', this.ptTouch(evt))
	}

	this.timetouchmove = time
}

voyc.Hud.prototype.ontouchend  = function(evt) {
	if (this.touchdown && evt.currentTarget == this.elem) ; else return
	this.touchdown = false

	var time = new Date()

	// detect tap and doubletap
	if (((time - this.timetouchstart) < this.periodtap) &&
			(this.timetouchstart > this.timetouchmove)) {
		if ((time - this.timetap) < this.perioddoubletap) {
			this.publish(evt, 'doubletap')
		}
		else {
			this.publish(evt, 'tap', this.pttouchstart)
			this.timetap = time
		}
	}

	this.hypo = false
	this.angle = false
	this.ptPrev = false
	this.timetouchend = time
}

voyc.Hud.prototype.publish = function(evt, name, pt, pinch, twist) {
	// window events: touchstart, touchend, touchmove
	// geosketch events: tap, doubletap, onefingermove, twofingermove
	if (name == 'tap') {
		if (this.tool == 'move')
			voyc.geosketch.world.moveToPoint(pt)
		else if (this.tool == 'point') {
			var s = voyc.geosketch.world.testHit(pt)
			if (s)
				this.showLabel(pt,s)
		}
		else if (this.tool == 'sketch') 
			voyc.geosketch.sketch.addPoint(pt, this.ptPrev)
		else if (this.tool == 'measure')
			;
	}
	else if (name == 'doubletap') 
		voyc.geosketch.sketch.finish()
	else if (name == 'onefingermove') {
		if (this.tool == 'move') {
			voyc.geosketch.world.drag(pt,this.ptPrev)
			this.ptPrev = pt
		}
		else if (this.tool == 'point')
			;
		else if (this.tool == 'sketch')
			voyc.geosketch.sketch.addPoint(pt, this.ptPrev)
		else if (this.tool == 'measure')
			;
	}
	else if (name == 'twofingermove') {
		voyc.geosketch.world.drag(pt,this.ptPrev)
		this.ptPrev = pt
		if (pinch) {
			if (pinch < -2)
				voyc.geosketch.world.zoom(voyc.spin.OUT)
			else if (pinch > 2)
				voyc.geosketch.world.zoom(voyc.spin.IN)
		}
		voyc.$('whereami').innerHTML = twist
		if (twist) {
			if (twist < -2)
				voyc.geosketch.world.spin(voyc.spin.CCW)
			else if (twist > 2)
				voyc.geosketch.world.spin(voyc.spin.CW)
		}
	}
}

// -------- global constants

voyc.mouse = {
	left: 0,
	middle: 1,
	right: 2,
}

voyc.cursors = ['point','move','sketch','point','measure']
voyc.tools = ['point','sketch','measure']
// this.tool
// tool button id: move_btn, sketch_btn, etc
// #hud.classname with cursor setting
// move and point have been combined into one tool named 'point'

//tool cursor
//setTool('point', 'point')
//setTool('point', 'move')

