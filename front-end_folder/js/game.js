class Player {
    constructor(x, y, height, width, colour) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.colour = colour;
        this.xv = 0;
        this.yv = 0;
        this.onGround = true;
        this.bottom = null;
        this.top = null;
        this.left = null;
        this.right = null;
        this.doubleJumped = false;
    }

    getBottom() {
        return this.y + this.height;
    }

    getTop() {
        return this.y;
    }
    
    getLeft() {
        return this.x;
    }

    getRight() {
        return this.x + this.width;
    }

    draw() {
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height);
        c.fillStyle = this.colour;
        c.fill();
        c.stroke();
    }

    update() {
        this.draw();

        if(holdLeft) {
            this.xv = -5;
        }
        if(holdRight) {
            this.xv = 5;
        }

        this.x += this.xv;
        this.y += this.yv;
        this.bottom = this.getBottom();
        this.top = this.getTop();
        this.left = this.getLeft();
        this.right = this.getRight();

        if(this.onGround) {
            this.xv *= 0.8;
        }
        else {
            this.yv += gravity;
        }

        this.onGround = false;
        if(this.x <= 0 || this.x >= canvas.width) {
            this.xv = 0;
            // Will need to set player x position.
        }

        if(this.bottom >= platformY) {
            this.y = platformY - this.height;
            this.yv = 0;
            this.onGround = true;
            this.doubleJumped = false;
        }
    }
}

class Projectile {
    constructor(x, y, radius, colour, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.colour = colour;
        this.velocity = velocity;
    }

    draw() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.colour;
        c.fill();
    }

    update() {
        this.draw();
        this.testCollision();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }

    testCollision = () => {
        if(this.x > player.left && this.x < player.right &&
            this.y > player.top && this.y < player.bottom) {
                console.log("Hit!"); 
                finalScore = score;
                console.log(user.highscore)
                //Update users highscore
                if(score > user.highscore) {
                    newHighscoreSet = true;
                    user.highscore = score;
                    const resource = "/updatehighscore"
                    const params = "username=" + user.username +
                    "&highscore=" + user.highscore;

                    const xhttp = new XMLHttpRequest();
                    xhttp.open("PUT", serverAddress + resource, true);
                    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                    xhttp.send(params);
                    xhttp.onreadystatechange = function () {
                        if(this.readyState == 4 && this.status == 200) {
                            console.log(this.responseText);
                        } 
                    }
                }
                changeGameState();   
            }     
    }
}

class Platform {
    constructor(x, y, height, width, colour) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.colour = colour;
    }

    draw() {
        c.beginPath();
        c.rect(this.x, this.y, this.width, this.height);
        c.fillStyle = this.colour;
        c.fill();
        c.stroke();
    }
}

class Canvas {
    constructor() {
        this.container = document.createElement('div');
        this.container.setAttribute('id', 'canvasContainer');

        this.canvas = document.createElement('canvas')
        this.container.appendChild(this.canvas);

        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT
    }

    showCanvas() {
        if(!mainContainer.contains(this.container)) {
            mainContainer.appendChild(this.container);
        }
    }

    hideCanvas() {
        if(mainContainer.contains(this.container)) {
            mainContainer.removeChild(this.container);
        }
    }
}

class AccountSettingsMenu {
    constructor() {
        this.container = document.createElement("div");
        this.container.setAttribute("id", "ASContainer");
        
        this.settingsDiv = document.createElement("div");
        this.container.setAttribute("id", "settingsContainer");

        this.header = document.createElement("h2");
        this.header.setAttribute("id", "settingsHeader");
        this.header.innerHTML = "Account Settings";

        this.deleteOption = document.createElement("span");
        this.deleteOption.setAttribute("id", "deleteOption");
        this.deleteOption.innerHTML = "Delete Account: ";

        this.deleteBtn = document.createElement("button");
        this.deleteBtn.setAttribute("type", "button");
        this.deleteBtn.innerHTML = "OK";

        this.settingsDiv.appendChild(this.deleteOption);
        this.settingsDiv.appendChild(this.deleteBtn);
        
        this.container.appendChild(this.header);
        this.container.appendChild(this.settingsDiv);

        this.deleteBtn.onclick = () => {
            if(confirm("Are you sure?\nThis cannot be undone.")) {
                const resource = "/deleteUser";
                const params = "username=" + user.username;

                const xhttp = new XMLHttpRequest();
                xhttp.open("DELETE", serverAddress + resource, true);
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send(params);
                xhttp.onreadystatechange = function () {
                    if(this.readyState == 4 && this.status == 200) {
                        console.log(this.responseText);
                    } 
                }
                this.hide();
                menuBar.hide();
                login.display();
                user = null;
            }
        }
    }

    display() {
        if(!mainContainer.contains(this.container)) {
            mainContainer.appendChild(this.container);
        }
    }

    hide() {
        if(mainContainer.contains(this.container)) {
            mainContainer.removeChild(this.container);
        }
    }

}

