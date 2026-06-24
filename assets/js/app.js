const input = document.getElementById("inputdata");
const msg = document.getElementById("message");

function getSubmitButton() {
    return document.getElementById("submitBtn") || document.getElementById("SubmitBtn");
}

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
    updateTableTextBasedOnSession();
  });

  function fixerrors(element_Id) {
    let value = document.getElementById(element_Id).value.trim();

        document.getElementById(element_Id).style.borderColor = "#04b404";
        document.getElementsByClassName("mode-box red")[0].querySelector("img").src = "../assets/images/import.png";
        document.getElementsByClassName("mode-box red")[0].classList.remove("red");
        document.getElementsByClassName("mode-box")[0].classList.add("green");
        document.getElementsByClassName("error-box")[0].textContent = "";
        const submitBtn = getSubmitButton();
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.backgroundColor = "#19b40454";
        }
        return;
}

const inputEl = document.getElementById('inputISO');
if (inputEl) {
    inputEl.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            fixerrors('inputISO');
        }
    });
}

const inputE2 = document.getElementById('inputContainer');
if (inputE2) {
    inputE2.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            fixerrors('inputContainer');
        }
    });
}

  function openKioskTicketScreen() {

     const url =  "kioskticketscreen" + ".html";

    console.log("Redirecting to:", url);

    // Navigate in the current window
    window.location.href = url;

};


  // 1. Global Boolean Variables
  let isAuto = true;
  let isManualISO = false;
  let isManualContainer = false;

  // 2. Update variables instantly when dropdown selection changes
  function updateGlobalFlags() {
      const selection = document.getElementById("pageSelector").value;

      switch (selection) {
        case "auto":
          isAuto = true;
          isManualISO = false;
          isManualContainer = false;
          break;
        case "manualIso":
          isAuto = false;
          isManualISO = true;
          isManualContainer = false;
          break;
        case "manualContainer":
          isAuto = false;
          isManualISO = false;
          isManualContainer = true;
          break;
        default:
          isAuto = true;
          isManualISO = false;
          isManualContainer = false;
          break;
      }
  }

  // 3. Handle redirect logic when button is clicked
  function handleRedirect() {
    // Save to sessionStorage before redirecting (converts booleans to strings)
    sessionStorage.setItem("isAuto", isAuto);
    sessionStorage.setItem("isManualISO", isManualISO);
    sessionStorage.setItem("isManualContainer", isManualContainer);
    loadClerkScreen("screens/tva");
  }

function updateTableTextBasedOnSession() {
    const textCell = document.getElementById("reasonText");
    const inputISOCell = document.getElementById("inputISO");
    const inputContainerCell = document.getElementById("inputContainer");
    const errorBox = document.getElementById("errorBox");

    //Conditional logic to change text based on the storage value
    if (sessionStorage.getItem("isManualISO") === "true") {
        if (textCell)  
            textCell.textContent = "OCR ISO Code";
        if (!inputISOCell) return; 
            inputISOCell.style.border = "2px solid red"; // Highlight the input field
            inputContainerCell.style.border = "2px solid #04b404"; // Reset the other input field's border
            errorBox.innerHTML = "Move Errors:<br><br>- Container MSMU7441730 has ISO Code 45G0 mismatch"; // Set the error message

    } else if (sessionStorage.getItem("isManualContainer") == "true") {
        if (textCell)  
            textCell.textContent = "OCR Container";
        if (!inputContainerCell) return; 
            inputContainerCell.style.border = "2px solid red"; // Highlight the input field
            inputISOCell.style.border = "2px solid #04b404"; // Reset the other input field's border
            errorBox.innerHTML = "Move Errors:<br><br>- Container number is incorrect"; // Set the error message
    } else {
        // Fallback default value if sessionStorage is empty or doesn't match
        textCell.textContent = ""; 
    }
}