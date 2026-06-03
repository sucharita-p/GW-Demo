let countdown = 30;
let timer;

function formatTime(seconds) {
    let mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    let secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
}

function resetTimer() {
    countdown = 30;
    document.getElementById("countdown").innerHTML = formatTime(countdown);
}

function startTimer() {

    clearInterval(timer);

    timer = setInterval(() => {

        countdown--;

        document.getElementById("countdown").innerHTML = formatTime(countdown);

        if (countdown <= 0) {

            clearInterval(timer);

            clearInput();

            document.getElementById("message").innerHTML = "Session expired";

            resetTimer();
            startTimer(); // restart cycle
        }

    }, 1000);
}

startTimer();