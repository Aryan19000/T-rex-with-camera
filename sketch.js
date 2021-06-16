var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var score;
var gameOver, restart;
var obstaclesGroup, cloudsGroup;

function preload() {
  groundImage = loadImage("ground2.png");

  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");

  cloudImage = loadImage("cloud.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");

  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight / 2);

  invisibleGround = createSprite(width / 2, height, width * 2, height / 8);
  invisibleGround.visible = false;

  ground = createSprite(invisibleGround.x, height / 1.125)
  ground.addImage(groundImage);

  trex = createSprite(width / 4, height / 2);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  trex.debug = true;

  gameOver = createSprite(width / 2, height / 2.5);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  restart = createSprite(width / 2, height / 1.5);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;

  console.log("You can check trex's position to clarify if camera is being used");
}

function draw() {
  background('#e8e5e5');

  textAlign(CENTER);
  text("Score: " + score, camera.position.x, height / 8);

  if (gameState === PLAY) {
    score = score + Math.round(getFrameRate() / 60);

    trex.velocityX = 5 + score / 100;
    trex.velocityY = trex.velocityY + 1;
    trex.collide(invisibleGround);

    if (keyDown("space") && trex.y > height / 1.25) {
      trex.velocityY = -15;
    }

    camera.position.x = trex.x + width / 3;
    camera.position.y = height / 2;
    invisibleGround.x = camera.position.x;
    if (ground.x < trex.x) {
      ground.x = camera.position.x;
    }

    spawnObstacles();
    spawnClouds();

    if (obstaclesGroup.isTouching(trex)) {
      gameState = END;
    }
  }
  if (gameState == END) {
    trex.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("collided", trex_collided);
    gameOver.x = camera.position.x;
    gameOver.visible = true;
    restart.x = camera.position.x;
    restart.visible = true;
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  drawSprites();
}
function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(trex.x + width, height / 1.175);
    obstacle.debug = true;

    var rand = Math.round(random(1, 6));
    switch (rand) {
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function spawnClouds() {
  if (frameCount % 30 === 0) {
    var cloud = createSprite(trex.x + width, height);
    cloud.y = Math.round(random(height / 4, height / 1.5));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.lifetime = 200;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;

    cloudsGroup.add(cloud);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0; 
}