class Leaderboard {
    constructor() {
        this.container = document.createElement("div");
        this.subContainer = document.createElement("div");
        this.subContainer.setAttribute("id", "lbContainer");
        
        this.thead = document.createElement("thead");
        this.table = document.createElement("table");
        this.table.setAttribute("class", "table table-stripped");

        this.tbody = document.createElement("tbody");
        this.tbody.setAttribute("id", "data");

        this.userHeader = document.createElement("th");
        this.userHeader.innerHTML = "Username";
        this.scoreHeader = document.createElement("th");
        this.scoreHeader.innerHTML = "Highscore";

        this.thead.appendChild(document.createElement("tr"));
        this.thead.appendChild(this.userHeader);
        this.thead.appendChild(this.scoreHeader);

        this.table.appendChild(this.thead);
        this.table.appendChild(this.tbody);

        this.subContainer.appendChild(this.table);
        this.container.appendChild(this.subContainer);
    }

    fetchData() {
        const resource = "/getleaderboard/";
        fetch(serverAddress + resource)
        .then(res=>{
            res.json().then(data=>{
                console.log(data);
                if(data.length > 0){
                    let temp = "";
                    data.forEach((u)=>{
                        temp +="<tr>";
                        temp += "<td>"+u.username+"</td>";
                        temp += "<td>"+u.highscore+"</td></tr>";
                        });
                        this.tbody.innerHTML = temp;
                }
            });
        });
    }

    display() {
        if(!mainContainer.contains(this.container)) {
            this.fetchData();
            mainContainer.appendChild(this.container);
        }
    }

    hide() {
        if(mainContainer.contains(this.container)) {
            mainContainer.removeChild(this.container);
        }
    }
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

const gameCanvas = new Canvas();
const canvas = gameCanvas.canvas;
const c = canvas.getContext('2d');

const x = canvas.width / 2;
const y = canvas.height - (canvas.height / 3);
const platformWidth = 1200;
const platformHeight = 400;
const platformX = 0;
const platformY = y + 60;
const gravity = 0.5;
let holdLeft = holdRight = false;

let gameID = null;
let state = "startScreen";
const settingsMenu = new AccountSettingsMenu();
const leaderboard = new Leaderboard();
const player = new Player(x, y, 50, 25, 'blue');
const platform = new Platform(platformX, platformY,
    platformHeight, platformWidth, "grey");
const projectiles = [];
let startTime = null;
let elapsedTime = null;
let score = null;
let finalScore = null;
const spawnIntervals = [];
let currentLevel = 0;
let newHighscoreSet = false;

updateTime = () => {
    elapsedTime = parseInt((new Date() - startTime) / 1000);
}

// Displays the score during gameplay.
drawScore = () => {
    score = parseInt((new Date() - startTime) / 100 * 5);
    c.beginPath();
    c.fillStyle = "black";
    c.font = "16px Roboto";
    c.fillText("Score: " + score, canvas.width - 75, 25);
}

// Displays the final score after getting hit.
drawFinalScore = () => {
    c.beginPath();
    c.textAlign = "center";
    c.fillStyle = "black";

    c.font = "48px Roboto";
    c.fillText("You Scored: " + finalScore, (canvas.width / 2),
    2* (canvas.height / 5));

    c.font = "28px Roboto";
    c.fillText("Press 'Spacebar' to Play Again", (canvas.width / 2),
    2 * (canvas.height / 3))
}

drawNewHighscore = () => {
    c.beginPath();
    c.textAlign = "center";
    c.fillStyle = "black";

    c.font = "36px Roboto";
    c.fillText("New personal best!", (canvas.width / 2),
    2* (canvas.height / 5) + 100);
}

drawHighscore = () => {
    c.beginPath();
    c.textAlign = "center";
    c.fillStyle = "black";

    c.font = "36px Roboto";
    c.fillText("Personal best: " + user.highscore, (canvas.width / 2),
    2* (canvas.height / 5) + 100);
}

drawStartScreen = () => {
    c.beginPath();
    c.textAlign = "center";
    c.fillStyle = "black";

    c.font = "48px Roboto";
    c.fillText("Dodge the Bullets!", (canvas.width / 2),
    2* (canvas.height / 5));

    c.font = "24px Roboto";
    c.fillText("Use the Arrow Keys to Move", (canvas.width / 2),
    2 * (canvas.height / 3) - 50);

    c.font = "24px Roboto";
    c.fillText("Press 'Spacebar' to Start", (canvas.width / 2),
    2 * (canvas.height / 3) + 50);
}

resetPlayerPos = () => {
    player.x = x;
    player.y = y;
}

resetGame = () => {
    newHighscoreSet = false;
    resetPlayerPos();
    score = 0;
    startTime = new Date();
    projectiles.length = 0;
}

// Screen shown after getting hit.
gameOverScreen = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawFinalScore();
    if(newHighscoreSet) {
        drawNewHighscore();
    }
    else {
        drawHighscore();
    }
}

