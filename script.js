let startBtn = document.querySelector('.startBtn'); 
let infoBox = document.querySelector('.infoBox'); 
let exitBtn = document.querySelector('.exitBtn');   
let continueBtn = document.querySelector('.ContinueBtn');  
let quizBox = document.querySelector('.Quiz-box');  
let questionText = document.querySelector('.questionText'); 
let allOptions = document.querySelectorAll('.options'); 
let nextBtn = document.querySelector('.nextBtn');  
let timeline = document.querySelector('.timeline'); 
let progressBar = document.querySelector('.progressBar');
let questionCounter = document.querySelector('.quix-footer-text');
let startButton = document.querySelector('.startButton');

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 15;
let timerInterval = null;
let userAnswer = null;
let timeOff = false;

startBtn.addEventListener('click', () => {
    infoBox.classList.add('activeInfoBox'); 
    startButton.style.display = 'none';
});   

exitBtn.addEventListener('click', () => {  
    infoBox.classList.remove('activeInfoBox'); 
    startButton.style.display = 'block';
});  

continueBtn.addEventListener('click', () => {  
    infoBox.classList.remove('activeInfoBox');
    quizBox.classList.add('activeQuizBox');  
    showQuestion(currentQuestionIndex);   
    startTimer(15); 
    updateQuestionCounter();
});    

nextBtn.addEventListener('click', () => { 
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        userAnswer = null;
        timeOff = false;
        resetOptions();
        showQuestion(currentQuestionIndex);
        startTimer(15);
        updateQuestionCounter();
        updateProgressBar();
        nextBtn.style.opacity = '0';
        nextBtn.style.pointerEvents = 'none';
        nextBtn.style.transform = 'scale(0.95)';
        nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Que';
    } else {
        showResultBox();
    }
});

// Function to show/render questions
const showQuestion = (index) => { 
    if (index >= questions.length) return;
    
    questionText.innerText = questions[index].numb + '. ' + questions[index].question;  

    for (let i = 0; i < allOptions.length; i++) {
        allOptions[i].innerText = questions[index].options[i];
        allOptions[i].setAttribute('data-option', questions[index].options[i]);
        allOptions[i].classList.remove('correct', 'incorrect', 'selected');
        allOptions[i].style.pointerEvents = 'auto';
        allOptions[i].style.cursor = 'pointer';
    }

    // Add click event listeners to options
    allOptions.forEach(option => {
        option.onclick = () => selectOption(option);
    });
};

// Function to handle option selection
const selectOption = (selectedOption) => {
    if (userAnswer !== null || timeOff) return;
    
    userAnswer = selectedOption.innerText;
    let correctAnswer = questions[currentQuestionIndex].answer;
    
    // Disable all options
    allOptions.forEach(option => {
        option.style.pointerEvents = 'none';
        if (option.innerText === correctAnswer) {
            option.classList.add('correct');
        }
    });
    
    // Mark selected option
    selectedOption.classList.add('selected');
    
    if (selectedOption.innerText === correctAnswer) {
        score++;
        selectedOption.classList.add('correct');
    } else {
        selectedOption.classList.add('incorrect');
    }
    
    // Show next button
    nextBtn.style.opacity = '1';
    nextBtn.style.pointerEvents = 'auto';
    nextBtn.style.transform = 'scale(1)';
    nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Que';
    
    // Stop timer
    clearInterval(timerInterval);
};

// Function to reset options styling
const resetOptions = () => {
    allOptions.forEach(option => {
        option.classList.remove('correct', 'incorrect', 'selected');
        option.style.pointerEvents = 'auto';
    });
};

// Function to handle timer
const startTimer = (time) => {
    timeLeft = time;
    timeline.innerText = timeLeft;
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timeline.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOff = true;
            timeline.innerText = '00';
            
            // Disable all options
            allOptions.forEach(option => {
                option.style.pointerEvents = 'none';
                if (option.innerText === questions[currentQuestionIndex].answer) {
                    option.classList.add('correct');
                }
            });
            
            // Show next button
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
            nextBtn.style.transform = 'scale(1)';
            nextBtn.innerText = currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next Que';
        }
    }, 1000);
};

// Function to update question counter
const updateQuestionCounter = () => {
    questionCounter.innerHTML = `<span class="highlighted-text">${currentQuestionIndex + 1}</span> of <span class="highlighted-text">${questions.length}</span> Questions`;
};

// Function to update progress bar
const updateProgressBar = () => {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBar.style.width = progress + '%';
};

// Function to show result box
const showResultBox = () => {
    clearInterval(timerInterval);
    quizBox.classList.remove('activeQuizBox');
    
    let resultBox = document.createElement('div');
    resultBox.className = 'resultBox';
    resultBox.innerHTML = `
        <div class="result-content">
            <div class="result-icon">
                <i class="fas fa-trophy"></i>
            </div>
            <div class="result-text">You've completed the Quiz!</div>
            <div class="score-text">
                <span>You got <span class="score-number">${score}</span> out of <span class="score-number">${questions.length}</span></span>
            </div>
            <div class="percentage-text">
                <span>Your score: <span class="percentage">${Math.round((score / questions.length) * 100)}%</span></span>
            </div>
            <div class="result-buttons">
                <button class="replayBtn">Replay Quiz</button>
                <button class="quitBtn">Quit Quiz</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(resultBox);
    
    // Show result box with animation
    setTimeout(() => {
        resultBox.classList.add('activeResultBox');
    }, 100);
    
    // Add event listeners for result buttons
    document.querySelector('.replayBtn').addEventListener('click', () => {
        location.reload();
    });
    
    document.querySelector('.quitBtn').addEventListener('click', () => {
        resultBox.remove();
        startButton.style.display = 'block';
    });
};

// Initialize progress bar
updateProgressBar();
