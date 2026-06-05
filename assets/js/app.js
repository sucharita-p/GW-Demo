const input = document.getElementById("inputdata");
const msg = document.getElementById("message");

function addDigit(n) {
    input.value += n;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = input.value.trim() === '';

    //resetTimer();
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

function loadClerkScreen(screenName) {
    const url =  screenName + ".html";

    console.log("Redirecting to:", url);

    // Navigate in the current window
    window.location.href = url;
}

function closePopup() {
    document.getElementById("exceptionPopup").style.display = "none";
}

function submitTVA() {
    let value = document.getElementById("inputdata").value.trim();

    if (value.length <= 5) {
        document.getElementById("exceptionPopup").style.display = "flex";
        return;
    }

    loadClerkScreen("driver");
    console.log("Submitted:", value);
}

function submitDriver() {
    let value = document.getElementById("inputdata").value.trim();

    if (value === "") {
        document.getElementById("exceptionPopup").style.display = "flex";
        return;
    }
    loadClerkScreen("inprogress");
    console.log("Driver Submitted:", value);
}

function openClerkDetail() {
    loadClerkScreen("clerkdetail");
    console.log("Queue detail opened");
}

document.addEventListener('DOMContentLoaded', function() {
    const thumbs = document.querySelectorAll('.thumb');
    const viewerImg = document.querySelector('.viewer img');
    thumbs.forEach(function(thumb) {
      thumb.addEventListener('click', function() {
        // Remove selection from all
        thumbs.forEach(t => t.classList.remove('selected-thumb'));
        // Add selection to clicked
        thumb.classList.add('selected-thumb');
        // Update viewer image
        const img = thumb.querySelector('img');
        if (img) viewerImg.src = img.src;
      });
    });
    // Optionally, select the first thumb by default
    if (thumbs[0]) thumbs[0].classList.add('selected-thumb');
  });