// Screen shown after logging in.
startScreen = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    drawStartScreen();
}

animate = () => {
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    player.update();
    platform.draw();
    projectiles.forEach(enemy => {
        enemy.update();
    })
    updateTime();
    drawScore();
    spawnProjectiles();
}

spawnProjectiles = () => {    
    if(currentLevel == 0) {
        spawnIntervals.push(spawnLevel1());
        currentLevel = 1;
    }
    
    if(elapsedTime >=10 && elapsedTime < 20) {
        if(currentLevel == 1) {
            clearSpawns();
            spawnIntervals.push(spawnLevel2());
            currentLevel = 2;
        }
    }
    else if(elapsedTime < 30) {
        if(currentLevel == 2) {
            clearSpawns();
            spawnIntervals.push(spawnLevel3());
            currentLevel = 3;
        }
    }
    else if(elapsedTime < 40) {
        if(currentLevel == 3) {
            clearSpawns();
            spawnIntervals.push(spawnLevel4());
            currentLevel = 4;
            console.log("This hit");
        }
    }
}

clearSpawns = () => {
    const spawn = spawnIntervals.pop();
    clearInterval(spawn);
}

spawnLevel1 = () => {
    return setInterval(() => {
        let x = null;
        let y = null;
        let velocity = {x: null, y: 0};
        const radius = 8;
        const colour = "red";

        const spawnSide = Math.floor(Math.random() * 2) + 1;

        if(spawnSide == 1) {
            x = 0;
            velocity.x = 5;
        }
        else {
            x = canvas.width;
            velocity.x = -5;
        }

        y = (platform.y - radius) - Math.floor(Math.random() * 200);

        projectiles.push(new Projectile(x, y, radius, colour, velocity));
    }, 1000);
}

spawnLevel2 = () => {
    return setInterval(() => {
        let x = null;
        let y = null;
        let velocity = {x: null, y: 0};
        const radius = 8;
        const colour = "red";

        const spawnSide = Math.floor(Math.random() * 2) + 1;

        if(spawnSide == 1) {
            x = 0;
            velocity.x = 6;
        }
        else {
            x = canvas.width;
            velocity.x = -6;
        }

        y = (platform.y - radius) - Math.floor(Math.random() * 200);

        projectiles.push(new Projectile(x, y, radius, colour, velocity));
    }, 900);
}

spawnLevel3 = () => {
    return setInterval(() => {
        let x = null;
        let y = null;
        let velocity = {x: null, y: 0};
        const radius = 8;
        const colour = "red";

        const spawnSide = Math.floor(Math.random() * 2) + 1;

        if(spawnSide == 1) {
            x = 0;
            velocity.x = 7;
        }
        else {
            x = canvas.width;
            velocity.x = -7;
        }

        y = (platform.y - radius) - Math.floor(Math.random() * 200);

        projectiles.push(new Projectile(x, y, radius, colour, velocity));
    }, 800);
}

spawnLevel4 = () => {
    return setInterval(() => {
        let x = null;
        let y = null;
        let velocity = {x: null, y: 0};
        const radius = 8;
        const colour = "red";

        const spawnSide = Math.floor(Math.random() * 2) + 1;

        if(spawnSide == 1) {
            x = 0;
            velocity.x = 7;
        }
        else {
            x = canvas.width;
            velocity.x = -7;
        }

        y = (platform.y - radius) - Math.floor(Math.random() * 200);

        projectiles.push(new Projectile(x, y, radius, colour, velocity));
    }, 650);
}

changeGameState = () => {
    if(state === "startScreen") {
        clearInterval(gameID);
        resetGame();
        gameID = setInterval(animate, 1000/60);
        state = "playing";
    }
    else if(state === "playing") {
        clearInterval(gameID);
        gameID = setInterval(gameOverScreen, 1000/60);
        state = "gameEnded";
    }
    else if(state === "gameEnded") {
        clearInterval(gameID);
        resetGame();
        gameID = setInterval(animate, 1000/60);
        state = "playing";
    }
}

openGame = () => {
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    gameCanvas.showCanvas();
    menuBar.display();
}

keyDown = (event) => {
    switch(event.keyCode) {
        // Spacebar
        case 32:
            if(state === "startScreen" || state === "gameEnded") {
                changeGameState();
            }
            break;
        // Left arrow key
        case 37:
            holdLeft = true;
            break;
        // Up arrow key
        case 38:
            if(player.onGround) {
                player.yv = -11;
            }
            else {
                if(!player.doubleJumped) {
                    player.yv = -11;
                    player.doubleJumped = true;
                }
            }
            break;
        // Right arrow key
        case 39:
            holdRight = true;
            break;
    }
}

keyUp = (event) => {
    switch(event.keyCode) {
        case 37:
            holdLeft = false;
            break;
        case 38:
            if(player.yv < -3) {
                player.yv = -3;
            }
            break;
        case 39:
            holdRight = false;
            break;
    }
}