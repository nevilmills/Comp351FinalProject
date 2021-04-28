const MAX_UN_LENGTH = 16;
const MIN_UN_LENGTH = 3;
const MAX_PW_LENGTH = 16;
const MIN_PW_LENGTH = 5;

class CreateAccMenu {
    constructor() {
        this.container = document.createElement("div");
        this.container.setAttribute("class", "menuContainer");

        this.headerDiv = document.createElement("div");

        this.inputDiv = document.createElement("div");
        this.inputDiv.setAttribute("class", "inputContainer");

        this.errorMsgDiv = document.createElement("div");
        this.errorMsg = document.createElement("h4");
        this.errorMsg.setAttribute("class", "errorMsg");

        this.header = document.createElement("h3");
        this.header.innerHTML = "Create an Account";

        this.loginForm = document.createElement("form");

        this.usernameText = document.createElement("label");
        this.usernameText.innerHTML = "Username: ";

        this.usernameInput = document.createElement("input");
        this.usernameInput.setAttribute("type", "text");
        this.usernameInput.setAttribute("class", "usernameInput");

        this.passwordText = document.createElement("label");
        this.passwordText.innerHTML = "Password: ";
        
        this.passwordInput = document.createElement("input");
        this.passwordInput.setAttribute("type", "password");
        this.passwordInput.setAttribute("class", "passwordInput");

        this.createAccBtn = document.createElement("button");
        this.createAccBtn.setAttribute("type", "button");
        this.createAccBtn.setAttribute("id", "createAccBtn");
        this.createAccBtn.innerHTML = "Create Account";

        this.backBtn = document.createElement("button");
        this.backBtn.setAttribute("type", "button");
        this.backBtn.innerHTML = "Go back";

        this.headerDiv.appendChild(this.header);
        this.loginForm.appendChild(this.usernameText);
        this.loginForm.appendChild(this.usernameInput);
        this.loginForm.appendChild(this.passwordText);
        this.loginForm.appendChild(this.passwordInput);
        
        this.inputDiv.appendChild(this.loginForm);
        this.inputDiv.appendChild(this.createAccBtn);
        this.inputDiv.appendChild(this.backBtn);

        this.errorMsgDiv.appendChild(this.errorMsg);

        this.container.appendChild(this.headerDiv);
        this.container.appendChild(this.inputDiv);
        this.container.appendChild(this.errorMsgDiv);

        this.createAccBtn.onclick = () => {
            const thisObj = this;
            const resource = "/register";

            if(this.usernameInput.value.length < MIN_UN_LENGTH ||
            this.usernameInput.value.length > MAX_UN_LENGTH) {
                this.displayUsernameError();
                return;
            }
    
            if(this.passwordInput.value.length < MIN_PW_LENGTH ||
                this.passwordInput.value.length > MAX_PW_LENGTH) {
                    this.displayPasswordError();
                    return;
                }
    
            const params = "username=" + this.usernameInput.value +
            "&password=" + this.passwordInput.value;

            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", serverAddress + resource, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            
            xhttp.onreadystatechange = function () {
                //Successful account creation
                if(this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    thisObj.removeElements();
                    thisObj.usernameInput.value = "";
                    thisObj.passwordInput.value = "";
                    login.display();
                }

                //Username taken
                if(this.readyState == 4 && this.status == 409) {
                    console.log(this.responseText);
                    thisObj.displayUsernameTaken();
                }
                
                console.log(this.status + " " + this.responseText);
            }
        }
    
        this.backBtn.onclick = () => {
            this.removeElements();
            login.display();
        }
    }

    display = () => {
        mainContainer.appendChild(this.container);
    }

    removeElements = () => {
        mainContainer.removeChild(this.container);
        this.errorMsgDiv.removeChild(this.errorMsg);
    }

    displayUsernameError = () => {
        this.errorMsg.innerHTML =
        "Usernames must be between 3-16 characters in length.";
        this.errorMsgDiv.appendChild(this.errorMsg);
    }

    displayPasswordError = () => {
        this.errorMsg.innerHTML =
        "Passwords must be between 5-16 characters in length.";
        this.errorMsgDiv.appendChild(this.errorMsg);
    }

