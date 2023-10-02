//setcookies
function setCookie(name, value, daysToExpire) {
  const expirationDate = new Date();

  expirationDate.setDate(expirationDate.getDate() + daysToExpire);

  const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;

  document.cookie = cookieString;
}
//getcookies
function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
}

const playPauseBtns = document.querySelectorAll(".play-pause-btn");
const fullScreenBtns = document.querySelectorAll(".full-screen-btn");
const miniPlayerBtn = document.querySelector(".mini-player-btn");
const muteBtn = document.querySelector(".mute-btn");
const currentTimeElems = document.querySelectorAll(".current-time");
const totalTimeElems = document.querySelectorAll(".total-time");
const previewImg = document.querySelector(".preview-img");
const thumbnailImg = document.querySelector(".thumbnail-img");
const volumeSlider = document.querySelector(".volume-slider");
const videoContainer = document.querySelector(".player");
const timelineContainer = document.querySelector(".timeline-container");
const hovertime = document.querySelector(".hovertime");
const ambientSwitch = document.querySelector(".ambient-switch");
const video = document.querySelector(".my-video");
const qualityitems = document.querySelector(
  ".transform-quality-panel .ytp-panel-menu"
);
video.addEventListener("contextmenu", (e) => e.preventDefault());

function isMobile() {
  const regex =
    /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return regex.test(navigator.userAgent);
}

function ismobilewidth() {
  if (isMobile()) {
    videoContainer.classList.add("mobile");
  } else if (
    videoContainer.clientWidth < 550 &&
    document.fullscreenElement == null
  ) {
    videoContainer.classList.add("mobile");
  } else {
    if (videoContainer.classList.contains("mobile"))
      videoContainer.classList.remove("mobile");
  }
}
ismobilewidth();

let qualitylabel = document.querySelector(".quality-go .ytp-menuitem-content");

const hls = new Hls();
hls.attachMedia(video);

// HLS stream URL (replace with your stream URL)
const m3u8 =
  "https://hlsx011.a387e6278d8e06083d813358762e0ac63.com/dstreamhls/5df1d861c0c3494533705825abfd936c/ep.4.v0.1691646123.m3u8";

// Load the HLS stream
hls.loadSource(m3u8);
hls.on(Hls.Events.MANIFEST_PARSED, () => {
  // Playback can be controlled here.
  console.log("HLS manifest parsed.");
  createQualityButtons();
});

function changeQualityLevelSmoothly(level) {
  hls.nextLevel = level;
}

function changeToAutoQuality() {
  hls.currentLevel = -1;
}

function getAvailableQualityLevels() {
  return hls.levels.map((level, index) => ({
    id: index,
    label: level.name || `${level.width}x${level.height}`,
  }));
}

let currentQualityButton = null; // To keep track of the currently selected quality button

function createQualityButtons() {
  const qualityLevels = getAvailableQualityLevels();

  // Reverse the qualityLevels array to invert the order
  qualityLevels.reverse();

  // Create the "Auto" quality button
  const autoButton = createQualityButton("Auto", -1, true);
  autoButton.addEventListener("click", () => {
    toggleQualityButton(autoButton);
    changeToAutoQuality();
    currentquality();

    settingsMenu.classList.remove("quality-menu");
    settingsMenu.classList.add("main-panel");
    contsize();
    addPanelAttribute();
    setSettingsize();
  });

  // Create quality level buttons in reverse order
  qualityLevels.forEach((level) => {
    const label = level.label;
    const div = createQualityButton(label, level.id);
    div.addEventListener("click", () => {
      toggleQualityButton(div);
      changeQualityLevelSmoothly(level.id);
      qualitylabel.textContent = level.label;
      settingsMenu.classList.remove("quality-menu");
      settingsMenu.classList.add("main-panel");
      contsize();
      addPanelAttribute();
      setSettingsize();
    });
    qualityitems.appendChild(div);
  });
  qualityitems.appendChild(autoButton);

  // Insert your new code here
  const ytpanelmenus = document.querySelectorAll(".ytp-panel-menu");
  ytpanelmenus.forEach((ytpanelmenu) => {
    const menuItems = ytpanelmenu.querySelectorAll(".ytp-menuitem");
    const numberOfMenuItems = menuItems.length;
    ytpanelmenu.setAttribute("data-menu-item-number", numberOfMenuItems);
    ytpanelmenu.style.height =
      "calc(" + numberOfMenuItems + "* var(--menu-item-height)";
  });
  contsize();
}

