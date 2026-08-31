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
    const url = screenName + ".html";

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

    sessionStorage.setItem('tvaStartTime', Date.now());
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

document.addEventListener('DOMContentLoaded', function () {
    const thumbs = document.querySelectorAll('.thumb');
    const viewerImg = document.querySelector('.viewer img');
    thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
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
    validateRIForm();
    startDurationTimer('00002113');
    handleSubmittedRow();
    initViewerControls();
    initQueuePage();

    const tabSensitiveInputs = document.querySelectorAll(".tab-sensitive");

    tabSensitiveInputs.forEach(input => {
        input.addEventListener("keydown", handleGenericTabAction);
    });
});

function handleGenericTabAction(event) {
    if (event.key === "Tab") {
        event.preventDefault(); // Stop the focus from jumping to the next box

        // "event.target" tells you EXACTLY which input element was being used
        const targetedInput = event.target;
        targetedInput.style.border = "2px solid #04b404"; // Highlight the input field

        if (targetedInput.id === 'inputISO') {
            validateRIForm();
        }

        if (targetedInput.id === 'inputContainer') {
            validateRIForm();
        }
    }
}

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

function validateRIForm() {
    const iso = document.getElementById('inputISO');
    const container = document.getElementById('inputContainer');
    const errorBox = document.getElementById('error-box-ri');
    const submitBtn = document.getElementById('submitBtn');

    if (!iso || !errorBox || !submitBtn) return;

    const isoVal = iso.value.trim();
    const containerVal = container ? container.value.trim() : '';

    const isContainerScenario = sessionStorage.getItem('isManualContainer') === 'true';

    let hasError = false;
    let errorMsg = '';

    if (isContainerScenario) {
        // Container scenario: error while container still has the incorrect value
        hasError = (containerVal === '' || containerVal === 'ESDU332274');
        errorMsg = 'Move Errors:<br><br>- Container number ' + containerVal + ' is incorrect';
    } else {
        // ISO scenario (default): error while ISO still has the mismatch value
        hasError = (isoVal === '' || isoVal === '2G1');
        errorMsg = 'Move Errors:<br><br>- Container ' + containerVal + ' has ISO Code 2G1 mismatch';
    }

    if (hasError) {
        errorBox.innerHTML = errorMsg;
        submitBtn.disabled = true;
        submitBtn.classList.remove('btn-submit-ready');
        setActiveModeReady(false);
        // Highlight the problematic field
        if (iso) iso.style.border = isContainerScenario ? '2px solid #04b404' : '2px solid red';
        if (container) container.style.border = isContainerScenario ? '2px solid red' : '2px solid #04b404';
    } else {
        errorBox.innerHTML = '';
        submitBtn.disabled = false;
        submitBtn.classList.add('btn-submit-ready');
        setActiveModeReady(true);
        // Both fields green when cleared
        if (iso) iso.style.border = '2px solid #04b404';
        if (container) container.style.border = '2px solid #04b404';
    }
}

function setActiveModeReady(ready) {
    const riBox = document.getElementById('mode-ri');
    const diBox = document.getElementById('mode-di');
    const activeBox = (riBox && riBox.classList.contains('active-mode')) ? riBox : diBox;
    if (!activeBox) return;

    if (ready) {
        activeBox.classList.add('mode-box-ready');
    } else {
        activeBox.classList.remove('mode-box-ready');
    }

    // Swap the RI icon between red and green version
    if (riBox) {
        const riImg = riBox.querySelector('img');
        if (riImg) {
            riImg.src = ready
                ? '../assets/images/import.png'
                : '../assets/images/importRed.png';
        }
    }
}

function submitClerkDetail() {
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn && submitBtn.disabled) return;

    const gatePassEl = document.getElementById('gatePassValue');
    if (gatePassEl) {
        sessionStorage.setItem('submittedGatePass', gatePassEl.textContent.trim());
    }
    loadClerkScreen('queuedetail');
}

function forceClerkNavigate() {
    const gatePassEl = document.getElementById('gatePassValue');
    if (gatePassEl) {
        sessionStorage.setItem('submittedGatePass', gatePassEl.textContent.trim());
    }
    loadClerkScreen('queuedetail');
}

function backToQueue() {
    // Navigate back without triggering the Leaving/clear flow
    loadClerkScreen('queuedetail');
}

function initViewerControls() {
    const viewerImg = document.querySelector('.viewer img');
    if (!viewerImg) return;

    let scale = 1;
    let tx = 0;
    let ty = 0;
    const PAN_STEP = 30;
    const ZOOM_STEP = 0.2;
    const MIN_SCALE = 0.5;
    const MAX_SCALE = 5;

    function applyTransform() {
        viewerImg.style.transform = 'scale(' + scale + ') translate(' + tx + 'px, ' + ty + 'px)';
    }

    function bindBtn(selector, handler) {
        const el = document.querySelector(selector);
        if (el) el.addEventListener('click', handler);
    }

    bindBtn('.btn-left', function () { tx -= PAN_STEP; applyTransform(); });
    bindBtn('.btn-right', function () { tx += PAN_STEP; applyTransform(); });
    bindBtn('.btn-up', function () { ty -= PAN_STEP; applyTransform(); });
    bindBtn('.btn-down', function () { ty += PAN_STEP; applyTransform(); });
    bindBtn('.btn-zoom-in', function () { scale = Math.min(MAX_SCALE, parseFloat((scale + ZOOM_STEP).toFixed(2))); applyTransform(); });
    bindBtn('.btn-zoom-out', function () { scale = Math.max(MIN_SCALE, parseFloat((scale - ZOOM_STEP).toFixed(2))); applyTransform(); });
    bindBtn('.btn-action', function () { scale = 1; tx = 0; ty = 0; applyTransform(); }); // centre/reset

    // Reset transform when thumbnail changes
    document.querySelectorAll('.thumb').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
            scale = 1; tx = 0; ty = 0; applyTransform();
        });
    });
}

