document.addEventListener("DOMContentLoaded", function () {
  const dataContainer = document.querySelector(".content_grid");
  const loadMoreTrigger = document.getElementById("load-more");
  let currentPage = 2;
  let isLoading = false;

  async function fetchMoreData() {
    if (isLoading) return;

    isLoading = true;
    try {
      const response = await fetch(`/api/recently-added?page=${currentPage}`);
      const newData = await response.json();

      if (newData.length > 0) {
        newData.forEach((item) => {
          const contentDiv = document.createElement("div");
          contentDiv.classList.add("content_div");

          const imgCont = document.createElement("div");
          imgCont.classList.add("img_cont");
          imgCont.classList.add("lazy-bg");
          imgCont.setAttribute("data-src", item.imgURL);
          //imgCont.style.backgroundImage = `url(${item.imgURL})`;

          const contentInside = document.createElement("div");
          contentInside.classList.add("content_inside");

          const contentInside1 = document.createElement("div");
          contentInside1.classList.add("content_inside_1");

          const contentName = document.createElement("div");
          contentName.classList.add("content_name");
          contentName.textContent = item.title;

          const contentInfo = document.createElement("div");
          contentInfo.classList.add("content_info");

          const contentEp = document.createElement("div");
          contentEp.classList.add("content_ep");
          contentEp.textContent = `Episode ${item.episodeNumber}`;

          const spaceSpan = document.createElement("span");
          spaceSpan.classList.add("space_span");
          spaceSpan.innerHTML = "&#8226;";

          const contentTime = document.createElement("div");
          contentTime.classList.add("content_time");

          const contentReleased = document.createElement("span");
          contentReleased.classList.add("content_released");
          contentReleased.textContent = "2023";

          const contentPosted = document.createElement("span");
          contentPosted.classList.add("content_posted");
          contentPosted.textContent = item.time;

          // Appending elements to their respective parents
          contentTime.appendChild(contentReleased);
          contentTime.innerHTML += "&#8226;";
          contentTime.appendChild(contentPosted);

          contentInfo.appendChild(contentEp);
          contentInfo.appendChild(spaceSpan);
          contentInfo.appendChild(contentTime);

          contentInside1.appendChild(contentName);
          contentInside1.appendChild(contentInfo);

          contentInside.appendChild(contentInside1);

          // const contentInside2 = document.createElement("div");
          // contentInside2.classList.add("content_inside_2");

          // const contentInfoBtn = document.createElement("button");
          // contentInfoBtn.classList.add("content_info_btn", "icon_btn");

          // const svg = document.createElementNS(
          //   "http://www.w3.org/2000/svg",
          //   "svg"
          // );
          // svg.setAttribute("viewBox", "0 0 24 24");

          // const path = document.createElementNS(
          //   "http://www.w3.org/2000/svg",
          //   "path"
          // );
          // path.setAttribute(
          //   "d",
          //   "M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"
          // );

          // svg.appendChild(path);
          // contentInfoBtn.appendChild(svg);
          // contentInside2.appendChild(contentInfoBtn);

          // contentInside.appendChild(contentInside2);

          contentDiv.appendChild(imgCont);
          contentDiv.appendChild(contentInside);

          dataContainer.insertBefore(contentDiv, loadMoreTrigger);
        });
        lazyimg();

        currentPage++;
      } else {
        // No more data to load
        loadMoreTrigger.style.display = "none";
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isLoading = false;
    }
  }

  const loadMoreObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      fetchMoreData();
    }
  });

  loadMoreObserver.observe(loadMoreTrigger);
});
