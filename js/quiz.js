//tar properties för QUIZ och sätta i metoder för lägga till frågor och konvertera till json
class Quize {
    #questions = [];
    #id = 0;
    #name = '';

    constructor(id, name) {
        this.#id = id;
        this.#name = name;
    }

    addQuestion(question) {
        this.#questions.push(new Question(this.#questions.length, question));
    }

    get questions() {
        return this.#questions;
    }

    get name() {
        return this.#name;
    }

    get id() {
        return this.#id;
    }

    toJson(){
        var jsonArray = new Array();

        for(let i=0;i<this.#questions.length;i++){
            jsonArray.push(this.#questions[i].toJson());
        }

        return{
            id: this.#id,
            name: this.#name,
            questions: jsonArray
        };
    }
}

//tar properties för FRÅGOR och sätta i metoder för lägga till frågor och konvertera till json
class Question {
    #answers = [];
    #name = '';
    #id = 0;
    
    constructor(id) {
        this.#id = id;
    }
    
    get text() {
        return this.#name;
    }

    set text(val) {
        this.#name = val;
    }

    get id() {
        return this.#id;
    }

    get answers() {
        return this.#answers;
    }

    checkCorrectAnswer(){
        var existCorrect = false;
        this.#answers.forEach(ans=>{
            if(ans.isCorrect == true){
                existCorrect = true;
            }
        });
        return existCorrect;
    }

    getCountAnswer(){
        var counter = 0;
        this.#answers.forEach(ans=>{
            counter++;
        });
        return counter;
    }

    setCorrectAnswer(answer) {
        this.#answers.forEach(ans => {
            ans.isCorrect = ans === answer;
        });
    }

    addAnswer(answer) {
        this.#answers.push(new Answer(this.#answers.length, answer));
    }

    toJson(){
        var jsonArray = new Array();

        for(let i=0;i<this.#answers.length;i++){
            jsonArray.push(this.#answers[i].toJson());
        }

        return{
            id: this.#id,
            name: this.#name,
            answers: jsonArray
        };
    }
}

//tar properties för SVAR och sätta i metoder för lägga till frågor och konvertera till json
class Answer {
    #name = '';
    #id = 0;
    #isCorrect = false;

    constructor(id, text) {
        this.#id = id;
        this.#name = text;
    }

    set isCorrect(val) {
        this.#isCorrect = val;
    }

    get isCorrect() {
        return this.#isCorrect;
    }

    get text() {
        return this.#name;
    }

    set text(val) {
        this.#name = val;
    }

    get id() {
        return this.#id;
    }

    toJson(){
        return{
            id: this.#id,
            name: this.#name,
            isCorrect: this.#isCorrect
        }
    }
}