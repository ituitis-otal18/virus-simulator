const WIDTH = 1280;
const HEIGHT = 640;

class Bird {
  constructor() {
    this.X = 200;
    this.Y = 100;
    this.R = 40;
    this.Gravity = 0.4;
    this.Speed = 0;
    this.Score = 0;
  }

  move(autoPilot) {
    if (keyIsPressed === true || autoPilot === 1) {
      this.Speed = -6;
    }
    this.Speed += this.Gravity;
    this.Y += this.Speed;
  }

  show() {
    fill("white");
    circle(this.X, this.Y, this.R);
  }

  printScore(pipe) {
    if(this.X === pipe.X + pipe.W) this.Score += 1;
    textSize(32);
    fill("green");
    text('Score :', 10, 30);
    text(this.Score, 150, 30);
  }

  detectCollision(pipe){
    if(pipe.X <= this.X && this.X <= pipe.X + pipe.W){
      if((pipe.Y1 <= this.Y && this.Y <= pipe.Y1 + pipe.H1) || (pipe.Y2 <= this.Y && this.Y <= pipe.Y2 + pipe.H2)){
        //Check collision with the nearest pipe.
        alert("Score : " + this.Score);
        window.location.reload();
        return;
      }
    }
    //Check collision with the screen borders.
    if(this.Y >= HEIGHT - 1) {
      this.Y = HEIGHT - 1;
      this.Speed = 0;
    }
    else if(this.Y <= 1) {
      this.Y = 1;
      this.Speed = 0;
    }
  }

  think(pipe){
    if(pilot === true) {
      let targetY = pipe.Y2 - (pipe.Space / 2);
      stroke('red');
      strokeWeight(3);
      line(this.X, this.Y, pipe.X + pipe.W, targetY);
      if(this.Y > targetY - 3) return 1;
      else return 0;
    }
    else return 0;
  }
}

class Pipe {
  constructor(i) {
    this.X = WIDTH;
    this.Y1 = 0;
    this.H1 = 50 + (Math.random()*390);
    this.W = 100;
    this.Space = 150;
    this.Velocity = 5;

    this.Y2 = this.Y1 + this.H1 + this.Space;
    this.H2 = HEIGHT - (this.H1 + this.Space);
  }

  move(pipes) {
    if(this.X + this.Space < 0) pipes.splice(0, 1);
    else if(this.X === WIDTH/2) pipes.push(new Pipe());
    this.X -= this.Velocity;
  }

  show() {
    fill("black");
    rect(this.X, this.Y1, this.W, this.H1);
    rect(this.X, this.Y2, this.W, this.H2);
  }
}

let bird = new Bird();
let pipes = [];
let pilot = true;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  pipes[0] = new Pipe();
  button = createButton('Auto Pilot: On/OFF');
  button.position(1300, 200);
  button.size(150, 100);
  button.mousePressed(autoPilot);
}

function draw() {
  clear();
  background("lightblue");
  stroke('black');
  strokeWeight(5);
  for (var i = 0; i < pipes.length; i++) {
    pipes[i].move(pipes);
    pipes[i].show();
  }
  bird.move(bird.think(pipes[0]));
  bird.show();
  bird.detectCollision(pipes[0]);
  bird.printScore(pipes[0]);
}

function autoPilot() {
  if(pilot === true) pilot = false;
  else pilot = true;
}