function isQueueEmpty() {
    const row = document.getElementById('row-00002113');
    if (!row) return true;
    const cells = row.querySelectorAll('td');
    // Check all cells except Lane Name (index 0)
    for (let i = 1; i < cells.length; i++) {
        if (cells[i].textContent.trim() !== '') return false;
    }
    return true;
}

function closeQueueScreen() {
    window.location.href = '../index.html';
}

function initQueuePage() {
    const isQueueScreen = !!document.querySelector('.close-btn');
    const isKioskTicketScreen = !!document.querySelector('.instruction-bar');

    if (!isQueueScreen && !isKioskTicketScreen) return;

    // Push a state with full URL so popstate fires reliably on back
    history.pushState({ page: 'intercepted' }, document.title, window.location.href);

    window.addEventListener('popstate', function () {
        if (isQueueScreen && !isQueueEmpty()) return; // stay if queue still has data
        var base = window.location.href.replace(/\/screens\/[^/]+$/, '');
        window.location.href = base + '/index.html';
    });
}

function handleSubmittedRow() {
    const gatePass = sessionStorage.getItem('submittedGatePass');
    if (!gatePass) return;

    sessionStorage.removeItem('submittedGatePass');

    const statusCell = document.getElementById('status-' + gatePass);
    const row = document.getElementById('row-' + gatePass);
    if (!statusCell || !row) return;

    // Stop the live timer and freeze the final duration
    if (window._durationInterval) {
        clearInterval(window._durationInterval);
        window._durationInterval = null;
    }
    sessionStorage.removeItem('tvaStartTime');

    statusCell.textContent = 'Leaving';
    statusCell.style.color = '#ff9800';

    setTimeout(function () {
        const cells = row.querySelectorAll('td');
        cells.forEach(function (td, index) {
            if (index !== 0) td.textContent = '';
        });
        row.classList.remove('clickable');
        row.removeAttribute('ondblclick');
        row.removeAttribute('title');
        const waitingCount = document.getElementById('waitingCount');
        if (waitingCount) waitingCount.textContent = 'Transaction(s) waiting for clerk : 0';
    }, 3000);
}

function startDurationTimer(gatePass) {
    const startTime = parseInt(sessionStorage.getItem('tvaStartTime'), 10);
    if (!startTime) return;

    const cell = document.getElementById('duration-' + gatePass);
    if (!cell) return;

    function formatElapsed() {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const h = Math.floor(elapsed / 3600);
        const m = Math.floor((elapsed % 3600) / 60);
        const s = elapsed % 60;
        return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }

    cell.textContent = formatElapsed();
    window._durationInterval = setInterval(function () {
        cell.textContent = formatElapsed();
    }, 1000);
}

function clearErrors(mode) {
    const box = document.getElementById('error-box-' + mode);
    if (box) box.innerHTML = '';

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.add('btn-submit-ready');
    }
    setActiveModeReady(true);
}

function selectMode(mode) {
    const riControls = document.getElementById('move-controls-ri');
    const diControls = document.getElementById('move-controls-di');
    const riBox = document.getElementById('mode-ri');
    const diBox = document.getElementById('mode-di');

    if (mode === 'ri') {
        riControls.style.display = '';
        diControls.style.display = 'none';
        riBox.classList.add('active-mode');
        diBox.classList.remove('active-mode');
        validateRIForm();
    } else {
        riControls.style.display = 'none';
        diControls.style.display = '';
        diBox.classList.add('active-mode');
        riBox.classList.remove('active-mode');
    }
}

function updateTableTextBasedOnSession() {
    const textCell = document.getElementById("reasonText");
    const inputISOCell = document.getElementById("inputISO");
    const inputContainerCell = document.getElementById("inputContainer");

    //Conditional logic to change text based on the storage value
    if (sessionStorage.getItem("isManualISO") === "true") {
        if (textCell)
            textCell.textContent = "OCR ISO Code";
        if (!inputISOCell) return;
        inputContainerCell.value = 'ESDU3322743';
        inputISOCell.value = '2G1';
        inputISOCell.style.border = "2px solid red"; // Highlight the input field
        inputContainerCell.style.border = "2px solid #04b404"; // Reset the other input field's border

    } else if (sessionStorage.getItem("isManualContainer") === "true") {
        if (textCell)
            textCell.textContent = "OCR Container";
        if (!inputContainerCell) return;
        inputContainerCell.value = 'ESDU332274';
        inputISOCell.value = '22G1';
        inputContainerCell.style.border = "2px solid red"; // Highlight the input field
        inputISOCell.style.border = "2px solid #04b404"; // Reset the other input field's border
    } else {
        // Fallback default value if sessionStorage is empty or doesn't match
        textCell.textContent = "";
    }
}

