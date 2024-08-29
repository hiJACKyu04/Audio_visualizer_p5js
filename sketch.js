var song;
// var slider;
var fft;
var particles = []
var img

function preload() {
  song = loadSound("smallestviolin.mp3");
  img = loadImage("image.jpeg")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  imageMode(CENTER)
  rectMode(CENTER)
  fft = new p5.FFT(0.5);

  img.filter(BLUR, 12)

  noLoop()
}

function draw() {
  background(0);
  stroke(255);
  strokeWeight(2);
  noFill();
  translate(width / 2, height / 2)

  fft.analyze()
  amp = fft.getEnergy(20, 200)

  push()
  if (amp > 165) {
    rotate(random(-0.2, 0.2))
  }

  image(img, 0, 0, width+100, height+100)
  pop()

  var alpha = map(amp,0,255,180,150)
  fill(0,alpha)
  noStroke()
  rect(0,0,width,height)


  stroke(255);
  strokeWeight(2);
  noFill();


  var wave = fft.waveform()

  for (var t = -1; t <= 1; t += 2) {
    beginShape()
    for (var i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, 180, 0, wave.length - 1))

      var r = map(wave[index], -1, 1, 100, 250)
      var x = r * sin(i) * t
      var y = r * cos(i)
      vertex(x, y)
    }
    endShape()
  }

  var p = new Particle()
  particles.push(p)

  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) {
      particles[i].update(amp > 175)
      particles[i].show()
    }
    else {
      particles.splice(i, 1)
    }
  }
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  }
  else {
    song.play()
    loop()
  }
}


class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(175)
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    this.w = random(3, 5)

    this.color = [random(200, 255), random(200, 255), random(200, 255)]
  }

  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }

  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 ||
      this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true
    }
    else {
      return false
    }
  }

  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, this.w)
  }
}