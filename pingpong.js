const canv = document.getElementById('gamCanv');
const canvCtx = canv.getContext('2d');
 
//adjusting the canvas dimensions according to window size    
canv.width = window.innerWidth * 0.7;
canv.height = window.innerHeight * 0.96;
    
 //ball    
var ball_X = 50;      
var ball_Y = 50;
var ball_Spd_X = 20;   
var ball_Spd_Y = 10;
//paddles    
var paddle_1_Y = 250;
var paddle_2_Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 6;
    
//obstacles    
const OBSTACLE_1_HEIGHT = 110;    
const OBSTACLE_1_THICKNESS = 12;
const OBSTACLE_1_START_X = 380;
const OBSTACLE_1_START_Y = -10;
    
const OBSTACLE_2_HEIGHT = 110;    
const OBSTACLE_2_THICKNESS = 12;
const OBSTACLE_2_START_X = 300;
const OBSTACLE_2_START_Y = 530;

const OBSTACLE_3_HEIGHT = 80;    
const OBSTACLE_3_THICKNESS = 10;
const OBSTACLE_3_START_X = 700;
const OBSTACLE_3_START_Y = 500;    
 
//declare scores    
var player_1_Scr = 0;
var player_2_Scr = 0;
const FINAL_WIN_SCORE = 4;
var after_games_Screen = false; 


setInterval( function() {
                 moveAllComponents();
                 drawAllComponents();
                }, 1000/30);            //frames per second is 30
    
canv.addEventListener('mousedown', MouseClick);       
    
canv.addEventListener('mousemove', function (evt) {                                   
                                         var mousePos = MousePos(evt);
                                         paddle_1_Y = mousePos.y - PADDLE_HEIGHT/2;    
                                    }) ;   //bringing cursor to center of user paddle

//for addition of "click to play again" after game ends
function MouseClick(evt) {             
    if(after_games_Screen) {           
        player_1_Scr = 0;              
        player_2_Scr = 0;
        after_games_Screen = false;
    }
}    
    
//controlling user paddle with mouse  
function MousePos(evt) {                          
    var rect = canv.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    }
}    
 
//Artificial intelligence    
//movement of computer paddle
//teaching computer to learn from the movement of ball
function compMovement() {
    var paddle_2_Y_Center = paddle_2_Y + PADDLE_HEIGHT/2;
    if (paddle_2_Y_Center < ball_Y-25) {
        paddle_2_Y += 35;
    }
    else if(paddle_2_Y_Center > ball_Y+25) {
        paddle_2_Y -= 35;
    }
}
    
//reset the ball when one reaches the winning sscore    
function ballReset() {
    if (player_1_Scr>=FINAL_WIN_SCORE || 
        player_2_Scr>=FINAL_WIN_SCORE) {
                after_games_Screen = true;
    }
    
    ball_Spd_X = -ball_Spd_X;       //randomizing the movement of ball after reset
    ball_X = canv.width/2;          //setting position of ball after reset
    ball_Y = canv.height/2;
}

//moving all the components in the canvas
function moveAllComponents() {
    if(after_games_Screen) {
        return; 
    }
    
    compMovement();           //computer paddle moves
    
    ball_X += ball_Spd_X;      
    ball_Y += ball_Spd_Y;
    
    //rebounding from the obstacles
    
    if (ball_X > OBSTACLE_1_START_X-10 && ball_X < OBSTACLE_1_START_X+OBSTACLE_1_THICKNESS+10) {
        if (ball_Y>OBSTACLE_1_START_Y-10 && ball_Y<OBSTACLE_1_START_Y+OBSTACLE_1_HEIGHT+10) {
            ball_Spd_X = -ball_Spd_X;
        }
    } 
    
    if (ball_X > OBSTACLE_2_START_X-10 && ball_X < OBSTACLE_2_START_X+OBSTACLE_2_THICKNESS+10) {
        if (ball_Y>OBSTACLE_2_START_Y && ball_Y<OBSTACLE_2_START_Y+OBSTACLE_2_HEIGHT+10) {
            ball_Spd_X = -ball_Spd_X;
        }
    } 
   
    if (ball_X > OBSTACLE_3_START_X-10 && ball_X < OBSTACLE_3_START_X+OBSTACLE_3_THICKNESS+10) {
        if (ball_Y>OBSTACLE_3_START_Y && ball_Y<OBSTACLE_3_START_Y+OBSTACLE_3_HEIGHT+10) {
            ball_Spd_X = -ball_Spd_X;
        }
    } 
    
    //rebound and miss
    //paddles
    
    if(ball_X < 11) {
        if(ball_Y > paddle_1_Y-5 && 
           ball_Y < paddle_1_Y+PADDLE_HEIGHT+5) {
                ball_Spd_X = -ball_Spd_X; 
            
                var diff_dist_1_Y = ball_Y - (paddle_1_Y+PADDLE_HEIGHT/2);
                ball_Spd_Y = diff_dist_1_Y * 0.6;
        }
        else {
        player_2_Scr++;     
        ballReset();
        }
    }
    
    if(ball_X > canv.width - 11) {
        if(ball_Y > paddle_2_Y-5 && 
           ball_Y < paddle_2_Y+PADDLE_HEIGHT+5) {
                ball_Spd_X = -ball_Spd_X;
            
                var diff_dist_2_Y = ball_Y - (paddle_2_Y+PADDLE_HEIGHT/2);
                ball_Spd_Y = diff_dist_2_Y * 0.7;
        }
        else {
        player_1_Scr++;      
        ballReset();   
        }
    }
    
    //rebounding from the top and bottom
    
    if(ball_Y < 7) {
        ball_Spd_Y = -ball_Spd_Y;
    }
    
    if(ball_Y > canv.height - 7) {
        ball_Spd_Y = -ball_Spd_Y;
    }
    
}
 
