class MenuBar {
    constructor() {
        this.container = document.createElement("div");
        this.container.setAttribute("id", "menuBar");

        this.gameBtn = document.createElement("button");
        this.gameBtn.setAttribute("type", "button");
        this.gameBtn.setAttribute("id", "gameBtn");
        this.gameBtn.innerHTML = "Play Game";

        this.settingsBtn = document.createElement("button");
        this.settingsBtn.setAttribute("type", "button");
        this.settingsBtn.innerHTML = "Account Settings";

        this.leaderboardBtn = document.createElement("button");
        this.leaderboardBtn.setAttribute("type", "button");
        this.leaderboardBtn.innerHTML = "View Leaderboard";

        this.container.appendChild(this.gameBtn);
        this.container.appendChild(this.settingsBtn);
        this.container.appendChild(this.leaderboardBtn);

        this.gameBtn.onclick = () => {
            settingsMenu.hide();
            leaderboard.hide();
            gameCanvas.showCanvas();
        }

        this.settingsBtn.onclick = () => {
            gameCanvas.hideCanvas();
            leaderboard.hide();
            settingsMenu.display();
        }

        this.leaderboardBtn.onclick = () => {
            gameCanvas.hideCanvas();
            settingsMenu.hide();
            leaderboard.display();
        }
    }

    display() {
        if(!menuContainer.contains(this.container)) {
            menuContainer.appendChild(this.container);
        }
    }

    hide() {
        if(menuContainer.contains(this.container)) {
            menuContainer.removeChild(this.container);
        }
    }
}

const serverAddress = "https://manroopkaur.ca/API/v1";
const menuBar = new MenuBar();
const login = new LoginMenu();
const createAccount = new CreateAccMenu();
let user = null;
const mainContainer = document.getElementById("mainContainer");
const menuContainer = document.getElementById("menuContainer");

window.onload = () => {
    login.display();
    gameID = setInterval(startScreen, 1000/60);
}