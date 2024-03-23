const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let score = document.querySelector(".scno");
let totalscore = document.querySelector(".totalscno");
let start = document.querySelector(".start");
let menu = document.querySelector(".menu");
start.addEventListener("click", function () {
  menu.style.display = "none";
  init();
  animate();
  spawnenemy();
});
let scores = 0;
const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;

  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}
const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  init();
});
//color
let color = `hsl(${Math.random() * 360}, 50% , 50%)`;
// Objects
function Player(x, y, radius, color) {
  this.x = innerWidth / 2;
  this.y = innerHeight / 2;
  this.radius = 15;
  this.color = "white";

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.strokeStyle = "orange";
    c.fill();
    c.stroke();
    c.closePath();
  };

  this.update = function () {
    this.draw();
  };
}
function Bullet(x, y, radius, color, velocity) {
  this.x = x;
  this.y = y;
  this.radius = 5;
  this.color = "white";
  this.velocity = velocity;

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  };

  this.update = function () {
    this.draw();
    this.x = this.x + this.velocity.x * 7;
    this.y = this.y + this.velocity.y * 7;
  };
}
function Enemy(x, y, radius, color, velocity) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.velocity = velocity;

  this.draw = function () {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  };

  this.update = function () {
    this.draw();
    
    this.x = this.x + velocity.x;
    this.y = this.y + velocity.y;
  };
}
function Particle(x, y, radius, color, velocity) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.velocity = velocity;
  this.alpha = 1;
  this.gravity = 1;

  this.draw = function () {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.globalAlpha = this.alpha;
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  };

  this.update = function () {
    this.draw();
    this.x = this.x + this.velocity.x * 7;
    this.y = this.y + this.velocity.y * 7 + this.gravity;
    this.alpha -= 0.01;
    this.gravity += 0.05;
  };
}

// Implementation
let bullets;
let enemies;
let particles;
function init() {
  scores = 0;
  score.innerHTML = scores;
  bullets = [];
  enemies = [];
  particles = [];
  player = new Player();
}
function spawnenemy() {
  setInterval(() => {
    let radius = Math.random() * 30 + 10;
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }
    let color = randomColor(colors);
    let angle = Math.atan2(player.y- y, player.x - x);
    let velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };
    console.log(enemies);

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 2000);
}
addEventListener("click", function (event) {
  let angle = Math.atan2(
    mouse.y - player.y,
    mouse.x - player.x
  );
  let velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };
  bullets.push(
    new Bullet( player.x, player.y , 5, "red", velocity)
  );
});

// Animation Loop
let animationid;
function animate() {
  animationid = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,0.1)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  
  particles.forEach((particle, index) => {
    particle.update();
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
  });
  bullets.forEach((bullet, index) => {
    bullet.update();
    if (
      bullet.x - bullet.radius < 0 ||
      bullet.y - bullet.radius < 0 ||
      bullet.x - bullet.radius > canvas.width ||
      bullet.y - bullet.radius > canvas.height
    ) {
      setTimeout(() => {
        bullets.splice(index, 1);
      }, 0);
    }
  });
  enemies.forEach((enemy, enemyindex) => {
    enemy.update();
    let dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - player.radius - enemy.radius < 1) {
      cancelAnimationFrame(animationid);
      menu.style.display = "flex";
    }
    bullets.forEach((bullet, bulletindex) => {
      let dist = Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y);
      if (dist - enemy.radius - bullet.radius < 1) {
        scores += 100;
        score.innerHTML = scores;
        totalscore.innerHTML = scores;

        for (let i = 0; i < 100; i++) {
          particles.push(
            new Particle(enemy.x, enemy.y, Math.random() * 2, enemy.color, {
              x: Math.random() - 0.5,
              y: Math.random() - 0.5,
            })
          );
        }

        if (enemy.radius - 10 > 10) {
          enemy.radius = enemy.radius - 10;
          setTimeout(() => {
            bullets.splice(bulletindex, 1);
          }, 0);
        } else {
          setTimeout(() => {
            enemies.splice(enemyindex, 1);
            bullets.splice(bulletindex, 1);
          }, 0);
        }
      }
    });
  });
}
addEventListener("keydown", (event) => {
  // console.log(keyCode);
  switch (event.key) {
    case "a":
      console.log("left");
      player.x -= 10;
      break;
    case "d":
      console.log("right");
      player.x += 10;

      break;
    default:
      break;
  }
});
addEventListener("keydown", (event) => {
  console.log(event);
  switch (event.key) {
    case "w":
      console.log("up");
      player.y -= 10;

      break;
    case "s":
      console.log("down");
      player.y += 10;

      break;
    default:
      break;
  }
});

// init();
// animate();
// spawnenemy();
