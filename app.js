const WIDTH = 1280;
const HEIGHT = 640;
const HALFW = 640;
const HALFH = 320;

const TotalVirus = 100;

let leftBuffer;
let rightBuffer;
let test1;
let test2;

class Person{
  constructor(x, y, state){
    this.state = state;   // 0 -> Clean , 1 -> Infected
    this.x = x;
    this.y = y;
    this.r = 10;
    this.velocityX = Math.floor(Math.random()*2)-1;
    this.velocityY = Math.floor(Math.random()*2)-1;
  }
  update(){
    this.x += this.velocityX;
    if(HALFW <= this.x-this.r) this.x -= HALFW-this.r;
    else if(this.x+this.r <= 0) this.x += HALFW+this.r*2;

    this.y += this.velocityY;
    if(HEIGHT <= this.y-this.r) this.y -= HEIGHT-this.r;
    else if(this.y+this.r <= 0) this.y += HEIGHT+this.r*2;
  }
  detectCollision(target){
    let distance = Math.pow(this.x - target.x, 2) + Math.pow(this.y - target.y, 2);
    let range = this.r*this.r + target.r*target.r;

    if(distance <= range){
      distance = Math.sqrt(distance);

      let Overlap = 0.2 * (distance - this.r - target.r);
      
      this.x -= Overlap * (this.x - target.x) / distance;
      this.y -= Overlap * (this.y - target.y) / distance;

      target.x += Overlap * (this.x - target.x) / distance;
      target.y += Overlap * (this.y - target.y) / distance;

      return true;
    } 
    else return false;
  }
  draw(side){
    side.circle(this.x, this.y, this.r);
  }
}
class Test {
  constructor(C, I){
    this.cleans = [];
    this.infecteds= [];
    for (var i = 0; i < C; i++){
      this.cleans.push(new Person(Math.floor(Math.random()*HALFW), Math.floor(Math.random()*HEIGHT), 0));
    }
    for (var i = 0; i < I; i++){
      this.infecteds.push(new Person(Math.floor(Math.random()*HALFW), Math.floor(Math.random()*HEIGHT), 1));
    }
  }
  update(){
    let people = this.cleans.concat(this.infecteds);
    for (var i = 0; i < TotalVirus-1; i++){
      for (var j = i+1; j < TotalVirus; j++){
        //check detection
        if(people[i].detectCollision(people[j])){
          if(people[i].state == 1 || people[j].state == 1){
            people[i].state = 1;
            people[j].state = 1;
          }
          this.checkCleans();
        }
      }
    }

    for(var i = 0; i < this.cleans.length; i++) this.cleans[i].update();
    for(var i = 0; i < this.infecteds.length; i++) this.infecteds[i].update();
  }
  checkCleans(){
    for(var i = 0; i < this.cleans.length; i++){
      if(this.cleans[i].state == 1){
        this.infecteds.push(new Person(this.cleans[i].x, this.cleans[i].y, 1));
        this.cleans.splice(i, 1);
      }
    }
  }
  draw(side){
    side.stroke("lightgreen");
    side.fill("green");
    for (var i = 0; i < this.cleans.length; i++) this.cleans[i].draw(side);

    side.stroke("red");
    side.fill("darkred");
    for (var i = 0; i < this.infecteds.length; i++) this.infecteds[i].draw(side);
  }
}


function createNewTest(){
  test1 = new Test(TotalVirus - input1.value(), input1.value());
  test2 = new Test(TotalVirus - input2.value(), input2.value());
}

function setup() {
  var cnv = createCanvas(WIDTH, HEIGHT);
  cnv.background("lightblue");
  cnv.center("horizontal");
  leftBuffer = createGraphics(HALFW, HEIGHT);
  rightBuffer = createGraphics(HALFW, HEIGHT);

  button = createButton('SET VIRUS');
  button.position((window.innerWidth)/2 - (button.width)/2, (window.innerHeight)/2 + HALFH);
  button.mousePressed(createNewTest);

  input1 = createSlider(5, 95, 5);
  input1.position(button.x - input1.width - 100, button.y);
  input2 = createSlider(5, 95, 35);
  input2.position(button.x + button.width + 100, button.y);

  test1 = new Test(TotalVirus - input1.value(), input1.value());
  test2 = new Test(TotalVirus - input2.value(), input2.value());
}

function draw() {
  drawLeftBuffer();
  drawRightBuffer();
  drawStats()
}

function drawLeftBuffer() {
  leftBuffer.background(85);
  test1.update();
  test1.draw(leftBuffer);
  image(leftBuffer, 0, 0);
}

function drawRightBuffer() {
  rightBuffer.background(85);
  test2.update();
  test2.draw(rightBuffer);
  image(rightBuffer, HALFW, 0);
}

function drawStats() { 
  textSize(32);
  fill("white");
  noStroke();

  text('Clean :', 10, 30);
  text(test1.cleans.length, 120, 30);
  text('Infected :', 450, 30);
  text(test1.infecteds.length, 585, 30);

  text('Clean :', HALFW+10, 30);
  text(test2.cleans.length, HALFW+120, 30);
  text('Infected :', HALFW+450, 30);
  text(test2.infecteds.length, HALFW+585, 30);

  stroke(6, 98, 184);
  strokeWeight(2);
  line(HALFW, 0, HALFW, HEIGHT);
}