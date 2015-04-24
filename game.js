;(function () {
	var Game = function(_canvasId) {
		var canvas = document.getElementById(_canvasId);
		var screen = canvas.getContext('2d');
		var gameSize = {
			x: canvas.width,
			y: canvas.height
		};
		
		this.bodies = createInvaders(this).concat([new player(this, gameSize)]);
		
		var self = this;
		var tick = function() {
			if (self.bodies.length == 1) {
				self.bodies = createInvaders(self).concat([new player(self, gameSize)]);
			}
			self.update(gameSize);
			self.draw(screen, gameSize);
			requestAnimationFrame(tick);
		}
		
		tick();
	}
	
	Game.prototype = {
		update: function(_gameSize) {
			var bodies = this.bodies;
			
			var notCollidingWithAnything = function(_b1) {
				return bodies.filter(function(_b2) {
					return colliding(_b1, _b2) || colliding(_b2, _b1);
				}).length == 0;
			}
			
			this.bodies = this.bodies.filter(notCollidingWithAnything);
			
			for (var i = 0; i< this.bodies.length; i++) {
				if (this.bodies[i].position.y < 0) {
					this.bodies.splice(i, 1);
				}
			}
			for (var i = 0; i< this.bodies.length; i++) {
				this.bodies[i].update();
			}
		},
		
		draw: function(_screen, _gameSize) {
			clearCanvas(_screen, _gameSize);
			for (var i = 0; i< this.bodies.length; i++) {
				drawRect(_screen, this.bodies[i]);
			}	
		},
		addBody: function(_body) {
			this.bodies.push(_body);
		}
	};
	
	var Invader = function(_game, _position) {
		this.Game = _game;
		this.size = {width:16, height:16};
		this.position = _position;
		this.patrolX = 0;
		this.speedX = 0.3;
	}
	
	Invader.prototype = {
		update: function() {
			if (this.patrolX < 0 || this.patrolX > 500) {
				this.speedX = -this.speedX;
			}
			
			this.position.x += this.speedX;
			this.patrolX += this.speedX;
		}
	}
	
	var player = function(_game, _gameSize) {
		this.Game = _game;
		this.bullets = 0;
		this.timer = 0;
		this.size = {width:16, height:16};
		this.position = {x: _gameSize.x/2-this.size.width/2, y: _gameSize.y/2-this.size.height/2};
		this.keyboarder = new keyboarder();
		
	}
	
	var bullet = function(_position, _velocity) {
		this.size = {width:3, height:3};
		this.position = _position;
		this.velocity = _velocity;
		
	}
	
	bullet.prototype =  {
		update: function() {
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
		}
	}
	
	player.prototype =  {
		update: function() {
			if (this.keyboarder.isDown(this.keyboarder.KEYS.LEFT)) {
				this.position.x -= 2;
			}
			if (this.keyboarder.isDown(this.keyboarder.KEYS.RIGHT)) {
				this.position.x += 2;
			}
			if (this.keyboarder.isDown(this.keyboarder.KEYS.SPACE)) {
				if (this.bullets < 1) {
					var bullet1 = new bullet({x:this.position.x+this.size.width/2 - 3/2, y:this.position.y - 4},{x:0, y:-6});
					this.Game.addBody(bullet1);
					this.bullets++;
				}
			}
			this.timer++;
			if (this.timer % 12  == 0) {
				this.bullets = 0;
			}
		}
	}
	
	
	
	var keyboarder = function() {
		var keyState = {};
		
		window.onkeydown = function(_e) {
			keyState[_e.keyCode] = true;
		}
		window.onkeyup = function(_e) {
			keyState[_e.keyCode] = false;
		}
		
		this.isDown = function(_keyCode) {
			return keyState[_keyCode] === true;
		}
		
		this.KEYS = {LEFT: 37, RIGHT: 39, SPACE: 32};
	}
	
	var drawRect = function(_screen, _body) {
		_screen.fillRect(_body.position.x, _body.position.y, _body.size.width, _body.size.height);
	}
	
	var createInvaders = function(_game) {
		var invaders = [];
		
		for (var i = 0; i < 24; i++) {
			var x = 30 + (i%8) * 30;
			var y = 30 + (i%3) * 30;
			invaders.push(new Invader(_game, {x:x, y:y}));
		}
		return invaders;
	}
	
	var colliding = function(_b1, _b2) {
		return !(_b1 == _b2 ||
			_b1.position.x + _b1.size.width + _b1.size.width / 4 < _b2.position.x - _b2.size.width / 4 ||
			_b1.position.y + _b1.size.height + _b1.size.height / 4 < _b2.position.y - _b2.size.height / 4 ||
			_b1.position.x - _b1.size.width / 4 > _b2.position.x + _b2.size.width / 4 ||
			_b1.position.y - _b1.size.height / 4 > _b2.position.y - _b2.size.height / 4 
			);
		
	}
	
	var clearCanvas = function(_screen, _gameSize) {
		_screen.clearRect(0,0,_gameSize.x, _gameSize.y);
	}
	
	window.onload = function() {
		new Game("screen");
	}
})();