function createQualityButton(label, id, isAuto = false) {
  const div = document.createElement("div");
  div.classList.add("ytp-menuitem");
  div.setAttribute("tabindex", "0");
  div.setAttribute("role", "menuitemradio");
  if (isAuto) {
    div.setAttribute("aria-checked", "true");
    currentQualityButton = div; // Initialize the current button with "Auto"
  }

  const div2 = document.createElement("div");
  div2.classList.add("ytp-menuitem-label");

  const div3 = document.createElement("div");

  const span = document.createElement("span");
  span.textContent = label;

  div3.appendChild(span);
  if (label === "1080p") {
    // Create <sup>HD</sup> in HTML format
    const hdSup = document.createElement("sup");
    hdSup.textContent = "HD";
    div3.appendChild(hdSup);
  }
  div2.appendChild(div3);
  div.appendChild(div2);

  return div;
}

function toggleQualityButton(button) {
  if (currentQualityButton) {
    currentQualityButton.removeAttribute("aria-checked");
  }
  button.setAttribute("aria-checked", "true");
  currentQualityButton = button;
}

function currentquality() {
  const qualityLevels = getAvailableQualityLevels();
  const currentQualityLevel = qualityLevels.find(
    (level) => level.id === hls.currentLevel
  );

  if (hls.autoLevelEnabled && currentQualityLevel) {
    const span = document.createElement("span");
    span.classList.add("ytp-menuitem-label-count");
    qualitylabel.textContent = "Auto";
    span.textContent = " (" + currentQualityLevel.label + ") ";
    qualitylabel.appendChild(span);
  } else if (currentQualityLevel) {
    qualitylabel.textContent = currentQualityLevel.label;
  }
}

currentquality(); // Call this initially to set the label

// Whenever the quality changes, call currentquality() to update the label
hls.on(Hls.Events.LEVEL_SWITCHED, () => {
  qualitySetAutomatically = false; // User manually changed the quality
  currentquality();
  console.log("quality switched !!!");
});

hls.on(Hls.Events.ERROR, (event, data) => {
  console.error(`HLS error: ${data.type} - ${data.details}`);
  if (data.fatal) {
    console.error(
      "Fatal error occurred. You may need to check the stream URL and manifest."
    );
  }
});

// Duration
video.addEventListener("loadeddata", () => {
  totalTimeElems.forEach((totalTimeElem) => {
    totalTimeElem.textContent = formatDuration(video.duration);
  });
  setCookie("total-time", video.duration, 30);
});

window.addEventListener("load", () => {
  const playedTimeCookie = getCookie("played-time");
  if (playedTimeCookie !== null) {
    const playedTime = parseFloat(playedTimeCookie);
    if (!isNaN(playedTime)) {
      video.currentTime = playedTime;
    }
  }
});

video.addEventListener("timeupdate", () => {
  const currentTime = video.currentTime;
  // Iterate through each currentTimeElem and update its content
  currentTimeElems.forEach((elem) => {
    elem.textContent = formatDuration(currentTime);
  });
  setCookie("played-time", video.currentTime, 30);
});

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});
function formatDuration(time) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}

function skip(duration) {
  video.currentTime += duration;
}

// Volume
muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", (e) => {
  video.volume = e.target.value;
  video.muted = e.target.value === 0;
});

function toggleMute() {
  video.muted = !video.muted;
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume;
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0;
    volumeLevel = "muted";
  } else if (video.volume >= 0.5) {
    volumeLevel = "high";
  } else {
    volumeLevel = "low";
  }

  videoContainer.dataset.volumeLevel = volumeLevel;
});

// View Modes
miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode);

function toggleFullScreenMode() {
  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen().then(() => {
      console.log(videoContainer.clientWidth);
      if (videoContainer.clientWidth < 550) {
        console.log(videoContainer.clientWidth);
        videoContainer.classList.add("mobile");
      }
    });
  }
}

function toggleMiniPlayerMode() {
  if (videoContainer.classList.contains("mini-player")) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
}

document.addEventListener("fullscreenchange", () => {
  if (isMobile()) {
    videoContainer.classList.toggle(
      "mobile-fullscreen",
      document.fullscreenElement
    );
  } else {
    // if (videoContainer.classList.contains("mobile")) {
    //   videoContainer.classList.remove("mobile");
    // }
    videoContainer.classList.toggle("full-screen", document.fullscreenElement);
  }
  contsize();
  addPanelAttribute();
  setSettingsize();
});

