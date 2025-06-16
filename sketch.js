let particles = [];
const MAX_PARTICLES = 150;
const CONNECTION_DISTANCE = 120;
let colorPhase = 0;
let attractorX, attractorY;
let mouseAttraction = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 初期粒子の生成
  for (let i = 0; i < 80; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
  
  attractorX = width / 2;
  attractorY = height / 2;
}

function draw() {
  // 背景を半透明にして軌跡効果を作る
  background(0, 20);
  
  // カラーフェーズを更新
  colorPhase += 0.01;
  
  // マウス位置を引力点として使用
  if (mouseAttraction && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    attractorX = lerp(attractorX, mouseX, 0.1);
    attractorY = lerp(attractorY, mouseY, 0.1);
  }
  
  // 粒子の更新と描画
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.update();
    p.display();
    
    // 寿命が尽きた粒子を削除
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // 粒子間の接続を描画
  drawConnections();
  
  // 新しい粒子を時々追加
  if (frameCount % 30 === 0 && particles.length < MAX_PARTICLES) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      
      if (d < CONNECTION_DISTANCE) {
        // 距離に基づいて線の透明度を計算
        let alpha = map(d, 0, CONNECTION_DISTANCE, 255, 0);
        
        // 虹色のグラデーション
        let hue = (colorPhase + d * 0.01) % 1;
        let col = color(
          sin(hue * TWO_PI) * 127 + 128,
          sin(hue * TWO_PI + 2) * 127 + 128,
          sin(hue * TWO_PI + 4) * 127 + 128,
          alpha
        );
        
        stroke(col);
        strokeWeight(map(d, 0, CONNECTION_DISTANCE, 2, 0.5));
        line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
      }
    }
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = random(-2, 2);
    this.vy = random(-2, 2);
    this.size = random(3, 8);
    this.lifespan = 255;
    this.maxSpeed = 3;
    this.colorOffset = random(TWO_PI);
  }
  
  update() {
    // 引力の計算
    if (mouseAttraction) {
      let dx = attractorX - this.x;
      let dy = attractorY - this.y;
      let distance = sqrt(dx * dx + dy * dy);
      
      if (distance > 5) {
        let force = 0.5 / (distance * 0.1);
        force = constrain(force, 0, 0.5);
        this.vx += (dx / distance) * force;
        this.vy += (dy / distance) * force;
      }
    }
    
    // ランダムな力を追加
    this.vx += random(-0.1, 0.1);
    this.vy += random(-0.1, 0.1);
    
    // 速度制限
    let speed = sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }
    
    // 位置を更新
    this.x += this.vx;
    this.y += this.vy;
    
    // 画面端での反射
    if (this.x < 0 || this.x > width) {
      this.vx *= -0.9;
      this.x = constrain(this.x, 0, width);
    }
    if (this.y < 0 || this.y > height) {
      this.vy *= -0.9;
      this.y = constrain(this.y, 0, height);
    }
    
    // 寿命を減らす
    this.lifespan -= 0.5;
  }
  
  display() {
    // パルス効果
    let pulse = sin(frameCount * 0.05 + this.colorOffset) * 0.5 + 0.5;
    let currentSize = this.size * (0.8 + pulse * 0.4);
    
    // 色相を計算
    let hue = (colorPhase + this.colorOffset) % 1;
    let alpha = map(this.lifespan, 0, 255, 0, 255);
    
    // グロー効果
    push();
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = `rgba(${sin(hue * TWO_PI) * 127 + 128}, ${sin(hue * TWO_PI + 2) * 127 + 128}, ${sin(hue * TWO_PI + 4) * 127 + 128}, ${alpha / 255})`;
    
    noStroke();
    fill(
      sin(hue * TWO_PI) * 127 + 128,
      sin(hue * TWO_PI + 2) * 127 + 128,
      sin(hue * TWO_PI + 4) * 127 + 128,
      alpha
    );
    ellipse(this.x, this.y, currentSize);
    pop();
  }
  
  isDead() {
    return this.lifespan <= 0;
  }
}

// マウスクリックで新しい粒子を追加
function mousePressed() {
  for (let i = 0; i < 5; i++) {
    let angle = random(TWO_PI);
    let speed = random(2, 5);
    let p = new Particle(mouseX, mouseY);
    p.vx = cos(angle) * speed;
    p.vy = sin(angle) * speed;
    particles.push(p);
  }
  
  // 最大数を超えたら古い粒子を削除
  while (particles.length > MAX_PARTICLES) {
    particles.shift();
  }
}

// マウス移動で引力を有効化
function mouseMoved() {
  mouseAttraction = true;
}

// スペースキーでリセット
function keyPressed() {
  if (key === ' ') {
    particles = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new Particle(random(width), random(height)));
    }
  }
}

// ウィンドウサイズ変更に対応
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}