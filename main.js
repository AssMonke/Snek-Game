class SnakeBody{ //this is prob unnecessary since you could use an array to store these values
    constructor(amount, up){
        this.amount = amount;
        this.up = up;
    }
}

// 🎄 merry christmas :) 🎄

const snake_div = document.getElementById("snake");
const apple_div = document.getElementById("apple");
const score_header = document.getElementById("score");
const gameOver_p = document.getElementById("gameOver");
const retry_button = document.getElementById("retry");
const nom_audio = document.getElementById("nom");
const hit_audio = document.getElementById("hit");
const hat_img = document.getElementById("hat");
const eye_div = document.getElementById("eye");

const speed = 16;
const snakeSize = 15;
const distBetweenBodys = 16;
const movementRateMulti = 4;
const updateRate = 16;
const maxBodys = 256;

var score = 0;

var bodys = new Array();
bodys.push(snake_div);

var bodyClasses = new Array();
bodyClasses.push(new SnakeBody(speed, false, true, null));

snake_div.style.width = snakeSize;
snake_div.style.height = snakeSize;
document.documentElement.style.setProperty('--snakeSize', snakeSize + 'px');

for(let i = 0; i < maxBodys; i++){ AddBody(); } //ik this is a lazy solution to adding bodys
bodys[1].style.visibility = 'visible';

var currentDirection = 3; // make sure we cant go up if were going down etc
var canMove = true;
var isGameOver = false;
var updateLoop;

document.addEventListener('keydown', function(event)
{
    if(isGameOver){return;};
    
    if ((event.keyCode == '87' || event.keyCode == '38') && currentDirection != 1 && currentDirection != 0) //up
    {
        ChangeInput(-speed, true, 0);
        return;
    }
    if ((event.keyCode == '83' || event.keyCode == '40') && currentDirection != 0 && currentDirection != 1) //down
    {
        ChangeInput(speed, true, 1);
        return;
    }
    if ((event.keyCode == '65' || event.keyCode == '37') && currentDirection != 3 && currentDirection != 2) //left
    {
        ChangeInput(-speed, false, 2);
        return;
    }
    if ((event.keyCode == '68' || event.keyCode == '39') && currentDirection != 2 && currentDirection != 3) //right
    {
        ChangeInput(speed, false, 3);
        return;
    }
});

function ChangeInput(spd, upDown, direction)
{
    if(!canMove){
        window.setTimeout(() => {ChangeInput(spd, upDown, direction);}, updateRate / movementRateMulti);
        return;
    }
    canMove = false;

    currentDirection = direction;

    //graphics
    if(spd > 0 && !upDown){
        hat_img.style.transform = "scaleX(-1)"
        hat_img.style.left = "-18px";
        eye_div.style.left ="10px";
    }
    else if(!upDown){
        hat_img.style.transform = "scaleX(1)"
        hat_img.style.left = "-6px";
        eye_div.style.left ="0px";
    }

    for(let i = 0; i < maxBodys; i++)
    {
        window.setTimeout(() => 
        {
            bodyClasses[i].amount = spd;
            bodyClasses[i].up = upDown;
        }, (i+1) * (distBetweenBodys / speed) * movementRateMulti * updateRate); //the distance between bodys should always be divisible by the speed or preferably equal to it
    }
}

var counter = 1;
function Update()
{
    for(let i = 0; i < maxBodys; i++)
    {
        if(counter == movementRateMulti){ //updates every (updateRate * movementRateMulti) miliseconds
            MoveElementRelative(bodys[i], bodyClasses[i].amount, bodyClasses[i].up, 0, "linear");
            if(i==maxBodys-1){canMove = true;}
        }
        
        if(i > 2 && bodys[i].style.visibility == 'visible' && CheckCollision(snake_div, bodys[i])){
            hit_audio.play();
            EndGame("Game Over!");
        }
    }
    if(counter == movementRateMulti){
        counter = 1;
    }
    else{
        counter++;
    }

    if(CheckCollision(snake_div, apple_div))
    {
        apple_div.style.top = Math.floor(Math.random() * 81 ) + 10 + "%";
        apple_div.style.left = Math.floor(Math.random() * 81 ) + 10 + "%";

        //make sure the apple isnt on top of a visible body
        SetApplePos();
        
        nom_audio.currentTime = 0; //incase its already playing
        nom_audio.play();

        score++;
        score_header.textContent = score;
        
        if(bodys[maxBodys-1].style.visibility == 'visible'){
            EndGame("You Win!");
        }

        bodys[score + 1].style.visibility = 'visible';
    }
    else if(snake_div.offsetTop + snakeSize > document.body.offsetHeight || snake_div.offsetTop < 0 || snake_div.offsetLeft + snakeSize > document.body.offsetWidth || snake_div.offsetLeft < 0){ //yikes
        hit_audio.play();
        EndGame("Game Over!");
    }
}
updateLoop = window.setInterval(Update, updateRate);

function SetApplePos()
{
    for(let i = 0; i < maxBodys; i++)
    {
        if(bodys[i].style.visibility == 'visible' && CheckCollision(apple_div, bodys[i]))
        {
            apple_div.style.top = Math.floor(Math.random() * 81 ) + 10 + "%";
            apple_div.style.left = Math.floor(Math.random() * 81 ) + 10 + "%";
            
            if(!CheckCollision(apple_div, bodys[i])){return;}
            i=0;
        }
    }
}

function CheckCollision(e1, e2)
{
    let x1 = e1.offsetLeft;
    let y1 = e1.offsetTop;
    let h1 = e1.offsetHeight;
    let w1 = e1.offsetWidth;
    let b1 = (y1 + h1);
    let r1 = (x1 + w1);

    let x2 = e2.offsetLeft;
    let y2 = e2.offsetTop;
    let h2 = e2.offsetHeight;
    let w2 = e2.offsetWidth;
    let b2 = (y2 + h2);
    let r2 = (x2 + w2);
                
    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2){
        return false;
    }
    return true; 
}

function AddBody()
{
    let bod = document.createElement("div");
    bod.classList.add("snakeBod");
    document.body.appendChild(bod);

    let lastBod = bodys[bodys.length-1];
    let lastBodClass = bodyClasses[bodyClasses.length-1];

    bod.style.left = (lastBod.offsetLeft - distBetweenBodys) + "px";

    bod.style.visibility = 'hidden'; //hide until body "added"

    bodys.push(bod);

    let prevAmount = lastBodClass.amount;
    let prevUp = lastBodClass.up;
    let prevMovement = lastBodClass.currentMovement;
    bodyClasses.push(new SnakeBody(prevAmount, prevUp, true, prevMovement));
}

function MoveElementRelative(element, amount, upDown, time, timingFunc)
{
    element.style.transition = 'all ' + time + 's ';
    element.style.transitionTimingFunction = timingFunc;
    
    if(upDown){
        element.style.top = (element.offsetTop + amount) + "px";
    }
    else{
        element.style.left = (element.offsetLeft + amount) + "px";
    }
}

function EndGame(txt)
{
    clearInterval(updateLoop);
    isGameOver = true;
    //move the bodys back after going into one
    for(let i = 0; i < maxBodys; i++){
        MoveElementRelative(bodys[i], -bodyClasses[i].amount, bodyClasses[i].up, 0, "linear");
    }

    gameOver_p.textContent = txt;

    retry_button.textContent = "Retry";
    retry_button.onclick = () => window.location.reload(true);
}