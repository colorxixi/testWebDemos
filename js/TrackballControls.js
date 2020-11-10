/**
 * @author Eberhard Graether / http://egraether.com/
 */
//this version has been modeified by Zhouxin Xi.
// take account of the document scroll, and the shared THREE.TrackballControls.target

THREE.TrackballControls = function ( object, domElement ) {

	var _this = this;
	var STATE = { NONE: -1, ROTATE: 0, ZOOM: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_ZOOM: 4, TOUCH_PAN: 5 };

	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	// API

	this.enabled = true;

	this.screen = { left: 0, top: 0, width: 0, height: 0 };

	this.rotateSpeed = 1.0;
	this.zoomSpeed = 1.5;
	this.panSpeed = 0.4;

	this.noRotate = false;
	this.noZoom = false;
	this.noPan = false;
	this.noRoll = false;

	this.staticMoving = false;
	this.dynamicDampingFactor = 0.2;

	this.minDistance = 0;
	this.maxDistance = Infinity;

	this.keys = [ 65 /*A*/, 83 /*S*/, 68 /*D*/ ];

	// internals

    THREE.TrackballControls.target = new THREE.Vector3();

	var lastPosition = new THREE.Vector3();

    var _state = STATE.NONE,
	 _prevState = STATE.NONE,

	_eye = new THREE.Vector3(),

	_rotateStart = new THREE.Vector3(),
	_rotateEnd = new THREE.Vector3(),

	_zoomStart = new THREE.Vector2(),
	_zoomEnd = new THREE.Vector2(),

	_touchZoomDistanceStart = 0,
	_touchZoomDistanceEnd = 0,

	_panStart = new THREE.Vector2(),
	_panEnd = new THREE.Vector2();

	// for reset

	this.target0 = THREE.TrackballControls.target.clone();
	this.position0 = this.object.position.clone();
	this.up0 = this.object.up.clone();
//    this.up0 = new THREE.Vector3(0,0,1); //I reset this as the initial camera direction

	// events

	var changeEvent = { type: 'change' };


	// methods

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.screen.left = 0;
			this.screen.top = 0;
			this.screen.width = window.innerWidth;
			this.screen.height = window.innerHeight;

		} else {

			this.screen = this.domElement.getBoundingClientRect();
		}

	};

	this.handleEvent = function ( event ) {

		if ( typeof this[ event.type ] == 'function' ) {

			this[ event.type ]( event );

		}

	};

	this.getMouseOnScreen = function ( clientX, clientY ) {
        clientX+=document.body.scrollLeft+ document.documentElement.scrollLeft-Math.floor(_this.screen.left);
        clientY+=document.body.scrollTop+ document.documentElement.scrollTop-Math.floor(_this.screen.top);
        return new THREE.Vector2(
            clientX / _this.screen.width,
            clientY / _this.screen.height
        );
	};

	this.getMouseProjectionOnBall = function ( clientX, clientY ) {
        var mouseOnBall = new THREE.Vector3(
            2*( clientX - _this.screen.left+ document.body.scrollLeft + document.documentElement.scrollLeft ) / (_this.screen.width)-1,
            1-2*(clientY-_this.screen.top+ document.body.scrollTop + document.documentElement.scrollTop) / _this.screen.height,
            0.0
        );
		var length = mouseOnBall.length();

		if ( _this.noRoll ) {

			if ( length < Math.SQRT1_2 ) {

				mouseOnBall.z = Math.sqrt( 1.0 - length*length );

			} else {

				mouseOnBall.z = .5 / length;

			}

		} else if ( length > 1.0 ) {

			mouseOnBall.normalize();

		} else {

			mouseOnBall.z = Math.sqrt( 1.0 - length * length );

		}

		_eye.copy( _this.object.position ).sub( THREE.TrackballControls.target );

		var projection = _this.object.up.clone().setLength( mouseOnBall.y );
		projection.add( _this.object.up.clone().cross( _eye ).setLength( mouseOnBall.x ) );
		projection.add( _eye.setLength( mouseOnBall.z ) );

		return projection;

	};

	this.rotateCamera = function () {

		var angle = Math.acos( _rotateStart.dot( _rotateEnd ) / _rotateStart.length() / _rotateEnd.length() );

		if ( angle ) {

			var axis = ( new THREE.Vector3() ).crossVectors( _rotateStart, _rotateEnd ).normalize(),
				quaternion = new THREE.Quaternion();

			angle *= _this.rotateSpeed;

			quaternion.setFromAxisAngle( axis, -angle );

			_eye.applyQuaternion( quaternion );
			_this.object.up.applyQuaternion( quaternion );

			_rotateEnd.applyQuaternion( quaternion );

			if ( _this.staticMoving ) {

				_rotateStart.copy( _rotateEnd );

			} else {

				quaternion.setFromAxisAngle( axis, angle * ( _this.dynamicDampingFactor - 1.0 ) );
				_rotateStart.applyQuaternion( quaternion );

			}

		}

	};

	this.zoomCamera = function () {

		if ( _state === STATE.TOUCH_ZOOM ) {

			var factor = _touchZoomDistanceStart / _touchZoomDistanceEnd;
			_touchZoomDistanceStart = _touchZoomDistanceEnd;
			_eye.multiplyScalar( factor );

		} else {

			var factor = 1.0 + ( _zoomEnd.y - _zoomStart.y ) * _this.zoomSpeed;

			if ( factor !== 1.0 && factor > 0.0 ) {

				_eye.multiplyScalar( factor );

				if ( _this.staticMoving ) {

					_zoomStart.copy( _zoomEnd );

				} else {

					_zoomStart.y += ( _zoomEnd.y - _zoomStart.y ) * this.dynamicDampingFactor;

				}

			}

		}

	};

	this.panCamera = function () {

		var mouseChange = _panEnd.clone().sub( _panStart );

		if ( mouseChange.lengthSq() ) {

			mouseChange.multiplyScalar( _eye.length() * _this.panSpeed );

			var pan = _eye.clone().cross( _this.object.up ).setLength( mouseChange.x );
			pan.add( _this.object.up.clone().setLength( mouseChange.y ) );

			_this.object.position.add( pan );
			THREE.TrackballControls.target.add( pan );

			if ( _this.staticMoving ) {

				_panStart = _panEnd;

			} else {

				_panStart.add( mouseChange.subVectors( _panEnd, _panStart ).multiplyScalar( _this.dynamicDampingFactor ) );

			}

		}

	};

	this.checkDistances = function () {

		if ( !_this.noZoom || !_this.noPan ) {

			if ( _eye.lengthSq() > _this.maxDistance * _this.maxDistance ) {

				_this.object.position.addVectors( THREE.TrackballControls.target, _eye.setLength( _this.maxDistance ) );

			}

			if ( _eye.lengthSq() < _this.minDistance * _this.minDistance ) {

				_this.object.position.addVectors( THREE.TrackballControls.target, _eye.setLength( _this.minDistance ) );

			}

		}

	};

	this.update = function () {

		_eye.subVectors( _this.object.position, THREE.TrackballControls.target );

		if ( !_this.noRotate ) {

			_this.rotateCamera();

		}

		if ( !_this.noZoom ) {

			_this.zoomCamera();

		}

		if ( !_this.noPan ) {

			_this.panCamera();

		}

		_this.object.position.addVectors( THREE.TrackballControls.target, _eye );

		_this.checkDistances();

		_this.object.lookAt( THREE.TrackballControls.target );

		if ( lastPosition.distanceToSquared( _this.object.position ) > 0 ) {

			_this.dispatchEvent( changeEvent );

			lastPosition.copy( _this.object.position );

		}

	};

	this.reset = function () {

		_state = STATE.NONE;
		_prevState = STATE.NONE;

		THREE.TrackballControls.target.copy( _this.target0 );
		_this.object.position.copy( _this.position0 );
		_this.object.up.copy( _this.up0 );

		_eye.subVectors( _this.object.position, THREE.TrackballControls.target );

		_this.object.lookAt( THREE.TrackballControls.target );

		_this.dispatchEvent( changeEvent );

		lastPosition.copy( _this.object.position );

	};

	// listeners

	function keydown( event ) {

		if ( _this.enabled === false ) return;

		window.removeEventListener( 'keydown', keydown );

		_prevState = _state;

		if ( _state !== STATE.NONE ) {

			return;

		} else if ( event.keyCode === _this.keys[ STATE.ROTATE ] && !_this.noRotate ) {

			_state = STATE.ROTATE;

		} else if ( event.keyCode === _this.keys[ STATE.ZOOM ] && !_this.noZoom ) {

			_state = STATE.ZOOM;

		} else if ( event.keyCode === _this.keys[ STATE.PAN ] && !_this.noPan ) {

			_state = STATE.PAN;

		}

	}

	function keyup( event ) {

		if ( _this.enabled === false ) return;

		_state = _prevState;

		window.addEventListener( 'keydown', keydown, false );

	}
    var getElementPosition = function(element) {
        var top =0;
        var left = 0;
        do {
            top  += element.offsetTop  || 0;
            left += element.offsetLeft || 0;
            element =  element.offsetParent;
        }
        while (element);
        return {top: top, left: left};
    }
	function mousedown( event ) {

		if ( _this.enabled === false ) return;

		var mouseX = event.clientX;
		var mouseY = event.clientY;
//        var mouseX = event.clientX - getElementPosition(_this.domElement).left;
//        var mouseY = event.clientY - getElementPosition(_this.domElement).top;

//		var frame = document.getElementsByClassName("canvas_cls")[0];
        var frame = _this.domElement;
		var frame_rect = frame.getBoundingClientRect();

//		console.log(mouseX + '|' + mouseY + '|' + frame_rect.left + '|' + frame_rect.right + '|' + frame_rect.top + '|' + frame_rect.bottom);
//        clientX+=document.body.scrollLeft+ document.documentElement.scrollLeft-Math.floor(_this.screen.left);
//        clientY+=document.body.scrollTop+ document.documentElement.scrollTop-Math.floor(_this.screen.top);
//		if ((_state === STATE.NONE) && ((mouseX+document.body.scrollLeft+ document.documentElement.scrollLeft < frame_rect.left)
//            || (mouseX+document.body.scrollLeft+ document.documentElement.scrollLeft > frame_rect.right)
//            || (mouseY+document.body.scrollTop+ document.documentElement.scrollTop < frame_rect.top)
//            || (mouseY+document.body.scrollTop+ document.documentElement.scrollTop > frame_rect.bottom)))
//			return;

		event.preventDefault();
		event.stopPropagation();

		if ( _state === STATE.NONE ) {

			_state = event.button;

		}

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateStart = _this.getMouseProjectionOnBall( event.clientX, event.clientY );
			_rotateEnd.copy(_rotateStart)

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomStart = _this.getMouseOnScreen( event.clientX, event.clientY );
			_zoomEnd.copy(_zoomStart);

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panStart = _this.getMouseOnScreen( event.clientX, event.clientY );
			_panEnd.copy(_panStart)

		}

		_this.domElement.addEventListener( 'mousemove', mousemove, false );
        _this.domElement.addEventListener( 'mouseup', mouseup, false );

	}

	function mousemove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();