video.addEventListener("enterpictureinpicture", () => {
  videoContainer.classList.add("mini-player");
});

video.addEventListener("leavepictureinpicture", () => {
  videoContainer.classList.remove("mini-player");
});

// Play/Pause
playPauseBtns.forEach((playPauseBtn) => {
  playPauseBtn.addEventListener("click", togglePlay);
});
// video.addEventListener("click", togglePlay);

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});

// Get the ambient switch element

ambientSwitch.addEventListener("click", () => {
  const currentAriaChecked = ambientSwitch.getAttribute("aria-checked");
  const newAriaChecked = currentAriaChecked === "true" ? "false" : "true";
  ambientSwitch.setAttribute("aria-checked", newAriaChecked);
});

const settingsButtons = document.querySelectorAll(".setting-btn");
const settingsButtonsvgs = document.querySelectorAll(".setting-btn svg");
const settingsMenu = document.querySelector(".ytp-settings-menu");

settingsButtons.forEach((settingsButton) => {
  settingsButton.addEventListener("click", function () {
    // Toggle the 'active' class on the settings menu
    settingsMenu.classList.toggle("active");
    settingsButtonsvgs.forEach((settingsButtonsvg) => {
      settingsButtonsvg.classList.toggle("active");
    });
    setSettingsize();
  });
});

// Initialize the rotation angle variable
let rotationAngle = 0;

const playbackspeedgo = document.querySelector(".playback-speed-go");
const mainpanelback = document.querySelector(".main-panel-back");
const mainytpanel = document.querySelector(".main-yt-panel");
const playbackytpanel = document.querySelector(".playback-yt-panel");
const playbackcountback = document.querySelector(".playback-count-back");
const subtitlego = document.querySelector(".subtitle-go");
const subtitlepanelback = document.querySelector(".subtitle-panel-back");
const qualitypanel = document.querySelector(".quality-go");
const qualityback = document.querySelector(".quality-back");
const subtitleback2 = document.querySelector(".subtitleback2");

playbackspeedgo.addEventListener("click", function () {
  // Toggle the 'active' class on the settings menu
  settingsMenu.classList.remove("main-panel");
  settingsMenu.classList.add("playback-speed");
  addPanelAttribute();
  setSettingsize();
});

mainpanelback.addEventListener("click", function () {
  // Toggle the 'active' class on the settings menu
  settingsMenu.classList.remove("playback-speed");
  settingsMenu.classList.add("main-panel");
  addPanelAttribute();
  setSettingsize();
});

qualitypanel.addEventListener("click", function () {
  // Toggle the 'active' class on the settings menu
  settingsMenu.classList.remove("main-panel");
  settingsMenu.classList.add("quality-menu");
  addPanelAttribute();
  setSettingsize();
});
qualityback.addEventListener("click", function () {
  settingsMenu.classList.remove("quality-menu");
  settingsMenu.classList.add("main-panel");
  addPanelAttribute();
  setSettingsize();
});

const playbackmenuItems = document.querySelectorAll(
  ".playback-yt-panel .ytp-menuitem"
);
let currentplayback = document.querySelector(".playback-current");

function setPlaybackSpeed(speed, menuItem) {
  // Set the playback speed of the video
  if (speed.toLowerCase() === "normal") {
    speed = 1; // Set to 1 if the label is "Normal"
    currentplayback.textContent = "Normal"; // Set the text content to "Normal"
  } else {
    speed = parseFloat(speed);
    currentplayback.textContent = speed; // Set the text content to the selected speed
  }

  video.playbackRate = speed;

  // Remove "aria-checked" attribute from all menu items
  playbackmenuItems.forEach((item) => {
    item.removeAttribute("aria-checked");
  });

  // Set "aria-checked" attribute to "true" for the selected menu item
  menuItem.setAttribute("aria-checked", "true");

  settingsMenu.classList.remove("playback-speed");
  settingsMenu.classList.add("main-panel");
  contsize();
  addPanelAttribute();
  setSettingsize();
}

// Add click event listeners to menu items
playbackmenuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const speed = item.querySelector(".ytp-menuitem-label").textContent;
    setPlaybackSpeed(speed, item);
  });
});

//loading

// Get the video element

// Get the buffering indicator div
const bufferingIndicator = document.querySelector(".spin-loader");

// Show the buffering indicator when the video is loading
video.addEventListener("loadstart", () => {
  bufferingIndicator.style.display = "flex";
});

// Hide the buffering indicator when the video has loaded
video.addEventListener("loadeddata", () => {
  bufferingIndicator.style.display = "none";
});

