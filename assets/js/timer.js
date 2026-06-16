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

            // document.getElementById("message").innerHTML = "Session expired";
            loadScreen("driver");

            resetTimer();
            startTimer(); // restart cycle
        }

    }, 1000);
}

startTimer();

function loadScreen(screenName) {
    let frame = document.getElementById("screenFrame");

    if (!frame) {
        let parentframe = window.parent.document.getElementById("screenFrame");
        if (!parentframe) {
            console.error("iframe not found");
            return;
        }
        frame = parentframe;
    }

    frame.src = "screens/" + screenName + ".html";
    console.log("Loading:", frame.src);
}