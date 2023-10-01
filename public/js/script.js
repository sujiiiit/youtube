const navContainer = document.querySelector(".navContainer");
const menuBtns = document.querySelectorAll(".menu_btn");
const searchbar = document.querySelector(".searchbar");
const searchOpenBtn = document.getElementById("search_open_btn");
const backBtn = document.getElementById("back_btn");
const searchin = document.getElementById("search_input");
const clearSearchButton = document.getElementById("clear_search");

function overlay() {
  const overlays = document.querySelectorAll(".overlay[data-overlay]");

  overlays.forEach((overlay) => {
    const dataOverlayValue = overlay.getAttribute("data-overlay").trim();
    if (dataOverlayValue.includes("opened")) {
      overlay.setAttribute("opened", "");
    }
  });
}

overlay();

document.addEventListener("click", function (event) {
  const input = document.querySelector(".searchbar input");
  const autoSuggest = document.querySelector(".auto_suggest");

  // Check if the click event target is the input
  if (event.target === input) {
    autoSuggest.classList.add("open");
  } else {
    autoSuggest.classList.remove("open");
  }
});

searchOpenBtn.addEventListener("click", function () {
  searchbar.classList.add("opened");
  overlay();
});

searchin.addEventListener("input", function () {
  if (searchin.value !== "") {
    clearSearchButton.style.display = "flex";
  } else {
    clearSearchButton.style.display = "none";
  }
});

clearSearchButton.addEventListener("click", function () {
  searchin.value = "";
  clearSearchButton.style.display = "none";
});

backBtn.addEventListener("click", function () {
  searchbar.classList.remove("opened");
  overlay();
});

function toggleOpenedAttribute(element) {
  const opened = element.getAttribute("opened");
  if (opened === null) {
    element.setAttribute("opened", "");
  } else {
    element.removeAttribute("opened");
  }
}

menuBtns.forEach((menuBtn) => {
  menuBtn.addEventListener("click", function () {
    toggleOpenedAttribute(navContainer);
  });
  overlay();
});

const queryString = window.location.search;

function getQueryParam(name) {
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(name);
}

const qValue = getQueryParam("q");

if (qValue !== null) {
  const searchin = document.getElementById("search_input");
  searchin.value = qValue;
}