//        var frame = _this.domElement;
//        var frame_rect = frame.getBoundingClientRect();
//        var mouseX = event.clientX;
//        var mouseY = event.clientY;
//        if ((_state === STATE.NONE) && ((mouseX+document.body.scrollLeft+ document.documentElement.scrollLeft < frame_rect.left)
//            || (mouseX+document.body.scrollLeft+ document.documentElement.scrollLeft > frame_rect.right)
//            || (mouseY+document.body.scrollTop+ document.documentElement.scrollTop < frame_rect.top)
//            || (mouseY+document.body.scrollTop+ document.documentElement.scrollTop > frame_rect.bottom)))
//            return;

		if ( _state === STATE.ROTATE && !_this.noRotate ) {

			_rotateEnd = _this.getMouseProjectionOnBall( event.clientX, event.clientY );

		} else if ( _state === STATE.ZOOM && !_this.noZoom ) {

			_zoomEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

		} else if ( _state === STATE.PAN && !_this.noPan ) {

			_panEnd = _this.getMouseOnScreen( event.clientX, event.clientY );

		}

	}

	function mouseup( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		_state = STATE.NONE;

        _this.domElement.removeEventListener( 'mousemove', mousemove );
        _this.domElement.removeEventListener( 'mouseup', mouseup );

	}

	function mousewheel( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail / 3;

		}

		_zoomStart.y += delta * 0.01;

	}

	function touchstart( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_state = STATE.TOUCH_ROTATE;
				_rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			case 2:
				_state = STATE.TOUCH_ZOOM;
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = _touchZoomDistanceStart = Math.sqrt( dx * dx + dy * dy );
				break;

			case 3:
				_state = STATE.TOUCH_PAN;
				_panStart = _panEnd = _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchmove( event ) {

		if ( _this.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		switch ( event.touches.length ) {

			case 1:
				_rotateEnd = _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			case 2:
				var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
				var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
				_touchZoomDistanceEnd = Math.sqrt( dx * dx + dy * dy )
				break;

			case 3:
				_panEnd = _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			default:
				_state = STATE.NONE;

		}

	}

	function touchend( event ) {

		if ( _this.enabled === false ) return;

		switch ( event.touches.length ) {

			case 1:
				_rotateStart = _rotateEnd = _this.getMouseProjectionOnBall( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

			case 2:
				_touchZoomDistanceStart = _touchZoomDistanceEnd = 0;
				break;

			case 3:
				_panStart = _panEnd = _this.getMouseOnScreen( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
				break;

		}

		_state = STATE.NONE;

	}

	_this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	_this.domElement.addEventListener( 'mousedown', mousedown, false );

	_this.domElement.addEventListener( 'mousewheel', mousewheel, false );
	_this.domElement.addEventListener( 'DOMMouseScroll', mousewheel, false ); // firefox

	_this.domElement.addEventListener( 'touchstart', touchstart, false );
	_this.domElement.addEventListener( 'touchend', touchend, false );
	_this.domElement.addEventListener( 'touchmove', touchmove, false );

//	window.addEventListener( 'keydown', keydown, false );
//	window.addEventListener( 'keyup', keyup, false );

	this.handleResize();

};

THREE.TrackballControls.prototype = Object.create( THREE.EventDispatcher.prototype );
