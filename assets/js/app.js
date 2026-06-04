const input = document.getElementById("inputdata");
const msg = document.getElementById("message");

function addDigit(n) {
    input.value += n;
    resetTimer();
}

function backspace() {
    input.value = input.value.slice(0, -1);
    resetTimer();
}

function clearInput() {
    input.value = "";
    msg.innerHTML = "";
    resetTimer();
}

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

function closePopup() {
    document.getElementById("exceptionPopup").style.display = "none";
}

function submitTVA() {
    let value = document.getElementById("inputdata").value.trim();

    if (value === "") {
        document.getElementById("exceptionPopup").style.display = "flex";
        return;
    }

    loadScreen("driver");
    console.log("Submitted:", value);
}

function submitDriver() {
    let value = document.getElementById("inputdata").value.trim();

    if (value === "") {
        document.getElementById("exceptionPopup").style.display = "flex";
        return;
    }
    loadScreen("inprogress");
    console.log("Driver Submitted:", value);
}

function openQueueDetail() {
    loadScreen("queue-detail");
    console.log("Queue detail opened");
}