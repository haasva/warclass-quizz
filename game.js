let adventurersData = [];
let adventurersByArea = {};
let score = 0;
let lives = 3;
const result = document.getElementById('result-message');

// Load JSON data
async function loadJSONData() {
    const adventurersResponse = await fetch('/JSONData/adventurers.json');
    const areasResponse = await fetch('/JSONData/adventurers_by_area.json');
    adventurersData = await adventurersResponse.json();
    adventurersByArea = await areasResponse.json();

    startGame();
}

function startGame() {
    nextQuestion();
}

// Generate a random question type and display it
function nextQuestion() {

    if (lives <= 0) {
        alert("Game Over! Your score: " + score);
        return;
    }

    const adventurer = getRandomAdventurer();
    const questionType = Math.floor(Math.random() * 3) + 1;
    let question, correctAnswer, answerOptions;

    const advPic = document.getElementById('adv-pic');
    advPic.style.backgroundImage = `url('Art/Adventurers/${adventurer.Title}.png')`;

    switch (questionType) {
        case 1:
            ({ question, correctAnswer, answerOptions } = generateTitleQuestion(adventurer));
            break;
        case 2:
            ({ question, correctAnswer, answerOptions } = generateAreaQuestion(adventurer));
            break;
        case 3:
            ({ question, correctAnswer, answerOptions } = generateCultureQuestion(adventurer));
            break;
    }

    displayQuestion(question, correctAnswer, answerOptions);
}

// Generate a question about the adventurer's Title
function generateTitleQuestion(adventurer) {
    
    const question = `Title?`;
    const correctAnswer = adventurer.Title;
    const answerOptions = getRandomOptions('Title', correctAnswer);

    return { question, correctAnswer, answerOptions };
}

// Generate a question about the adventurer's Area
function generateAreaQuestion(adventurer) {
    const question = `Area?`;
    const correctAnswer = findAdventurerArea(adventurer.Title);
    const answerOptions = getRandomOptions('Area', correctAnswer);

    return { question, correctAnswer, answerOptions };
}

// Generate a question about the adventurer's Culture
function generateCultureQuestion(adventurer) {
    // Check if the adventurer has multiple cultures and split them into an array
    let cultures = adventurer.Culture.includes(',') ? adventurer.Culture.split(',').map(c => c.trim()) : [adventurer.Culture];

    // Randomly pick one of the cultures as the correct answer
    const correctAnswer = cultures[Math.floor(Math.random() * cultures.length)];
    
    // Generate answer options, using the selected culture as the correct one
    const answerOptions = getRandomOptions('Culture', correctAnswer);

    // Create the question
    const question = `Culture?`;

    return { question, correctAnswer, answerOptions };
}


// Display the question and answer options
function displayQuestion(question, correctAnswer, answerOptions) {
    document.getElementById('question').innerText = question;
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    answerOptions.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.innerText = answer;
        button.onclick = () => handleAnswerClick(answer, correctAnswer);
        answersContainer.appendChild(button);
    });
}

// Handle answer click
function handleAnswerClick(selectedAnswer, correctAnswer) {


    if (selectedAnswer === correctAnswer) {
        score++;
        document.getElementById('score').innerText = score;
        result.textContent = 'Correct!';
        result.style.opacity = '1';
    } else {
        lives--;
        document.getElementById('lives').innerText = lives;
        result.textContent = 'Wrong!';
        result.style.opacity = '1';
    }

    
    setTimeout(() => {
        result.textContent = '';
        result.style.opacity = '0';
        nextQuestion();
    }, 700);

}

// Utility functions
function getRandomAdventurer() {
    return adventurersData[Math.floor(Math.random() * adventurersData.length)];
}

function findAdventurerArea(title) {
    for (const area in adventurersByArea) {
        if (adventurersByArea[area].includes(title)) {
            return area;
        }
    }
    return null;
}

function getRandomOptions(property, correctAnswer) {
    const options = new Set([correctAnswer]);

    while (options.size < 4) {
        let randomAdventurer = getRandomAdventurer();
        
        if (property === 'Title') {
            options.add(randomAdventurer.Title);
        } else if (property === 'Culture') {
            // Handle multiple cultures, splitting by comma and trimming whitespace
            let cultures = randomAdventurer.Culture.includes(',') 
                ? randomAdventurer.Culture.split(',').map(c => c.trim()) 
                : [randomAdventurer.Culture];
            
            // Randomly pick one of the cultures to add as an option
            const randomCulture = cultures[Math.floor(Math.random() * cultures.length)];
            options.add(randomCulture);
        } else if (property === 'Area') {
            options.add(findAdventurerArea(randomAdventurer.Title));
        }
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
}


// Initialize game by loading JSON data
loadJSONData();
