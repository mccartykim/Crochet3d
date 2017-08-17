var st, st2;
var network;
//TODOs:
//Add a generalized function to add and connect new stitches.  rough idea for function:
//StringManager.prototype.add(pvector_pos, arr_neighbors)
//Simple interface with buttons: Add row, Add Stitch, Join. Row: attatch to just last stitch.  Add Stitch: Attatch to stitch "above," and last stitch. Join: Add first stitch of row to neighbors
//To find row above: I guess take the integer of this row - width.
function setup(){
	network = new StitchManager(10, 10, 10);
	st = new Stitch(20, 20, 10);
	st2 = new Stitch(20, 10, 20);
	network.root.neighbors.push(st);
	network.root.neighbors.push(st2);
	st.neighbors.push(network.root);
	st.neighbors.push(st2);
	st2.neighbors.push(st);
	st2.neighbors.push(network.root);
	network.stitches.push(st);
	network.stitches.push(st2);
	createCanvas(710, 400, WEBGL);
}
function draw(){
	background(255);
	network.update();
	network.display();
}

function Stitch(x, y, z){
	this.position = createVector(x, y, z);
	this.velocity = createVector(0, 0, 0);
	this.acceleration = createVector(0, 0, 0);
	//Adjacency list
	this.neighbors = [];
	this.fixed = false;
}

Stitch.prototype.join = function(st){
	this.neighbors.push(st);
};

Stitch.prototype.applyForce = function(force){
	var f = p5.Vector.div(force, this.mass);
	this.acceleration.add(f);
};


Stitch.prototype.update = function(){
	if (this.fixed){
		//pass
	}
	else{
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity);
		this.acceleration.mult(0);
	}
};

Stitch.prototype.display = function(){
	push();
	translate(this.position.x, this.position.y, this.position.z);
	sphere(10, 10, 10);
	pop();
};

function StitchManager(x, y, z){
	this.stitches = [];
	this.root = new Stitch(x, y, z);
	this.root.fixed = true;
	this.stitches.push(this.root);
}

StitchManager.prototype.update = function(){
	this.repulse();
	this.attract();
	this.stitches.forEach(function(st){
		st.update();
	});
};

StitchManager.prototype.display = function(){
	this.stitches.forEach(function(st){
		st.display();
	});
};

StitchManager.prototype.repulse = function(){
	//initial not really looked at hooke's law idea:
	//repulsion is inverse square law'd, so it's strong up close, but not great when they're far apart.
	this.stitches.forEach(function(st){
		st.neighbors.forEach(function(st2){
			//get distance
			var dist = p5.Vector.sub(st2.position, st.position);
			var dir = dist.copy().normalize();
			var force = dir.div(-dist.magSq() * 10);
			//console.log("Force: " + force);
			st.acceleration.add(force);
			//console.log(st.acceleration);
		});
	});
};

StitchManager.prototype.attract = function(){
	//initial not really looked at hooke's law idea:
	//repulsion is inverse square law'd, so it's strong up close, but not great when they're far apart.
	this.stitches.forEach(function(st){
		st.neighbors.forEach(function(st2){
			//get distance
			var dist = p5.Vector.sub(st.position, st2.position);
			var dir = dist.copy().normalize();
			var force = dir.mult(-0.0001);
			console.log(force);
			st.acceleration.add(force);
		});
	});
};