// Show the buffering indicator when the video is buffering
video.addEventListener("waiting", () => {
  bufferingIndicator.style.display = "flex";
});

// Hide the buffering indicator when the video has enough data to play
video.addEventListener("playing", () => {
  bufferingIndicator.style.display = "none";
});

const ytpanels = document.querySelectorAll(".ytp-panel");

function contsize() {
  const videoContainerHeight = videoContainer.clientHeight;
  const videoContainerWidth = videoContainer.clientWidth;
  let maxsize = 0;
  if (videoContainerWidth < 500) {
    maxsize = 0.6;
  } else {
    maxsize = 0.75;
  }
  const maxheight = maxsize * videoContainerHeight;
  settingsMenu.style.maxHeight = maxheight + "px";
  ytpanels.forEach((panel) => {
    panel.style.maxHeight = maxheight + "px";
    let header = 0;
    if (panel.hasAttribute("header")) {
      header = panel.querySelector(".panel-header").clientHeight;
    } else {
      header = 0;
    }
    let menu = panel.querySelector(".ytp-panel-menu").clientHeight;
    panel.style.height = header + menu + 1 + "px";
  });
}

contsize();
let videowidthpx = 0;
function videowidth() {
  videowidthpx = video.clientWidth;
}
videowidth();

window.addEventListener("resize", function () {
  videowidth();
  contsize();
  addPanelAttribute();
  setSettingsize();
  seekwidth();
  ismobilewidth();
});

function addPanelAttribute() {
  const settingsMenu = document.querySelector(".ytp-settings-menu");
  const panelAttributeMapping = {
    "main-panel": "transform-main",
    "playback-speed": "transform-playback-speed",
    "quality-menu": "transform-quality-panel",
  };

  for (const className in panelAttributeMapping) {
    if (settingsMenu.classList.contains(className)) {
      settingsMenu.setAttribute("panel", panelAttributeMapping[className]);
      break; // Exit the loop once a matching class is found
    }
  }
}

// Call the function to add the 'panel' attribute
addPanelAttribute();

function setSettingsize() {
  let panelAttribute = settingsMenu.getAttribute("panel");

  if (panelAttribute) {
    let matchingYtpPanel = document.querySelector(
      `.ytp-panel.${panelAttribute}`
    );
    if (matchingYtpPanel) {
      let ytpPanelHeight = matchingYtpPanel.clientHeight;
      let ytpPanelWidth = matchingYtpPanel.getBoundingClientRect().width;
      settingsMenu.style.height = `${ytpPanelHeight + 1}px`;
    }
  }
}

// Call the function to set the settings menu height
document.addEventListener("DOMContentLoaded", function () {
  setSettingsize();
});

fullScreenBtns.forEach((fullScreenBtn) => {
  fullScreenBtn.addEventListener("click", function () {
    toggleFullScreenMode();
  });
});

// Get references to the input range, progress bar, seekbar, and buffer bar
const inputRange = document.querySelector('.seekbar input[type="range"]');
const progressBar = document.querySelector(".progressbar");
const seekbar = document.querySelector(".seekbar");
const loadedLine = document.querySelector(".seekbar-buffer");

// Add an event listener to update the seek position when the input range value changes
inputRange.addEventListener("input", () => {
  const value = inputRange.value;
  progressBar.style.width = `${value}%`;
  progressBar.setAttribute("aria-valuenow", value);

  // Calculate the new time based on the percentage
  const newTime = (value / 100) * video.duration;

  // Update the video's current time
  video.currentTime = newTime;
});

// Update the seekbar and input range when the video's time updates
video.addEventListener("timeupdate", () => {
  const duration = video.duration;
  const currentTime = video.currentTime;

  // Calculate the percentage of video progress
  const progressPercentage = (currentTime / duration) * 100;

  // Update the seekbar and input range
  progressBar.style.width = `${progressPercentage}%`;
  progressBar.setAttribute("aria-valuenow", progressPercentage);
  inputRange.value = progressPercentage;
  seekbar.style = "--progress-position:" + progressPercentage + "%";
});

const hoveredLine = document.querySelector(".hover-line");
const seekprogress = document.querySelector(".seekbar-progress");
const seekrange = document.querySelector(".seek-range");
const movingContainer = document.querySelector(".moving_cont");

function setBuffer(buffer) {
  const percentage = buffer / video.duration;
  //loadedLine.style.width = `${percentage * seekprogress.clientWidth}px`;
  loadedLine.style.width = `${percentage * 100}%`;
  //console.log(`percentage is ${percentage * 100}%`);
}

