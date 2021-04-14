class QuizeManager {
    #quizes = [];
    #currentQuize;

    constructor() {

    }

    get currentQuize() {
        return this.#currentQuize;
    }

    Save() {
        var old;
        if (localStorage.getItem('Quizes') == null) {
            old = JSON.parse('[]');
            old.push(this.toJson());
        }
        else{
            old = JSON.parse(localStorage.getItem('Quizes'));
            old = JSON.parse(old[0]);
            var qc = JSON.parse(this.toJson());
            qc = qc.quizes[0];
            old.quizes.push(qc);
            var temp = JSON.stringify(old);
            var old = JSON.parse('[]');
            old.push(temp);
        }

        
        localStorage.setItem('Quizes', JSON.stringify(old));
        this.#quizes = [];
        alert('Ditt quiz har skapats');
    }

//lista med namn av alla quiz
    ShowListOfQuize() {
        if (localStorage.getItem('Quizes') != null) {
            var data = JSON.parse(JSON.parse(localStorage.getItem('Quizes'))[0]);
            var html = '<div>';
            for (var item in data.quizes) {
                html += '<button type="button" class="link2Quize" data-id="' + data.quizes[item].id + '">' + data.quizes[item].name + '</button><br/>';
            }
            html += '</div>';
            document.querySelector("#name-list").innerHTML = html;
        }
    }

//Köra ett quiz
    showQuizeDetail(id) {
        if (localStorage.getItem('Quizes') != null) {
            var data = JSON.parse(JSON.parse(localStorage.getItem('Quizes'))[0]);
            
            var html = this.buildList(data, id);
            document.querySelector("#detail-list").innerHTML = html;
        }
    }

//Visas en lista med frågor och svar för köra ett quiz
    buildList(data, id) {
        var html = '<div>';
        html += '<ul>';
        var quiz = data.quizes;
        for (var itemQuiz in quiz) {
            if (quiz[itemQuiz].id == id) {

                this.#currentQuize = quiz[itemQuiz];

                html += '<li class="QuesAnswLiName"><a>' + quiz[itemQuiz].name + '</a>';
                var question = quiz[itemQuiz].questions;
                html += '<ul>';
                for (var itemQuestion in question) {
                    html += '<li class="QuesAnswLi" id="' + quiz[itemQuiz].id + question[itemQuestion].id + '"><a>' + question[itemQuestion].name + '</a>';
                    var answare = question[itemQuestion].answers;
                    html += '<ul>';
                    for (var itemAnsware in answare) {
                        html += '<li class="QuesAnswLi"><input type="radio" name="' + question[itemQuestion].id + '" value="' + answare[itemAnsware].id + '"/> <a>' + answare[itemAnsware].name + '</a></li>';
                    }
                    html += '</ul>';
                    html += '</li>';
                }
                html += '</ul>';
                html += '</li>';
            }
        }
        html += '</ul>';
        html += '</div>';
        return html;
    }

    toJson() {
        var jsonArray = new Array();

        for (let i = 0; i < this.#quizes.length; i++) {
            jsonArray.push(this.#quizes[i].toJson());
        }

        return JSON.stringify({
            quizes: jsonArray
        });
    }

    addNewQuize(name) {
        var oldQuiz = 0;
        if (localStorage.getItem('Quizes') != null) {
            var data = JSON.parse(JSON.parse(localStorage.getItem('Quizes'))[0]);
            oldQuiz = data.quizes.length;
        }
        const quize = new Quize(this.#quizes.length + oldQuiz, name);
        quize.addQuestion('');
        this.#quizes.push(quize);
        return quize;
    }

    checkQuize(quize) {
        var isCorrect = true;
        quize.questions.forEach(q=>{
            if(q.checkCorrectAnswer() == false){
                isCorrect = false;
            }
        });

        if(isCorrect == true){
            quize.questions.forEach(q=>{
                if(q.getCountAnswer() < 4){
                    isCorrect = false;
                }
            });
        }

        return isCorrect;
    }

//Visas knappar för skapa quiz för skapa frågor och svar
    displayQuize(quize) {
        return `<div>
            <p>${quize.name}</p>
            <button id='button_${quize.id}' class="buttonCrt"> Lägg till fråga </button>
            <div>
                ${quize.questions.map(q => {
            return `<div>
                            <br>
                            <div>
                                <input name='question' type='text' data-q='${q.id}' id='text_q${quize.id}' placeholder='fråga ${q.id + 1}' 
                                    value='${q.text}'>
                                <br>
                                <br>
                            </div>
                            ${q.answers?.map(answ => {
                return `<input type='text' name='answer' data-q='${q.id}' data-a='${answ.id}' id='text_q${quize.id}qu${answ.id + 1}' placeholder='svar ${answ.id}' 
                                    value='${answ.text}' >
                                    ${answ.isCorrect ? 'ok' : '--------------'}
                                    <button data-q='${q.id}' data-a='${answ.id}' name='setAsCorrect' class="buttonCrt"> Ställ in som korrekt! </button>
                                    <br>`;
            }).join('\n') || ''}
                            <button name='button_add_answer' data-q='${q.id}'> + </button>

                    </div>`
        }).join('\n')}
                <br><br>
            </div>

        </div>`
    }
}

const quizeManager = new QuizeManager;
function init() {
    let currentQuize = new Quize('');
    const quizeName = document.getElementById('quizeName');
    const show = document.getElementById('show');

    const addQuestion = () => {
        show.innerHTML = quizeManager.displayQuize(currentQuize);
        
        document.getElementById(`button_${currentQuize.id}`).addEventListener('click', function () {
            currentQuize.addQuestion('');
            addQuestion();
        });
        
       
        document.getElementsByName(`button_add_answer`).forEach(el => {
            el.addEventListener('click', function (e) {
                currentQuize.questions[+e.target.getAttribute('data-q')].addAnswer('');
                addQuestion();
            })
        });

//Ändra text i textboxerna för frågor
        document.getElementsByName('question').forEach((el, key) => {
            el.addEventListener("keyup", function (event) {
                currentQuize.questions[+event.target.dataset.q].text = event.target.value;
                // console.log(currentQuize.questions[+el.name]);
            });
        });

//Ändra text i textboxerna för svar
            document.getElementsByName('answer').forEach(element => {
            element.addEventListener('keyup', function (event) {
                currentQuize.questions[+event.target.dataset.q].answers[+event.target.dataset.a].text = event.target.value;
            })

        });

        document.getElementsByName('setAsCorrect').forEach(element => {
            element.addEventListener('click', function (event) {
                const answer = currentQuize.questions[+event.target.dataset.q].answers[+event.target.dataset.a];
                currentQuize.questions[+event.target.dataset.q].setCorrectAnswer(answer);
                addQuestion();
            })
        })
    };

    document.getElementById('addNewQuize').addEventListener('click', function (e) {
        if(quizeManager.checkQuize(currentQuize) == true){
            currentQuize = quizeManager.addNewQuize(quizeName.value);
            addQuestion();
            alert('Mata in dina frågor och svar');
        }
        else {
            alert('Quiz Is Not Valid');
        }
    });

    document.getElementById('submit').addEventListener('click', function (e) {
        var questionCount = quizeManager.currentQuize.questions.length;
        var counterCorrect = 0;
        for(var item in quizeManager.currentQuize.questions){
            var question = quizeManager.currentQuize.questions[item];
            var correctAnswer = question.answers.forEach(ans=>{
                if(ans.isCorrect == true){
                    var checkedValue = null;
                    var questionElement = document.getElementById("" + quizeManager.currentQuize.id + question.id + "");
                    var inputElements = questionElement.querySelectorAll('[type="radio"][value="' + ans.id + '"]');
                    if (inputElements[0].checked) {
                        counterCorrect++;
                        document.getElementById("" + quizeManager.currentQuize.id + question.id + "").style.color = "green";
                    }
                    else{
                        document.getElementById("" + quizeManager.currentQuize.id + question.id + "").style.color = "red";
                    }
                }
            });
        }

        var html = '<p id="antal">Frågeantal = ' + questionCount + '</p>';
        html += '<p  id="antal">korrekt svarantal = ' + counterCorrect + '</p>';
        document.querySelector("#result-quize").innerHTML = html;
    });

    document.getElementById('cmdCreateYourQuiz').addEventListener('click', function (e) {
        if(quizeManager.checkQuize(currentQuize) == true){
            quizeManager.Save();
        }
        else {
            alert("Varje fråga ska ha minst 4 svaralternativ, försk igen.");
        }
    });

    document.getElementById('show-names').addEventListener('click', function (e) {
        // quizeManager.Show();
        quizeManager.ShowListOfQuize();
        var elements = document.getElementsByClassName("link2Quize");
        for (var i = 0; i < elements.length; i++) {
            elements[i].addEventListener('click', myFunction, false);
        }
    });

    var myFunction = function () {
        var id = this.getAttribute("data-id");
        quizeManager.showQuizeDetail(id);
    };
}

document.body.onload = function () {

    init();

    var urlParams = new URLSearchParams(window.location.search);
    var isAdmin = urlParams.get('isAdmin');
    if(isAdmin == "false"){
        document.getElementById("cmdCreateYourQuiz").classList.add("d-none");
        document.getElementById("quiz-name").classList.add("d-none");
    }
}