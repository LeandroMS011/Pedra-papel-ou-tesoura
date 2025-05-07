document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        startScreen: document.getElementById('startScreen'),
        ageScreen: document.getElementById('ageScreen'),
        gameScreen: document.getElementById('gameScreen'),
        resultScreen: document.getElementById('resultScreen'),
        ageMessage: document.getElementById('ageMessage'),
        startButton: document.getElementById('startButton'),
        confirmAge: document.getElementById('confirmAge'),
        ageInput: document.getElementById('ageInput'),
        playAgain: document.getElementById('playAgain'),
        playerChoiceIcon: document.getElementById('playerChoiceIcon'),
        computerChoiceIcon: document.getElementById('computerChoiceIcon'),
        resultText: document.getElementById('resultText'),
        choiceButtons: document.querySelectorAll('.choice-btn'),
        mainContent: document.getElementById('main-content')
    };

    const choices = {
        1: { name: 'Pedra', emoji: '✊', label: 'Você escolheu Pedra' },
        2: { name: 'Papel', emoji: '✋', label: 'Você escolheu Papel' },
        3: { name: 'Tesoura', emoji: '✌️', label: 'Você escolheu Tesoura' }
    };

    function init() {
        setupEventListeners();
        elements.startButton.focus();
    }

    function setupEventListeners() {
        elements.startButton.addEventListener('click', showAgeScreen);
        elements.confirmAge.addEventListener('click', checkAge);
        elements.playAgain.addEventListener('click', resetGame);
        elements.ageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAge();
        });

        elements.choiceButtons.forEach(button => {
            button.addEventListener('click', () => {
                const choice = parseInt(button.dataset.choice);
                playGame(choice);
            });
        });
    }

    function showAgeScreen() {
        elements.startScreen.classList.add('hidden');
        elements.ageScreen.classList.remove('hidden');
        elements.ageInput.focus();
    }

    function checkAge() {
        const age = parseInt(elements.ageInput.value);
        
        if (isNaN(age)) {
            showMessage('Por favor, digite uma idade válida!', true);
            return;
        }
        
        if (age < 18) {
            showMessage('Sinto muito, mas você é menor de idade e NÃO PODE JOGAR!', true);
            setTimeout(() => {
                elements.startScreen.classList.remove('hidden');
                elements.ageScreen.classList.add('hidden');
                elements.startButton.focus();
            }, 3000);
            return;
        }
        
        startGame();
    }

    function showMessage(message, isError = false) {
        elements.ageMessage.textContent = message;
        elements.ageMessage.style.color = isError ? '#ff6b6b' : '#1ABC9C';
        elements.ageMessage.classList.remove('hidden');
        
        elements.ageMessage.setAttribute('aria-hidden', 'false');
        
        setTimeout(() => {
            elements.ageMessage.classList.add('hidden');
            elements.ageMessage.setAttribute('aria-hidden', 'true');
        }, 3000);
    }

    function startGame() {
        elements.ageScreen.classList.add('hidden');
        elements.gameScreen.classList.remove('hidden');
        elements.choiceButtons[0].focus();
    }

    function playGame(choice) {
        const playerChoice = choice;
        const computerChoice = Math.floor(Math.random() * 3) + 1;
        
        elements.playerChoiceIcon.textContent = choices[playerChoice].emoji;
        elements.playerChoiceIcon.setAttribute('aria-label', choices[playerChoice].label);
        elements.computerChoiceIcon.textContent = choices[computerChoice].emoji;
        elements.computerChoiceIcon.setAttribute('aria-label', `Computador escolheu ${choices[computerChoice].name}`);
        
        const result = calculateResult(playerChoice, computerChoice);
        elements.resultText.textContent = result.text;
        elements.resultText.setAttribute('aria-live', 'polite');
        
        elements.gameScreen.classList.add('hidden');
        elements.resultScreen.classList.remove('hidden');
        elements.playAgain.focus();
        
        announceResult(result);
    }

    function calculateResult(player, computer) {
        if (player === computer) {
            return { 
                text: 'Empate!',
                announcement: `Empate! Ambos escolheram ${choices[player].name}`
            };
        }
        
        const winConditions = [
            [1, 3], // Pedra vence tesoura
            [2, 1], // Papel vence pedra
            [3, 2]  // Tesoura vence papel
        ];
        
        const playerWins = winConditions.some(([a, b]) => 
            player === a && computer === b);
        
        if (playerWins) {
            return {
                text: 'VOCÊ VENCEU!',
                announcement: `Você venceu! ${choices[player].name} vence ${choices[computer].name}`
            };
        }
        
        return {
            text: 'Você perdeu!',
            announcement: `Você perdeu! ${choices[computer].name} vence ${choices[player].name}`
        };
    }

    function announceResult(result) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'sr-only';
        announcement.textContent = result.announcement;
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 100);
    }

    function resetGame() {
        elements.resultScreen.classList.add('hidden');
        elements.gameScreen.classList.remove('hidden');
        elements.choiceButtons[0].focus();
        
        elements.playerChoiceIcon.textContent = '';
        elements.playerChoiceIcon.removeAttribute('aria-label');
        elements.computerChoiceIcon.textContent = '';
        elements.computerChoiceIcon.removeAttribute('aria-label');
        elements.resultText.textContent = '';
    }

    init();
});