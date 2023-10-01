const searchInput = document.getElementById("search_input");
const autoSuggestInner = document.getElementById("auto_suggest_inner");
const autocompleteLoadMore = document.getElementById("autocomplete_load_more");
const search_query = document.getElementById("search_query");
const nomatch = document.getElementById("no_match");
let autolastElement;
let autocurrentPage = 1; // Initialize to page 1
let autoisLoading = false;

// Hide the "Load more" and "No match" elements initially
autocompleteLoadMore.style.display = "none";
nomatch.style.display = "none";

// Function to fetch data and display results
async function fetchAndDisplayResults(searchQuery, page) {
  try {
    const response = await fetch(`/api/search?keyword=${searchQuery}&page=${page}`);
    if (response.ok) {
      const data = await response.json();
      if (data.length === 0) {
        displayNoMatch();
      } else {
        displayResults(data);
      }
    } else {
      console.error("Failed to fetch data");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Display search results
function displayResults(results) {
  autoSuggestInner.innerHTML = ""; // Clear the inner suggestions

  results.forEach((result) => {
    const resultItem = document.createElement("a");
    resultItem.classList.add("auto_suggest_result");
    resultItem.href = result.postLink;

    const resultTitle = document.createElement("span");
    resultTitle.classList.add("auto_suggest_title");
    resultTitle.textContent = result.title;

    resultItem.appendChild(resultTitle);
    autoSuggestInner.appendChild(resultItem);
  });

  // Show the "Load more" button if needed
  search_query.style.display = "none";
  autocompleteLoadMore.style.display = "flex";
  nomatch.style.display = "none";

  // Now add the code to change the color of the last element
  autolastElement = autoSuggestInner.lastElementChild;

  // Start observing the last element for this page
  autoloadMoreObserver.observe(autolastElement);
}

// Display "No match" message
function displayNoMatch() {
  autoSuggestInner.innerHTML = " ";
  search_query.style.display = "none";
  autocompleteLoadMore.style.display = "none";
  nomatch.style.display = "flex";
}

// Event listener for input changes
searchInput.addEventListener("input", () => {
  handleSearch();
});

// Function to handle the search
function handleSearch() {
  const searchQuery = searchInput.value;
  if (searchQuery.length === 0) {
    autoSuggestInner.innerHTML = "";
    search_query.style.display = "block";
    autocompleteLoadMore.style.display = "none";
    nomatch.style.display = "none";
  } else if (searchQuery.length >= 1) {
    autocurrentPage = 1; // Reset to page 1 when a new search is initiated
    fetchAndDisplayResults(searchQuery, autocurrentPage);
    search_query.style.display = "block";
  }
}

// IntersectionObserver callback function
async function autoloadMoreCallback(entries) {
  if (entries[0].isIntersecting && !autoisLoading) {
    await autofetchMoreData();
  }
}

const autoloadMoreObserver = new IntersectionObserver(autoloadMoreCallback, {
  root: null, // Use the viewport as the root
  threshold: 0.5, // Trigger when 50% of the element is visible
});

// Function to fetch more data
async function autofetchMoreData() {
  if (autoisLoading) return;

  autoisLoading = true;
  try {
    const searchQuery = searchInput.value; // Get the current search query
    autocurrentPage++; // Increment the page number for the next fetch
    const autoresponse = await fetch(
      `/api/search?keyword=${searchQuery}&page=${autocurrentPage}`
    );
    const autonewData = await autoresponse.json();

    if (autonewData.length > 0) {
      autonewData.forEach((result) => {
        const resultItem = document.createElement("a");
        resultItem.classList.add("auto_suggest_result");
        resultItem.href = result.postLink;

        const resultTitle = document.createElement("span");
        resultTitle.classList.add("auto_suggest_title");
        resultTitle.textContent = result.title;

        resultItem.appendChild(resultTitle);
        autoSuggestInner.appendChild(resultItem);
      });

      // Now observe the last element for the next page
      autolastElement = autoSuggestInner.lastElementChild;
      autoloadMoreObserver.observe(autolastElement);
    } else {
      // No more data to load
      autocompleteLoadMore.style.display = "none";
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    autoisLoading = false;
  }
}