//design the grid    
function drawGrid() {
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/2-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/4-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(4/3)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/8-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(8/3)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(8/5)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(8/7)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/16-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(16/3)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(16/5)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(16/7)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(16/9)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(16/11)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(16/13)-1, i, 1, 2, 'white');
    }
    for (var i = 0; i < canv.height; i += 40) {
        colorRect(canv.width/(16/15)-1, i, 1, 2, 'white');
    }
}    

//draw all rectangular objects
function colorRect(leftX, topY, width, height, drawColor ) {
    canvCtx.fillStyle = drawColor;
    canvCtx.fillRect(leftX, topY, width, height);
}

//draw ball
function colorCircle(centerX, centerY, radius, drawColor) {
    canvCtx.fillStyle = drawColor;
    canvCtx.beginPath();
    canvCtx.arc(centerX, centerY, radius, 0, Math.PI*2 , true);
    //((x,y) of centre, radius, start-radian, end-radian, for top half--true) 
    canvCtx.fill();
}

//draw all the elements of the canvas    
function drawAllComponents() {
    
    colorRect(0,0,canv.width,canv.height, 'black');
    
    drawGrid();            //grid drawn
    
    if(after_games_Screen) {
        canvCtx.fillStyle = 'white';
        
        if (player_1_Scr>=FINAL_WIN_SCORE) {
            canvCtx.font = "50px Arial";
            canvCtx.fillText("You Won!", canv.width/2-95, 200);
        } 
        else if (player_2_Scr>=FINAL_WIN_SCORE) {
            canvCtx.font = "50px Arial";    
            canvCtx.fillText("Computer Won!", canv.width/2-153, 200);
            canvCtx.font = "25px Arial";
            canvCtx.fillText("Better luck Next Time!", canv.width/2-102, 250);
            
        }
            
        canvCtx.fillStyle = 'white';
        canvCtx.font = "30px Arial";
        canvCtx.fillText("Click to play again", canv.width/2-100, 500);
        return;
    }
    
    //left Player paddle
    colorRect(7, paddle_1_Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');  
    //right computer paddle
    colorRect(canv.width - PADDLE_THICKNESS - 7, paddle_2_Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    //ball 
    colorCircle(ball_X, ball_Y, 7, 'white');
    
    //obstacle 1
    colorRect(OBSTACLE_1_START_X, OBSTACLE_1_START_Y, OBSTACLE_1_THICKNESS, OBSTACLE_1_HEIGHT, '#CF0000');
    //obstacle 2
    colorRect(OBSTACLE_2_START_X, OBSTACLE_2_START_Y, OBSTACLE_2_THICKNESS, OBSTACLE_2_HEIGHT, '#CF0000');
    //obstacle 3
    colorRect(OBSTACLE_3_START_X, OBSTACLE_3_START_Y, OBSTACLE_3_THICKNESS, OBSTACLE_3_HEIGHT, '#CF0000');
    
    //writing some texts on the screen
    canvCtx.fillStyle = '#888888';
    canvCtx.font = "15px Arial";
    canvCtx.fillText('Your Score:', 130, 50);
    canvCtx.fillText('Computer Score:', canv.width-210, 50); 
    canvCtx.fillText('Score 4 to WIN', 450, 100);
    
    canvCtx.fillStyle = '#666666';
    canvCtx.font = "25px Arial";
    canvCtx.fillText('Move your Mouse to play', 370, 340);
    canvCtx.font = "18px Arial";
    canvCtx.fillText('Try hitting the ball with the', 400, 470);
    canvCtx.fillText('edge of your paddle', 430, 500);
    
    //writing scores
    canvCtx.fillStyle = 'white';
    canvCtx.font = "30px Arial";
    canvCtx.fillText(player_1_Scr, 160, 100);
    canvCtx.fillText(player_2_Scr, canv.width-160, 100);
}