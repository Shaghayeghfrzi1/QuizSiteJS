let myUsername = document.querySelector("#UserName");
let myPassword = document.querySelector("#Password");
let myButton = document.querySelector("#cmdCreate");


var isLogin= false;
//Skapa ny knapp för skapa quiz om man är inloggad
myButton.addEventListener("click", () => {
      
    if(myUsername.value=="sara" && myPassword.value=="123")
    {
        alert("hej "+ myUsername.value+"! välkomen.");
        window.open("createQuiz.html");
        isLogin = true;
        let admin = new Admin();
        Admin.IsAdmin(isLogin);

    }
    else
    {
        alert("Din användarnamn/ lösenord är fel, försök igen!");
    }

});