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

    const card = document.getElementById(cardId);
    // Si la tarjeta ya ha sido revelada o si ya se han seleccionado dos cartas, no hacemos nada
    if (card.getElementsByTagName('img').length > 0 || (firstCard !== null && secondCard !== null)) {
        return;
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
            // Reiniciar las tarjetas seleccionadas
            firstCard = null;
            secondCard = null;
            // Si todas las tarjetas han sido encontradas, el juego termina
            if (successes === 10) {
                clearInterval(intervalId); // Detener la actualización del tiempo
                const endTime = new Date();
                const elapsedTime = (endTime - startTime) / 1000; // Tiempo en segundos
                document.getElementById("wait-time").textContent = "Time: " + elapsedTime.toFixed(0) + "s";
                alert("¡Felicidades! Has ganado el juego.");
                gameStarted = false; // Permitir reiniciar el juego
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
        }
    }
}

// Función para inicializar el juego
function initializeGame() {
    // Si el juego ya ha comenzado, no hacemos nada
    if (gameStarted) {
        return;
    }

    // Marcar que el juego ha comenzado
    gameStarted = true;
    startTime = new Date();
    intervalId = setInterval(updateTime, 1000); // Actualizar el tiempo cada segundo

    // Lista de nombres de archivo de tus imágenes
    const imageNames = [
        "angry-birds.png",
        "another-console.png",
        "bullbasaur.png",
        "game-console.png",
        "gamepad.png",
        "gamer.png",
        "ghost.png",
        "jigglypuff.png",
        "meowth.png",
        "mushroom.png",
        "pikachu.png",
        "player.png",
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
    document.getElementById("wait-time").textContent = "Time:  0s";
}

// Función para barajar un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Función para actualizar el marcador de tiempo
function updateTime() {
    const currentTime = new Date();
    const elapsedTime = (currentTime - startTime) / 1000; // Tiempo en segundos
    document.getElementById("wait-time").textContent = "Time: " + elapsedTime.toFixed(0) + "s";

    // Si el tiempo supera los  60 segundos, detener el juego y mostrar un mensaje de derrota
    if (elapsedTime >= 130) {
        clearInterval(intervalId); // Detener la actualización del tiempo
        alert("¡Tiempo agotado! Has perdido el juego.");
        gameStarted = false; // Permitir reiniciar el juego
    }
}

