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

let bird2;

function drawBird2() {
	let b = random([0, 1]);
	let e = random([0, 1, 2]);
	let mc = random(bodycolor);
	let bc = random(beakcolor);
	let wc = random(wingcolor);
	let size = random(0, 8);
	let len = random(-5, 15);
	let scalRand = random(-0.11, 0.11);
	let xrand = random(-0.3, 0.3);
	let yrand = random(-0.3, 0.3);
	let zrand = random(-0.3, 0.3);

	bird2 = buildGeometry(() => {
		//head AND body
		let t = random([0, 1]);
		push();
		// let xrand = random([0.9,1.1]);
		// let yrand = random([0.9,1.1]);
		// let zrand = random([0.9,1.1]);
		// scale(xrand,yrand,zrand);
		fill(mc)
		//fill("white")
		scale(1 + xrand,
			1 + yrand,
			1 + zrand);
		sphere(100);
		r = 100 * (1 + yrand);
		push();

		pop();
		// eyes, wings,legs
		push();
		for (let side of [1, -1]) {
			//eyes
			push();
			translate(-60, -40, side * 50 + (size * side));
			if (t == 0 && b == 1) {
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

			if (b == 0) {
				push();
				translate(-55, -70, side * 50 + (size * side));
				rotateZ(random(PI * 0.2, PI * -0.2));
				//rotateY(anglerand);
				fill("black");
				scale(1.2, 0.3, 1);
				cylinder(10, 4);
				pop();
			}
		}
		pop();
		// beak
		push();
		fill(bc);
		translate(-70, -40, 0)
		rotateZ(PI);
		cone(35 + (len * random(1, 3)), 15 + len * random(1, 1.4), 5);
		pop();

		//tail
		if (t == 0) {
			push();
			translate(60, 70, 0)
			rotateZ(PI * 0.2)
			//scale(1 + random(-0.6, 0.6), 1 - random(0.2, 0.6), 1)
			cylinder(40 + len, 8);
			pop();
		}

		pop();
		if (e == 1) {
			translate(0, -r + 5, 0);
			scale(random(0.65, 1.4));
			model(hat);
		}
	});
}

let bird;

function drawBird() {
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
		let tailExist = random([0, 1]);
		push();
		// let xrand = random([0.9,1.1]);
		// let yrand = random([0.9,1.1]);
		// let zrand = random([0.9,1.1]);
		// scale(xrand,yrand,zrand);
		fill(mc)
		//fill("white")
		scale(1 + xrand,
			1 + yrand,
			1 + zrand);
		sphere(100);
		r = 100 * (1 + yrand);
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

			if (browsExist == 0) {
				push();
				translate(-55, -70, side * 50 + (size * side));
				rotateZ(random(PI * 0.2, PI * -0.2));
				//rotateY(anglerand);
				fill("black");
				scale(1.2, 0.3, 1);
				cylinder(10, 4);
				pop();
			}
		}
		pop();
		// beak
		push();
		fill(bc);
		translate(-70, -40, 0)
		rotateZ(PI);
		cone(35 + (len * random(1, 3)), 15 + len * random(1, 1.4), 5);
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
			translate(0, -r + 5, 0);
			scale(random(0.65, 1.4));
			model(hat);
			pop();
		}
		if (extraExist == 2) {
			push();
			translate(0, -r-23, 0);
			scale(random(0.2,0.4));
			model(bird2);
			pop();
		}
	});
}

function setup() {
	background(90, 180, 230);
	createCanvas(500, 500, WEBGL);
	//debugMode();
	drawHat();
	drawBird2();
	drawBird();
}

function draw() {
	background(90, 180, 230);
	noStroke();
	rotateX(PI * -0.05);
	rotateY(frameCount * 0.01);
	model(bird);
	//model(hat);

}

function mousePressed() {
	drawBird2();
	drawBird();
	//drawHat();
}