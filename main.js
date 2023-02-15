//select elements

let countSpan = document.querySelector(".count  span");
let bulletsSpanContianer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".sumbit-button");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");


//Set Options 
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;


            //Create Bullets + Set Questions Count 
            createBullets(questionsCount);
            //Add Question Data
            addQuestionData(questionsObject[currentIndex], questionsCount);

            //Start Down 
            countdown(3, questionsCount);

            //Click On Submit
            submitButton.onclick = () => {

                //Get Right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;

                //Increase Index
                currentIndex++;

                //Check The Answer 
                checkAnswer(theRightAnswer, questionsCount);

                //Remove Old Question
                quizArea.innerHTML = '';
                answerArea.innerHTML = '';

                //Add Question Data
                addQuestionData(questionsObject[currentIndex], questionsCount);

                ////Hndel Bullets Class
                HandleBullets();

                //Start CountDwon
                clearInterval(countdownInterval);
                countdown(3, questionsCount);

                //Show Results 
                showResults(questionsCount);
            };
        }
    };

    myRequest.open("GET", "html-question.json", true);
    myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    //Create spans 
    for (let i = 0; i < num; i++) {
        //Create Bullet 
        let theBullet = document.createElement("span");
        //check if first question 
        if (i === 0) {
            theBullet.className = 'on';
        }

        //Append Bullets To Main Bullets Container
        bulletsSpanContianer.appendChild(theBullet);
    }
}




function addQuestionData(obj, count) {
    if (currentIndex < count) {


        //Create h2 Question Tittle
        let questionTitle = document.createElement("h2");

        //Create Question Text 
        let questionText = document.createTextNode(obj['title']);

        //Append Text To H2 
        questionTitle.appendChild(questionText);

        //Append The H2 To The Quiz Area 
        quizArea.appendChild(questionTitle);

        //Create The Answers
        for (let i = 1; i <= 4; i++) {

            //Create Main Answer Div 
            let mainDiv = document.createElement("div");

            //Add Class Div Main 
            mainDiv.className = 'answer';

            //Create Radio Input
            let radioInput = document.createElement("input");

            //Add Type + Name +Id + Data-Attribute
            radioInput.name = 'question';
            radioInput.type = 'radio';
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            // Create Lable 
            let theLabel = document.createElement("label");

            //Add For Attribute

            theLabel.htmlFor = `answer_${i}`;

            //Create Label Text

            let theLabeText = document.createTextNode(obj[`answer_${i}`]);

            //Add The Text To Label 
            theLabel.appendChild(theLabeText);

            //Add Input  +  Label To Main Div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            //Append All Divs To Answers Area
            answerArea.appendChild(mainDiv);
        }
    }
};

function checkAnswer(rAnswer, count) {
    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (rAnswer === theChoosenAnswer) {
        rightAnswers++;
    }
}

function HandleBullets() {

    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span, index) => {

        if (currentIndex === index) {
            span.className = 'on';
        }
    })

}

function showResults(count) {

    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > count / 2 && rightAnswers < count) {
            theResults = `<span class = "good"> Good</span>, ${rightAnswers} from ${count} Is Good`;
        } else if (rightAnswers === count) {
            theResults = `<span class = "Perfect">Perfect</span>, All Answers Is Good`;
        } else {
            theResults = `<span class = "bad">Bad</span>, ${rightAnswers} from ${count}`;
        }

        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = '10px';
        resultsContainer.style.backgroundColor = 'wihte';
        resultsContainer.style.marginTop = '10px';
        resultsContainer.style.fontSize = '20px';
    }
}

function countdown(duration, count) {
    if (currentIndex < count) {
        let minutes, seconds;
        countdownInterval = setInterval(function () {

            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;


            countdownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countdownInterval);
                submitButton.click();  
            }
        }, 1000);
    }
}