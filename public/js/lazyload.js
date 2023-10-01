document.addEventListener("DOMContentLoaded", function () {
  lazyimg();
});

function lazyimg() {
  var lazyImageDivs = [].slice.call(document.querySelectorAll(".lazy-bg"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function (
      entries,
      observer
    ) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImageDiv = entry.target;
          lazyImageDiv.style.backgroundImage = `url('${lazyImageDiv.dataset.src}')`;
          lazyImageDiv.classList.remove("lazy-bg");
          lazyImageObserver.unobserve(lazyImageDiv);
        }
      });
    });

    lazyImageDivs.forEach(function (lazyImageDiv) {
      lazyImageObserver.observe(lazyImageDiv);
    });
  } else {
    // Possibly fall back to event handlers here
  }
}
