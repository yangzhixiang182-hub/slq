const introLines = [
  "……",
  "检测到状态：生理期 Day 2",
  "启动关怀程序……"
];

const introScene = document.querySelector("#introScene");
const careScene = document.querySelector("#careScene");
const endingScene = document.querySelector("#endingScene");
const introDialogue = document.querySelector("#introDialogue");
const checklistItems = [...document.querySelectorAll("#checklist li")];
const continueButton = document.querySelector("#continueButton");
const rewardMessage = document.querySelector("#rewardMessage");
const rewardButtons = [...document.querySelectorAll(".reward-button")];
const heartsLayer = document.querySelector("#heartsLayer");

const wait = (milliseconds) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

async function typeLine(text) {
  const line = document.createElement("p");
  line.classList.add("typing");
  introDialogue.append(line);

  for (const character of text) {
    line.textContent += character;
    await wait(character === "…" ? 210 : 55);
  }

  line.classList.remove("typing");
  await wait(300);
}

async function runIntro() {
  for (const line of introLines) {
    await typeLine(line);
  }

  await wait(250);

  for (const item of checklistItems) {
    item.classList.add("is-visible");
    await wait(330);
  }

  continueButton.disabled = false;
}

function switchScene(fromScene, toScene) {
  fromScene.classList.remove("is-active");

  window.setTimeout(() => {
    fromScene.hidden = true;
    toScene.hidden = false;

    window.requestAnimationFrame(() => {
      toScene.classList.add("is-active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, 420);
}

function selectReward(button, message) {
  rewardButtons.forEach((item) => item.classList.remove("is-selected"));
  button.classList.add("is-selected");
  rewardMessage.animate(
    [
      { opacity: 0, transform: "translateY(4px)" },
      { opacity: 1, transform: "translateY(0)" }
    ],
    { duration: 320, easing: "ease-out" }
  );
  rewardMessage.textContent = message;
}

function releaseHearts() {
  const heartCount = 18;

  for (let index = 0; index < heartCount; index += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = index % 3 === 0 ? "♡" : "♥";
    heart.style.left = `${8 + Math.random() * 84}%`;
    heart.style.fontSize = `${14 + Math.random() * 18}px`;
    heart.style.setProperty("--duration", `${3.8 + Math.random() * 2.2}s`);
    heart.style.setProperty("--drift", `${-70 + Math.random() * 140}px`);
    heart.style.setProperty("--rotation", `${-45 + Math.random() * 90}deg`);
    heart.style.animationDelay = `${Math.random() * 0.65}s`;
    heartsLayer.append(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }
}

continueButton.addEventListener("click", () => {
  switchScene(introScene, careScene);
});

document.querySelector("#soupButton").addEventListener("click", (event) => {
  selectReward(event.currentTarget, "冬瓜排骨汤已送达 🍲");
});

document.querySelector("#hugButton").addEventListener("click", (event) => {
  selectReward(event.currentTarget, "抱抱已送达。有效期：今天一整天。");
  releaseHearts();
});

document.querySelector("#secretButton").addEventListener("click", (event) => {
  selectReward(
    event.currentTarget,
    "奖励：今晚你什么都不用管，我来照顾你。"
  );
});

document.querySelector("#finishButton").addEventListener("click", () => {
  releaseHearts();
  switchScene(careScene, endingScene);
});

runIntro();
