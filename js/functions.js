/* Enable & Disable elements */
function Enable(element) {
  element.removeAttribute("aria-disabled");
  element.removeAttribute("disabled");
  element.style.display = "";
}

function Disable(element, hide = true) {
  element.setAttribute("aria-disabled", "true");
  element.setAttribute("disabled", "");
  if (hide) {
    element.style.display = "none";
  }
}

/* Save & Load data */
function SaveData() {
  if (listId != null) {
    lists[listId].lastedit = NewDateAndTime();
  }

  let compiled = JSON.stringify(lists);
  console.log("SAVED: ", compiled);

  localStorage.setItem("lists", compiled);
}

function LoadData() {
  // console.log("LOADING DATA");
  let listgot = localStorage.getItem("lists");

  // console.log(listgot);
  if (listgot == null) return;

  // console.log("Not null | Trying to parse");

  try {
    lists = JSON.parse(listgot);
    // console.log("Parse successful");
  } catch (e) {
    console.log("Erro trying to parse");
    console.error(e);
    return;
  }
}

/* Date and time managers */
Date.prototype.today = function () {
  return (
    (this.getDate() < 10 ? "0" : "") +
    this.getDate() +
    "/" +
    (this.getMonth() + 1 < 10 ? "0" : "") +
    (this.getMonth() + 1) +
    "/" +
    this.getFullYear()
  );
};

Date.prototype.timeNow = function () {
  return (
    (this.getHours() < 10 ? "0" : "") +
    this.getHours() +
    ":" +
    (this.getMinutes() < 10 ? "0" : "") +
    this.getMinutes() +
    ":" +
    (this.getSeconds() < 10 ? "0" : "") +
    this.getSeconds()
  );
};

function NewDateAndTime() {
  let newDate = new Date();
  return newDate.today() + " | " + newDate.timeNow();
}

function Format(now, saved, complete, typeadd) {
  let difference = now - saved;
  if (difference != 0) {
    if (difference < 0) {
      difference += typeadd / 2;
    }

    return `${difference}${complete}${difference > 1 ? "s" : ""} `;
  }
  return "";
}

function SplitDateAndTime(dateAndTime) {
  let splited = dateAndTime.split(" | ");
  let calendar = splited[0].split("/");
  let time = splited[1].split(":");

  return [
    Number(calendar[0]),
    Number(calendar[1]),
    Number(calendar[2]),
    Number(time[0]),
    Number(time[1]),
  ];
}

/* Basic functions */
function TestIsEmpty(text) {
  return text.trim().length == 0;
}

function Clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