video.addEventListener("progress", () => {
  if (video.duration > 0) {
    for (let i = 0; i < video.buffered.length; i++) {
      // search for last downloaded buffere and get its end()
      if (
        video.buffered.start(video.buffered.length - 1 - i) < video.currentTime
      ) {
        setBuffer(video.buffered.end(video.buffered.length - 1 - i));
        break;
      }
    }
  }
});

function seekwidth() {
  seekrange.style.width = seekprogress.clientWidth + "px";
}
seekwidth();

// Add an event listener to the seekbar for mousemove
seekbar.addEventListener("mousemove", function (e) {
  movingContainer.style.display = "flex";

  let { x } = seekprogress.getBoundingClientRect();
  const hoveredLineValue = e.clientX - x;
  const parentWidth = seekprogress.clientWidth; // Get the parent container's width

  // Calculate the width as a percentage of the parent container
  const percentageWidth = (hoveredLineValue / parentWidth) * 100;
  hoveredLine.style.width = `${percentageWidth}%`;

  // Ensure the percentageWidth stays within bounds (between 12% and 75%)

  let minPercentage, maxPercentage;
  if (videowidthpx < 500) {
    minPercentage = 23;
    maxPercentage = 77;
  } else if (videowidthpx > 500 && videowidthpx < 650) {
    minPercentage = 17;
    maxPercentage = 83;
  } else {
    minPercentage = 13;
    maxPercentage = 87;
  }

  const clampedPercentage = Math.min(
    maxPercentage,
    Math.max(minPercentage, percentageWidth)
  );

  // Calculate the time corresponding to the mouse position
  // const newTime = (clampedPercentage / 100) * video.duration;
  const newTime = (percentageWidth / 100) * video.duration;

  // Calculate the left value for the moving container based on clampedPercentage
  const movingContainerLeft =
    (clampedPercentage / 100) * seekprogress.clientWidth;

  // Update the position of the moving-container (thumb)
  movingContainer.style.left = `${movingContainerLeft}px`;

  // Display the current time as a tooltip
  movingContainer.setAttribute("title", formatTime(newTime));

  // Update the hovertime element
  hovertime.textContent = formatTime(newTime);
});

if (isMobile()) {
  seekbar.addEventListener("touchmove", function (e) {
    movingContainer.style.display = "flex";

    let { x } = seekprogress.getBoundingClientRect();
    const touchedLineValue = e.touches[0].clientX - x;
    const parentWidth = seekprogress.clientWidth; // Get the parent container's width

    // Calculate the width as a percentage of the parent container
    const percentageWidth = (touchedLineValue / parentWidth) * 100;
    hoveredLine.style.width = `${percentageWidth}%`;

    // Ensure the percentageWidth stays within bounds (between 12% and 75%)

    let minPercentage, maxPercentage;
    if (videowidthpx < 500) {
      minPercentage = 23;
      maxPercentage = 77;
    } else if (videowidthpx > 500 && videowidthpx < 650) {
      minPercentage = 17;
      maxPercentage = 83;
    } else {
      minPercentage = 13;
      maxPercentage = 87;
    }

    const clampedPercentage = Math.min(
      maxPercentage,
      Math.max(minPercentage, percentageWidth)
    );

    // Calculate the time corresponding to the touch position
    const newTime = (percentageWidth / 100) * video.duration;

    // Calculate the left value for the moving container based on clampedPercentage
    const movingContainerLeft =
      (clampedPercentage / 100) * seekprogress.clientWidth;

    // Update the position of the moving-container (thumb)
    movingContainer.style.left = `${movingContainerLeft}px`;

    // Display the current time as a tooltip
    movingContainer.setAttribute("title", formatTime(newTime));

    // Update the hovertime element
    hovertime.textContent = formatTime(newTime);
  });
}

seekbar.addEventListener("mouseleave", () => {
  movingContainer.style.display = "none";
  hoveredLine.style.width = "0";
});

seekbar.addEventListener("mouseleave", () => {
  movingContainer.style.display = "none";
  hoveredLine.style.width = "0";
});

if (isMobile()) {
  seekbar.addEventListener("touchend", () => {
    movingContainer.style.display = "none";
    hoveredLine.style.width = "0";
  });
}

// Function to format time in seconds to a human-readable format (mm:ss)
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${formattedMinutes}:${formattedSeconds}`;
}
