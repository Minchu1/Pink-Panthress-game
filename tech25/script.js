// script.js
/*
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAjJH-gJjPcZeS1Ph-JL15_aN3cq5Ecr5Q",
  authDomain: "pinkpanther-27795.firebaseapp.com",
  projectId: "pinkpanther-27795",
  storageBucket: "pinkpanther-27795.appspot.com",
  messagingSenderId: "950188314786",
  appId: "1:950188314786:web:1be4f4c1e9ed874567c7fb"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let currentNode = "start";
let playerName = "";

const storyNodes = {
  start: {
    text: "Welcome to Pink Panthress Adventures.",
    choices: [
      { text: "Play Game", next: "planning" },
      { text: "Learn about stolen jewels", next: "jewelInfo" },
      { text: "Leaderboard", next: "leaderboard" }
    ]
  },
  planning: {
    text: "Congratualtions, you have now been accepted into the crime syndicate the Pink Panthers, Do you want to plan the heist?",
    choices: [
      { text: "Yes", next: "gatherIntel" },
      { text: "No", next: "glassCase" }
    ]
  },
  glassCase: {
    text: "You enter the Tower of London and see the jewels in a glass case. You failed. Start again.",
    choices: [ { text: "Restart", next: "start" } ]
  },
  gatherIntel: {
    text: "Do you want to gather intel?",
    choices: [
      { text: "Yes", next: "discoverIntel" },
      { text: "No", next: "frontGate" }
    ]
  },
  discoverIntel: {
    text: "You discover guard patterns, cameras, and a locker room.",
    choices: [
      { text: "Sneak into the old tunnel", next: "inspectBrick" },
      { text: "Ignore the brick", next: "alarmTripped" }
    ]
  },
  inspectBrick: {
    text: "Under the brick is the security control panel. Play mini click game to disable alarm.",
    choices: [ { text: "Click 50 times", next: "undetectedTunnel" } ]
  },
  alarmTripped: {
    text: "You tripped the alarm. Start again.",
    choices: [ { text: "Restart", next: "start" } ]
  },
  undetectedTunnel: {
    text: "You get through the tunnel undetected. You can exit into one of these rooms.",
    choices: [
      { text: "Head Guard's Office", next: "headGuardOffice" },
      { text: "Locker Room", next: "lockerRoom" },
      { text: "Jewel Room", next: "laserTripped" }
    ]
  },
  headGuardOffice: {
    text: "You trip over a chair and drop files.",
    choices: [
      { text: "Stay still", next: "caughtHeadGuard" },
      { text: "Hide under desk", next: "leaveOffice" }
    ]
  },
  caughtHeadGuard: {
    text: "You are arrested. Start again.",
    choices: [ { text: "Restart", next: "start" } ]
  },
  leaveOffice: {
    text: "You sneak out, but a guard catches you. Start again.",
    choices: [ { text: "Restart", next: "start" } ]
  },
  lockerRoom: {
    text: "Do you search the room?",
    choices: [
      { text: "Yes", next: "findUniform" },
      { text: "No", next: "caughtLocker" }
    ]
  },
  findUniform: {
    text: "You find a guard uniform. You now blend in.",
    choices: [ { text: "Wait until shift change", next: "vaultAccess" } ]
  },
  caughtLocker: {
    text: "A guard spots you. You are arrested. Start again.",
    choices: [ { text: "Restart", next: "start" } ]
  },
  vaultAccess: {
    text: "Do you use the badge or biometric scan?",
    choices: [
      { text: "Use badge", next: "cameraRoom" },
      { text: "Biometric scan", next: "deniedVault" }
    ]
  },
  cameraRoom: {
    text: "You enter the vault. A camera is watching.",
    choices: [
      { text: "Look at camera", next: "viralWin" },
      { text: "Keep head down", next: "trueWin" }
    ]
  },
  viralWin: {
    text: "You win, you're a viral sensation!",
    choices: [ { text: "Play again", next: "start" } ]
  },
  trueWin: {
    text: "You silently acquire the jewels. True success.",
    choices: [ { text: "Play again", next: "start" } ]
  },
  deniedVault: {
    text: "Access denied. Alarm rings. You're arrested.",
    choices: [ { text: "Restart", next: "start" } ]
  },
  laserTripped: {
    text: "You tripped the lasers. Start again.",
    choices: [ { text: "Restart", next: "start" } ]
  },
  frontGate: {
    text: "Do you bribe a guard?",
    choices: [
      { text: "Yes", next: "betrayed" },
      { text: "No", next: "deniedGate" }
    ]
  },
  betrayed: {
    text: "The guard takes your money and arrests you.",
    choices: [ { text: "Restart", next: "start" } ]
  },
  deniedGate: {
    text: "You're stopped at security. Start again.",
    choices: [ { text: "Restart", next: "start" } ]
  }
};

function showNode(key) {
  const node = storyNodes[key];
  currentNode = key;

  document.getElementById("story-text").innerText = node.text;
  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  node.choices.forEach(choice => {
    const button = document.createElement("button");
    button.innerText = choice.text;
    button.onclick = () => {
      showNode(choice.next);
      saveProgress();
    };
    choicesDiv.appendChild(button);
  });
}

window.startGame = function () {
  playerName = document.getElementById("player-name").value;
  if (!playerName) return alert("Please enter a code name.");

  document.getElementById("login-container").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  loadProgress().then(() => showNode(currentNode));
};

function saveProgress() {
  const dbRef = ref(db, "players/" + playerName);
  set(dbRef, { node: currentNode });
}

async function loadProgress() {
  const snapshot = await get(ref(db, "players/" + playerName));
  if (snapshot.exists()) {
    currentNode = snapshot.val().node;
  }
}
