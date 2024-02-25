// Variables para seguir el estado del juego
let gameStarted = false; // Indica si el juego ha comenzado o no
let startTime; // Tiempo de inicio del juego
let intervalId; // ID del intervalo para actualizar el tiempo
let firstCard = null; // Primera tarjeta seleccionada
let secondCard = null; // Segunda tarjeta seleccionada
let moves = 0; // Contador de movimientos
let successes = 0; // Contador de aciertos
let cardValues = []; // Valores de las tarjetas

// Función para manejar el clic en una tarjeta
function handleCardClick(cardId) {
    // Verificar si el juego ha comenzado antes de procesar el clic en la tarjeta
    if (!gameStarted) {
        return;
    }
    playSound('./sounds/click.wav');

    const card = document.getElementById(cardId);
    // Si la tarjeta ya ha sido revelada o si ya se han seleccionado dos cartas, no hacemos nada
    if (card.getElementsByTagName('img').length > 0 || (firstCard !== null && secondCard !== null)) {
        return;
    }
    // Agrego clase a la otra parte del button
    if (card.classList.contains('card-flipped')) {
        card.classList.remove('card-flipped');
    } else {
        card.classList.add('card-flipped');
    }

    const index = parseInt(cardId.replace("card", ""));
    const img = document.createElement('img');
    img.src = `./images/icon-pack/${cardValues[index]}`;
    card.appendChild(img);
    card.classList.add('card-flipped');

    // Si es la primera tarjeta seleccionada
    if (firstCard === null) {
        firstCard = card;
    } else {
        // Si es la segunda tarjeta seleccionada
        secondCard = card;
        // Incrementar el contador de movimientos
        moves++;
        document.getElementById("movements").textContent = "Movements: " + moves;
        // Verificar si las tarjetas coinciden
        if (firstCard.getElementsByTagName('img')[0].src === secondCard.getElementsByTagName('img')[0].src) {
            successes++;
            document.getElementById("successes").textContent = "Successes: " + successes;
            playSound('./sounds/right.wav')
            // Reiniciar las tarjetas seleccionadas
            firstCard = null;
            secondCard = null;
            // Si todas las tarjetas han sido encontradas, el juego termina
            if (successes === 10) {
                clearInterval(intervalId); // Detener la actualización del tiempo
                const endTime = new Date();
                const elapsedTime = (endTime - startTime) / 1000; // Tiempo en segundos
                document.getElementById("wait-time").textContent = "Time: " + elapsedTime.toFixed(0) + "s";
                gameStarted = false
                playSound('./sounds/win.wav');
            }

        } else {
            // Si las tarjetas no coinciden, ocultarlas después de un breve tiempo
            setTimeout(() => {
                firstCard.removeChild(firstCard.getElementsByTagName('img')[0]);
                secondCard.removeChild(secondCard.getElementsByTagName('img')[0]);
                firstCard.classList.remove('card-flipped');
                secondCard.classList.remove('card-flipped');
                firstCard = null;
                secondCard = null;
            }, 1000);

            playSound('./sounds/wrong.wav');
        }
    }
}

// Función para inicializar el juego
function initializeGame() {
    // Marcar que el juego ha comenzado
    gameStarted = true;
    startTime = new Date();
    intervalId = setInterval(updateTime, 1000); // Actualizar el tiempo cada segundo

    // Deshabilitar el botón de comenzar juego
    document.getElementById('startGame').disabled = true;

    // Lista de nombres de archivo de imágenes
    const imageNames = [
        "bullbasaur.png",
        "game-console.png",
        "gamepad.png",
        "ghost.png",
        "jigglypuff.png",
        "meowth.png",
        "mushroom.png",
        "pikachu.png",
        "pokeball.png",
        "super-mario.png"
    ];

    // Duplicar la lista de nombres de archivo para formar pares
    const imagePairs = imageNames.concat(imageNames);

    // Barajar las rutas de las imágenes
    cardValues = shuffleArray(imagePairs);

    // Reiniciar variables de estado y contadores
    firstCard = null;
    secondCard = null;
    moves = 0;
    successes = 0;

    // Mostrar los movimientos y aciertos
    document.getElementById("movements").textContent = "Movements:  0";
    document.getElementById("successes").textContent = "Successes:  0";
    // Mostrar el tiempo inicial en  60 segundos
    document.getElementById("wait-time").textContent = "Time:  60s";

    // Asegurarse de que todas las cartas estén ocultas al inicio del juego
    const cards = document.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].innerHTML = ''; // Elimina cualquier contenido existente
        cards[i].classList.remove('card-flipped'); // Asegura que las cartas estén ocultas
    }

};

// Función para barajar un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

// Función para actualizar el marcador de tiempo
function updateTime() {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000; // Tiempo en segundos
    const remainingTime = 60 - elapsedTime; // Tiempo restante
    document.getElementById("wait-time").textContent = "Time: " + remainingTime.toFixed(0) + "s";

    // Si el tiempo llega a  0, detener el juego y poner audio de derrota
    if (remainingTime <= 0) {
        clearInterval(intervalId); // Detener la actualización del tiempo
        gameStarted = false; // Permitir reiniciar el juego
        playSound('./sounds/lose.wav');
        // Mostrar todas las cartas
        const cards = document.getElementsByClassName('card');
        for (let i = 0; i < cards.length; i++) {
            // Comprobar si la carta ya tiene una imagen
            if (cards[i].getElementsByTagName('img').length === 0) {
                const img = document.createElement('img');
                img.src = `./images/icon-pack/${cardValues[i]}`;
                cards[i].appendChild(img);
                cards[i].classList.add('card-flipped');
            }
        }
        // Deshabilitar interacciones
        disableCardInteractions();
    }
};


// Función para deshabilitar las interacciones con las cartas
function disableCardInteractions() {
    const cards = document.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].removeEventListener('click', handleCardClick);
    }
};

// Función para resetear el juego
function resetGame() {
    // Habilitar el botón de comenzar juego
    document.getElementById('startGame').disabled = false;

    location.reload();
}

function playSound(soundFile) {
    const audio = new Audio(soundFile);
    audio.play();
};