    displayUsernameTaken = () => {
        this.errorMsg.innerHTML =
        "That username is already taken.";
        this.errorMsgDiv.appendChild(this.errorMsg);
    }
}

class LoginMenu {
    constructor() {
        this.container = document.createElement("div");
        this.container.setAttribute("class", "menuContainer");

        this.headerDiv = document.createElement("div");

        this.loginDiv = document.createElement("div");
        this.loginDiv.setAttribute("id", "loginContainer");
        this.loginDiv.setAttribute("class", "inputContainer");
    
        this.header = document.createElement("h3");
        this.header.innerHTML = "Login to Your Account";
    
        this.loginForm = document.createElement("form");
    
        this.usernameText = document.createElement("label");
        this.usernameText.innerHTML = "Username: ";
    
        this.usernameInput = document.createElement("input");
        this.usernameInput.setAttribute("type", "text");
        this.usernameInput.setAttribute("class", "usernameInput");
    
        this.passwordText = document.createElement("label");
        this.passwordText.innerHTML = "Password: ";
        
        this.passwordInput = document.createElement("input");
        this.passwordInput.setAttribute("type", "password");
        this.passwordInput.setAttribute("class", "passwordInput");
    
        this.loginBtn = document.createElement("button");
        this.loginBtn.setAttribute("type", "button");
        this.loginBtn.setAttribute("class", "loginBtn");
        this.loginBtn.innerHTML = "Login";
    
        this.createAccBtn = document.createElement("button");
        this.createAccBtn.setAttribute("type", "button");
        this.createAccBtn.setAttribute("id", "createAccountBtn");
        this.createAccBtn.innerHTML = "Create An Account";

        this.errorMsgDiv = document.createElement("div");
        this.errorMsg = document.createElement("h4");
        this.errorMsg.setAttribute("class", "errorMsg");
        this.errorMsg.innerHTML = "Invalid username or password";
    
        this.headerDiv.appendChild(this.header);
        this.loginForm.appendChild(this.usernameText);
        this.loginForm.appendChild(this.usernameInput);
        this.loginForm.appendChild(this.passwordText);
        this.loginForm.appendChild(this.passwordInput);
        
        this.loginDiv.appendChild(this.loginForm);
        this.loginDiv.appendChild(this.loginBtn);
        this.loginDiv.appendChild(this.createAccBtn);

        this.container.appendChild(this.header);
        this.container.appendChild(this.loginDiv);
        this.container.appendChild(this.errorMsgDiv);
    
        this.createAccBtn.onclick = () => {
            this.removeElements();
            createAccount.display();
        }
    
        this.loginBtn.onclick = () => {
            const thisObj = this;
            const resource = "/login";
            const params = "username=" + this.usernameInput.value +
            "&password=" + this.passwordInput.value;


            const xhttp = new XMLHttpRequest();
            xhttp.open("POST", serverAddress + resource, true);
            xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhttp.send(params);
            xhttp.onreadystatechange = function () {
                //Successful login
                if(this.readyState == 4 && this.status == 200) {
                    const response = JSON.parse(this.responseText);
                    thisObj.removeElements();
                    openGame();
                    
                    // No score has been set yet.
                    if(response.highscore == undefined) {
                        user = new User(response.username, 0);
                    }
                    else {
                        user = new User(response.username, response.highscore);
                    }
                }

                // Unsuccessful login
                if(this.readyState == 4 && this.status == 401) {
                    console.log(this.responseText);
                    thisObj.displayError();
                }
            }
        }
    }
    
    display = () => {
        if(!mainContainer.contains(this.container)) {
            mainContainer.appendChild(this.container);
        }
    }

    removeElements = () => {
        if(mainContainer.contains(this.container)) {
            mainContainer.removeChild(this.container);
        }
    }

    displayError = () => {
        if(!this.errorMsgDiv.contains(this.errorMsg)) {
            this.errorMsgDiv.appendChild(this.errorMsg);
        }
    }

    hideError = () => {
        if(this.errorMsgDiv.contains(this.errorMsg)) {
            this.errorMsgDiv.removeChild(this.errorMsg);
        }
    }
}

class User {
    constructor(username, highscore) {
        this.username = username;
        this.highscore = highscore;
    }
}
