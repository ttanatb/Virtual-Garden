$(document).ready(function() {
	//help with debugging
	"use strict";
	
	//variables
	var canvas = document.querySelector("canvas"),
		context = canvas.getContext("2d"),
		width = canvas.width = window.innerWidth,
		height,
		grass = [],
		dog = [],
		fireflies = [],
		light,
		mousePosX = 0,
		mousePosY = 0,
		j = 3;
		
	//force maximum (and optimal) size
	if (width > 1080) 
		canvas.width = width = 1080;
	
	//force ratio
	height = canvas.height = window.innerHeight * 3 /4;
	
	//firefly object
	var Firefly = function() {
		
		//variables
		var x = Math.random() * width,
			y = Math.random() * (height - 150),
			vx = 0,
			vy = 0,
			maxVx = 5,
			maxVy = 5,
			r = Math.random() * 5 + 2,
			baseR = r,
			dist = 9999,
			threshold = 300000000,
			angle,
			initSpeed = Math.random() * 0.4 + 0.2;
			
			//set initSpeed as negative 50% of the time
			if (Math.random() < 0.5) initSpeed = - initSpeed;
			
		//update func
		this.update = function() {
			//reset initial speeds
			vx = initSpeed;
			vy = noise.perlin2(j/50, r) * 3;
			
			//check with mouse
			this.checkDist();
			this.checkBounds();
			
			//update var
			r = baseR + noise.perlin2(j/50, 0) * 3;
			x += vx;
			y += vy;
			this.draw();
		}
		
		//checks distance and adds to vy and vx
		this.checkDist = function() {
			//math
			dist = Math.pow(Math.pow(mousePosX-x,2) + Math.pow(mousePosY-y,2), 2);
			if (dist < threshold) {
				angle = Math.atan2(y-mousePosY, x-mousePosX);
				vy += Math.sin(angle);
				vx += Math.cos(angle);
			}
		}
		
		//checks if too high, too low, or at edge of screen
		this.checkBounds = function() {
			if (y < 0)
				vy += 2;
			else if (y > height - 150)
				vy -= 2;
			
			if (x + baseR + 1 < 0)
				x = width + baseR;
			else if (x - baseR + 1 > width)
				x = - baseR;
		}
		
		//draws
		this.draw = function() {
			context.beginPath();
			context.arc(x,y, r, 0, 2 * Math.PI);
			context.closePath();
			context.fill();
		}
	}
	
	//the circle around the mouse
	var Light = function() {
		//variables
		var x = 0,
			y = 0;

		//update
		this.update = function() {
			this.draw();
		}
		
		//draw
		this.draw = function() {
			context.beginPath();
			context.arc(mousePosX, mousePosY, 5, 0, 2 * Math.PI);
			context.closePath();
			context.fill();
		}
	}
		
	//the grass at the bottom
	var Grass = function(x1, x2, index) {
		//properties
		this.x1 = x1;
		this.x2 = x2;
		this.index = index;
		
		//variables
		var botY = height,
			x = x1 + (Math.random() * (x2 - x1) * 0.6 + (x2 - x1) * 0.2),
			y = botY - (Math.random() * 90 + 70),
			offsetX1 = x1 - x,
			offsetY1 = (y - botY) * 0.8,
			offsetX2 = x - x2,
			offsetY2 = (y - botY) * 0.5,
			buffer = Math.random() * 20 + 40,
			xBuff;
			//used for unimplemented dying method
			// gradient,
			// blackPoint = 0,
			// whitePoint = 0,
			// dying = false;
		
		//sets variables to help shape look grassy
		if (offsetX1 < offsetX2) xBuff = -offsetX1 * 1.8;
		else xBuff = -offsetX2 * 1.8;
		
		this.update = function() {				
			this.draw();
		}
		
		this.draw = function() {
			// used for unimplemented dying method
			// if (dying) {
				// blackPoint += 0.001;
				// if (blackPoint > 1) grass[index] = null;
			
				// whitePoint += 0.0015;
				// if (whitePoint > 1) whitePoint = 1;
			// }
			
			// gradient = context.createLinearGradient(x,y,x,botY);
			// gradient.addColorStop(blackPoint,"black");
			// gradient.addColorStop(whitePoint,"white");
			
			// if (gradient == undefined) context.fillStyle = "white";
			// else context.fillStyle = gradient;
			
			context.fillStyle = "white";
			context.beginPath();
			context.moveTo(x1, botY);
			context.quadraticCurveTo(x1 + offsetX1, botY + offsetY1, x + noise.perlin2(j/buffer, 0) * xBuff, y + noise.perlin2(j/buffer, 0) * 3);
			context.quadraticCurveTo(x2 + offsetX2, botY + offsetY2, x2, botY);
			context.closePath();
			context.fill();
		
			/*
			//used for drawing control vertices
			context.strokeStyle = "blue";
			context.beginPath();
			context.arc(x1 + offsetX1, botY + offsetY1,2,0,2*Math.PI);
			context.closePath();
			context.stroke();
			
			context.beginPath();
			context.arc(x2 + offsetX2, botY + offsetY2, 3,0,2*Math.PI);
			context.closePath();
			context.stroke();
			console.log(x1);
			*/
		}
	}
	
	//Dog that jumps up to mouse if too low
	var Dog = function() {
		
		//variables
		var r = Math.random() * 5 + 10,
			x = Math.random() * width,
			y = height - r,
			vy = 0,
			vx = 0,
			maxVx = (15 - r) * 0.3 + 3,
			maxVy = (15 - r) * 0.8 + 18,
			onGround = true;
		
		//update
		this.update = function() {
			
			//checks if can jump
			this.jump();
			vy += 1; // gravity
			
			//air drag
			if (vx > 0) vx -= 0.07;
			else if (vx < 0) vx += 0.07;
		
			//cap velocity
			if (vx > maxVx) vx = maxVx;
			else if (vx < -maxVx) vx = -maxVx;
			if (vy > maxVy) vy = maxVy;
			else if (vy < -maxVy) vy = -maxVy;
			
			//update pos
			x += vx;
			y += vy;
			
			//check ground and bounds
			this.checkGround();
			this.bounce();
			this.draw();	//draw
		}
		
		//check if on ground and near mouse, jumps
		this.jump = function() {
			if (onGround && mousePosY > 450 && Math.abs(x - mousePosX) < 100) {
				onGround = false;
				vy += -maxVy;
				vx += (mousePosX - x) * Math.random() / 10;
			}
		}
		
		//check if on ground
		this.checkGround = function() {
			if (y + r > canvas.height)
			{
				vx = 0;
				y = canvas.height - r;
				vy = 0;
				onGround = true;
			}
		}
		
		//checks if at edge of screen
		this.bounce = function() {
			if (x + r > width) {
				vx = - vx;
				x = width - r;
			} else if (x < + r) {
				vx = -vx;
				x = r;
			}
		}
		
		//draws the ball
		this.draw = function() {
			context.fillStyle = "white";
			context.beginPath();
			var scale = Math.abs(vy) * 0.8;
			
			//stretches and sqeezes based on velocity
			context.moveTo(x, y - r - scale);
			context.bezierCurveTo(x + r/2, y - r - scale, x + r, y - r/2, x + r, y);
			context.bezierCurveTo(x + r, y + r/2, x + r/2, y + r + scale, x, y + r + scale);
			context.bezierCurveTo(x - r/2, y + r + scale, x - r, y + r/2, x - r, y);
			context.bezierCurveTo(x - r, y - r/2, x - r/2, y - r - scale, x, y - r - scale);
			
			context.closePath();
			context.fill();
		}
	}
	
	//gets position of mouse
	function getMousePos(canvas, e) {
		mousePosX = e.clientX - canvas.getBoundingClientRect().left;
		mousePosY = e.clientY - canvas.getBoundingClientRect().top;
	}
	
	//main loop
	function main() {
		//fill background
		context.fillStyle = "black";
		context.fillRect(0,0,width,height);

		//updates all objects
		for(var i = 0; i < 270; i++) if (grass[i] != null) grass[i].update();
		for(var i = 0; i < 5; i++) dog[i].update();
		for(var i = 0; i < 30; i++) fireflies[i].update();
		light.update();

		//used for perlin noise
		j++;	

		//update next frame
		window.requestAnimationFrame(main);
	}
	
	//init function
	function init() {
		//create objects
		for(var i = 0; i < 270;  i++) grass.push(new Grass(i * 4, (i*4)+7, i));
		for(var i = 0; i < 5; i++) dog.push(new Dog());
		for(var i = 0; i < 30; i++) fireflies.push(new Firefly());
		light = new Light();
		
		//add event listener for mouse
		canvas.addEventListener('mousemove', function(e) {
			getMousePos(canvas, e);
		}, false);
		main();
	}
	
	init();
});