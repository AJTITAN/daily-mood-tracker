const viewCalendar = document.querySelector(".mood-calendar-btn");
const submitButton = document.querySelector(".mood-submit-btn");
const container1 = document.querySelector(".container-1");
const container2 = document.querySelector(".container-2");
const emojiIcon = document.querySelectorAll(".emoji-icon");
const commentBox = document.querySelector(".commentBox");
const dates = document.querySelectorAll(".date");
const moodSelect = document.querySelector(".mood-select-btn");
let emojiValue = "";
let emojiValueText = "";
viewCalendar.addEventListener("click", () => {
  container1.classList.add("display-hide");
  container2.classList.add("display-show");
});
moodSelect.addEventListener("click", () => {
  container1.classList.remove("display-hide");
});
emojiIcon.forEach((emoji) => {
  emoji.addEventListener("click", () => {
    if (emoji.classList.contains("emoji-icon-shadow")) {
      emoji.classList.remove("emoji-icon-shadow");
      emojiValue = "";
      emojiValueText = "";
    } else {
      emojiIcon.forEach((element) => {
        element.classList.remove("emoji-icon-shadow");
      });
      emoji.classList.add("emoji-icon-shadow");
      emojiValue = emoji.innerText.split("\n")[0];
      emojiValueText = emoji.innerText.split("\n")[1];
    }
    console.log(
      `emoji icon is ${emojiValue} & emoji value text is ${emojiValueText}`
    );
  });
});
let today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();
let selectedDate = null;

let modal = document.createElement("div");
modal.id = "moodModal";
modal.innerHTML = `<p id="modalContent"></p><button id="closeModal">Close</button>`;
document.body.appendChild(modal);

let overlay = document.createElement("div");
overlay.id = "modalOverlay";
document.body.appendChild(overlay);

document.querySelector("#closeModal").addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

function closeModal() {
  modal.style.display = "none";
  overlay.style.display = "none";
}

function generateCalendar(year, month) {
  let calendar = document.querySelector(".calendar");
  document.querySelectorAll(".date").forEach((e) => e.remove());
  let firstDay = new Date(year, month, 1).getDay();
  let daysInMonth = new Date(year, month + 1, 0).getDate();
  let monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  document.getElementById(
    "month-year"
  ).innerText = `${monthNames[month]} ${year}`;

  for (let i = 0; i < firstDay; i++) {
    let emptyDiv = document.createElement("div");
    emptyDiv.classList.add("date", "empty");
    calendar.appendChild(emptyDiv);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    let dateDiv = document.createElement("div");
    dateDiv.classList.add("date");
    dateDiv.innerText = i;

    let formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      i
    ).padStart(2, "0")}`;
    let storedMood = localStorage.getItem(formattedDate);
    if (storedMood) {
      let moodData = JSON.parse(storedMood);
      dateDiv.innerHTML = `${i}<br>${moodData.emoji}`;
      dateDiv.title = moodData.comment;
      dateDiv.style.background = "#f39c12";
    }

    if (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      i === today.getDate()
    ) {
      dateDiv.classList.add("today");
    }

    dateDiv.dataset.date = formattedDate;

    dateDiv.addEventListener("click", function () {
      let storedMood = localStorage.getItem(formattedDate);
      let moodText = "Mood: N/A";
      let commentText = "Comment: N/A";

      if (storedMood) {
        let moodData = JSON.parse(storedMood);
        moodText = `Mood: ${moodData.emoji}`;
        commentText = `Comment: ${moodData.comment}`;
      }

      document.getElementById(
        "modalContent"
      ).innerHTML = `<strong>${monthNames[month]} ${i}, ${year}</strong><br>${moodText}<br>${commentText}`;
      modal.style.display = "block";
      overlay.style.display = "block";
    });

    calendar.appendChild(dateDiv);
  }
}

submitButton.addEventListener("click", () => {
  if (emojiValue.trim() === "" && commentBox.value.trim() === "") {
    alert("Please Select your Today's Mood and add a comment.");
  } else if (emojiValue.trim() === "") {
    alert("Please Select your Today's Mood.");
  } else if (commentBox.value.trim() === "") {
    alert(`Add a comment to today's mood (${emojiValue}).`);
  } else {
    let today = new Date();
    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");
    let selectedDate = `${year}-${month}-${day}`;

    let moodData = {
      emoji: emojiValue,
      comment: commentBox.value,
    };

    localStorage.setItem(selectedDate, JSON.stringify(moodData));

    let todayElement = document.querySelector(
      `.date[data-date="${selectedDate}"]`
    );
    if (todayElement) {
      todayElement.innerHTML = `${day}<br>${emojiValue}`;
      todayElement.title = commentBox.value;
      todayElement.style.background = "#f39c12";
      alert("Mood and comments are now updated in today's date");
      commentBox.value = "";
      emojiValue = "";
      emojiIcon.forEach((element) => {
        element.classList.remove("emoji-icon-shadow");
      });
    } else {
      alert("Today's date is not found in the calendar.");
    }
  }
});

generateCalendar(currentYear, currentMonth);
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;
  if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
  }

  themeToggle.addEventListener("click", function () {
      body.classList.toggle("dark-mode");
      if (body.classList.contains("dark-mode")) {
          localStorage.setItem("theme", "dark");
      } else {
          localStorage.setItem("theme", "light");
      }
  });
});

