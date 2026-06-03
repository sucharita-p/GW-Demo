function simulateQR(){

document.getElementById("tvaInput")
.value="TVA123456";

document.getElementById("message")
.innerHTML="QR Scan Successful";

document.getElementById("message")
.style.color="green";

resetTimer();
}