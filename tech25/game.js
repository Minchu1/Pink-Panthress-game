window.gameStartTime = Date.now(); 

let stage = 1;
let clickCount = 0;
let clickTimer = null;

function answerYes() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');

  if (stage === 1) {
    q.textContent =  "Do you want to gather intel?";
    stage = 2;
  } else if (stage === 2) {
    q.textContent = "You discover guard patterns, cameras and a locker room. You find an old tunnel that is unguarded.";
    stage = 3;
    choices.innerHTML = `
      <button class="game-btn" onclick="inspectBrick()">Inspect weird brick</button>
      <button class="game-btn" onclick="fail('You tripped the alarm by walking right in!')">Ignore brick, walk right in</button>
    `;
  } else if (stage === 4) {
    // continue success path after finding uniform etc later
  }
}

function answerNo() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');

  if (stage === 1) {
    q.textContent = "You enter the Tower of London and see the jewels in a glass case.";
    choices.innerHTML = `
      <button class="game-btn" onclick="fail('You smash the glass and alarms go off! You are arrested.')">Smash glass with fist</button>
      <button class="game-btn" onclick="fail('You beg the guard... and are thrown out in humiliation.')">Get on ground and beg guard</button>
    `;
  } else if (stage === 2) {
    q.textContent = "You skipped intel… and were spotted!";
    choices.innerHTML = `<button class="game-btn" onclick="restart()">Restart</button>`;
  }
}

function inspectBrick() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "Under the brick is a security control panel. Click 50 times in 10 seconds to disable alarm.";

  clickCount = 0;
  let timeLeft = 10; // countdown start

  choices.innerHTML = `
    <div id="countdown" style="font-size: 1.5rem; margin-bottom: 15px;">Time left: ${timeLeft}s</div>
    <button class="game-btn" id="clicker">Click me!</button>
  `;

  const countdownEl = document.getElementById('countdown');
  const clicker = document.getElementById('clicker');

  // countdown updater
  const countdownInterval = setInterval(() => {
    timeLeft--;
    countdownEl.textContent = `Time left: ${timeLeft}s`;

    // Optional: make it red when almost out of time
    if (timeLeft <= 3) {
      countdownEl.style.color = 'red';
    }

    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);

  clicker.onclick = () => {
    clickCount++;
    clicker.textContent = `${clickCount} clicks`;
    if (clickCount >= 50) {
      clearTimeout(clickTimer);
      clearInterval(countdownInterval);
      congratulationsScreen(); // buffer screen before tunnelSuccessBranch
    }
  };

  clickTimer = setTimeout(() => {
    clearInterval(countdownInterval);
    if (clickCount < 50) {
      fail("You didn’t click fast enough!");
    }
  }, 10000);
}


// -------------- NEW BUFFER SCREEN AFTER WIN ---------------

function congratulationsScreen() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "🎉 Congratulations — the alarm has been disabled! 🎉";

  choices.innerHTML = `
    <button class="game-btn continue-btn" onclick="tunnelSuccessBranch()">Continue onwards →</button>
  `;
}

// use this branch when continue button is clicked
function tunnelSuccessBranch() {
  stage = 4;
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "You get through the tunnel undetected and enter some vents, you can exit into one of these rooms.";
  choices.innerHTML = `
    <button class="game-btn" onclick="headGuardOffice()">Head Guard’s Office</button>
    <button class="game-btn" onclick="lockerRoom()">Locker Room</button>
    <button class="game-btn" onclick="fail('You tripped the laser beams!')">Jewel Room</button>
  `;
}


/* ------------- branch rooms after tunnel ------------- */

function headGuardOffice() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "You land in the head guard’s office and trip over his swivel chair making a loud bang.";
  choices.innerHTML = `
    <button class="game-btn" onclick="fail('You stay still and get caught.')">Stay still</button>
    <button class="game-btn" onclick="hideUnderDesk()">Hide under desk</button>
  `;
}

function hideUnderDesk() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "You hear keys jingle, the head guard enters, tidies up the files, and leaves without seeing you.";
  choices.innerHTML = `
    <button class="game-btn" onclick="fail('Oh no! There’s a guard outside, you are arrested.')">Leave the office</button>
  `;
}

function lockerRoom() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "Do you search the locker room?";
  choices.innerHTML = `
    <button class="game-btn" onclick="foundUniform()">Yes</button>
    <button class="game-btn" onclick="fail('You leave and are spotted by a guard. You get arrested.')">No</button>
  `;
}
function foundUniform() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "You find a guard uniform and put it on. You now blend in.";
  choices.innerHTML = `<button class="game-btn" onclick="shiftChange()">Wait for shift change</button>`;
}

function shiftChange() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "Shift change begins. How do you enter the vault?";
  choices.innerHTML = `
    <button class="game-btn" onclick="vaultCamera()">Use badge in your pocket</button>
    <button class="game-btn" onclick="fail('You aren’t a registered guard — scan denied. Alarm rings! You are arrested.')">Use biometric scan</button>
  `;
}

function vaultCamera() {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "You enter the vault. A security camera is watching.";
  choices.innerHTML = `
    <button class="game-btn" onclick="viralWin()">Look directly at the camera and send a message</button>
    <button class="game-btn" onclick="quietWin()">Keep your head down and acquire the jewels</button>
  `;
}
function saveCompletionTime() {
  if (!window.gameStartTime) {
    console.error("Game start time not set!");
    return;
  }

  const timeTaken = (Date.now() - window.gameStartTime) / 1000; // seconds

  const user = window.auth && window.auth.currentUser ? window.auth.currentUser : null;
  if (!user) {
    console.error("No logged in user.");
    return;
  }

  const payload = {
    time: Number(timeTaken.toFixed(2)), // keep as number
    finishedAt: new Date().toISOString(),
    uid: user.uid,
    username: user.displayName || "Anonymous"
  };

  window.setToDb(`completionTimes/${user.uid}`, payload);
}

function viralWin() {
  saveCompletionTime(); // record finish time
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "You win — you become a viral sensation!";
  choices.innerHTML = `
    <button class="game-btn" onclick="restart()">Play again</button>
    <a href="about-jewels.html" class="game-btn" style="display:inline-block; text-decoration:none;">Learn about stolen jewels</a>
  `;
}

function quietWin() {
  saveCompletionTime(); // record finish time
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = "Success! You quietly steal the jewels and nobody knows who did it.";
  choices.innerHTML = `
    <button class="game-btn" onclick="restart()">Play again</button>
    <a href="about-jewels.html" class="game-btn" style="display:inline-block; text-decoration:none;">Learn about stolen jewels</a>
  `;
}

/* ----------------------------------------------------- */



function fail(message) {
  const q = document.getElementById('question');
  const choices = document.getElementById('choices');
  q.textContent = `${message} You have failed - try again.`;
  choices.innerHTML = `<button class="game-btn" onclick="restart()">Restart</button>`;
}

function restart() {
  stage = 1;
  window.gameStartTime = Date.now(); // start timing here

  document.getElementById('question').textContent = "Do you want to plan the heist?";
  document.getElementById('choices').innerHTML = `
    <button class="game-btn" onclick="answerYes()">Yes</button>
    <button class="game-btn" onclick="answerNo()">No</button>
  `;
}
