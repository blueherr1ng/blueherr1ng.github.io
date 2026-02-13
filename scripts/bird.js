/* understanding of geometry comes from this reference:
   https://p5js.org/examples/3d-custom-geometry
   additional inspiration from this reference:
   https://p5js.org/examples/3d-custom-geometry  */

let hat;
let tailExist;
let browsExist;
let extraExist;
let r;
let mc;
let bc;
let wc;
let size;
let len;
let scalRand;
let xrand;
let yrand;
let zrand;

//begin vibecoded
let targetRotX = 0;
let targetRotY = 0;
let currentRotX = 0;
let currentRotY = 0;
let currentRotZ = 0;
let targetRotZ = 0;
//end vibecoded

function drawHat() {
	if (hat) {
		freeGeometry(hat);
	}
	hat = buildGeometry(() => {
		scale(random(0.8, 1.2));
		push();
		fill("black");
		cylinder(80, 10);
		push();
		translate(0, -10);
		fill("red");
		cylinder(50, 10);
		push();
		fill("black");
		translate(0, -30);
		cylinder(50, 50);
		pop();
	});
}

const bodycolor = [
	"rgb(201, 255, 244)",
	"rgb(214, 241, 255)",
	"rgb(255, 215, 220)",
	"rgb(248, 230, 255)",
	"lightyellow",
	"white"
];
const beakcolor = [
	"grey",
	"orange",
	//"black",
	"rgb(255, 198, 66)",
	"rgb(227, 117, 0)",
	"rgb(227, 79, 16)"
]
const wingcolor = [
	"skyblue",
	"hotpink",
	"yellow",
	"grey",

]

let bird;
function drawBird() {
	if (bird) {
  	freeGeometry(bird);
	}  
	tailExist = random([0, 1]);
	browsExist = random([0, 1]);
	extraExist = random([0, 1, 2]);
	mc = random(bodycolor);
	bc = random(beakcolor);
	wc = random(wingcolor);
	size = random(0, 8);
	len = random(-5, 15);
	scalRand = random(-0.11, 0.11);
	xrand = random(-0.3, 0.3);
	yrand = random(-0.3, 0.3);
	zrand = random(-0.3, 0.3);

	bird = buildGeometry(() => {
		//head AND body
		push();
		// let xrand = random([0.9,1.1]);
		// let yrand = random([0.9,1.1]);
		// let zrand = random([0.9,1.1]);
		// scale(xrand,yrand,zrand);
		fill(mc)
		//fill("white")
		sphere(100);
		r = 100;
		push();

		pop();
		// eyes, wings,legs
		push();
		for (let side of [1, -1]) {
			//eyes
			push();
			translate(-60, -40, side * 50 + (size * side));
			if (tailExist == 0 && browsExist == 1) {
				scale(xrand + 1, yrand + 1, zrand + 1);
				fill("black");
				sphere(15);
			} else {
				fill("black");
				sphere(15);
			}
			pop();

			//BLUSH!!!!!!
			push();
			fill("pink");
			translate(-60, -10, side * 60);
			scale(1.2, 0.8, 1)
			sphere(20); //placeholder
			pop();

			//legs
			push();
			fill(bc)
			translate(-10, 90, -40 * side);
			rotateX(PI * -0.1 * side);
			rotateZ(PI * 0.1);
			cylinder(5, 50 + (len * 2));
			pop();

			//wings
			push();
			rotateY(PI * 0.05);
			rotateZ(PI * 0.05);
			scale(1.2 - scalRand, 0.8 + scalRand, 1);
			translate(10, 0, side * 65);
			fill(wc)
			sphere(50);
			pop();

			// if (browsExist == 0) {
			// 	push();
			// 	translate(-55, -70, side * 50 + (size * side));
			// 	rotateZ(random(PI * 0.2, PI * -0.2));
			// 	//rotateY(anglerand);
			// 	fill("black");
			// 	scale(1.2, 0.3, 1);
			// 	cylinder(10, 4);
			// 	pop();
			// }
		}
		pop();
		// beak
		push();
		fill(bc);
		translate(-75, -40, 0)
		rotateZ(PI);
		cone(35+(len * random(1, 3)), 20+ (len * random(1, 1.4)), 5);
		pop();

		//tail
		if (tailExist == 0) {
			push();
			translate(60, 70, 0)
			rotateZ(PI * 0.2)
			//scale(1 + random(-0.6, 0.6), 1 - random(0.2, 0.6), 1)
			cylinder(40 + len, 8);
			pop();
		}

		pop();
		if (extraExist == 1) {
			push();
			translate(0, -r+8, 0);
			scale(random(0.65, 1.4));
			model(hat);
			pop();
		}
	});
}

function setup() {
	background(90, 180, 230);
	let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
  
  // Attach canvas to the bird container
  cnv.parent('bird-container');

  // Make the canvas fill the container and sit behind UI
  cnv.style('position', 'absolute');
  cnv.style('top', '0');
  cnv.style('left', '0');
  cnv.style('z-index', '0');
	//debugMode();
	drawHat();
  rotateX(PI/2);
	drawBird();
}

function draw() {
	background(90, 180, 230);

	noStroke();
  push();
  rotateY(PI / 2);
  translate(0,50,0);
  //begin vibecoded section
  push();
  let maxTilt = PI / 4;  // how much it can lean
  targetRotY= map(mouseX, 0, width, -maxTilt, maxTilt);  // left/right lean
  targetRotX = map(mouseY, 0, height, -maxTilt, maxTilt); // up/down tilt
  currentRotX = lerp(currentRotX, targetRotX, 0.4);
  currentRotY = lerp(currentRotY, targetRotY, 0.4);
  rotateZ(-currentRotX);  // lean left/right
  rotateY(currentRotY);  // tilt up/down  
  //end vibecoded section
	model(bird);

  pop();
  pop();
}

//begin vibecoded
function keyPressed() {
  if (key === ' ') {
    drawBird();
  }
}
//end vibecoded
