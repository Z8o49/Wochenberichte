// navigation.js
// Get back and next buttons
const backButton = document.getElementById("back");
const nextButton = document.getElementById("next");

// Get the current week number from the URL
function getCurrentWeek() {
  const path = window.location.pathname;
  const page = path.split("_");
  if (typeof page[1] !== "undefined") {
    return parseInt(page[1]);
  } else {
    return null;
  }
}

// Check if the page exists
async function pageExists(preFile, nextFile = null) {
  // Async function to handle fetch. Returns a promise. (preFile, nextFile) are the filenames to check
  const checkFile = async (file) => {
    if (!file) return false; // if no file provided, return false
    try {
      // try-catch to handle errors
      const response = await fetch(file, { method: "HEAD" }); //HEAD request to only get headers for faster response
      return response.ok; // return true if response is ok
    } catch (error) {
      return false;
    }
  };
  const preExists = await checkFile(preFile);
  const nextExists = await checkFile(nextFile);

  return { preExists, nextExists };
}

// Check if Previous page exists and navigate to it
async function getPreWeek() {
  const currentWeek = getCurrentWeek();

  // If currentWeek is null, find the latest week
  if (currentWeek === null) {
    const latestWeek = await findLatestWeek();
    if (latestWeek) {
      window.location.href = `kw_${latestWeek}_2025.html`;
    }
    return;
  }

  // Navigate to previous week
  const preWeek = currentWeek - 1;
  const preFile = `kw_${preWeek}_2025.html`;

  const { preExists } = await pageExists(preFile);

  if (preExists) {
    window.location.href = preFile;
  }
}

// Check if Next page exists and navigate to it
async function getNextWeek() {
  const currentWeek = getCurrentWeek();

  // If currentWeek is null, find the earliest week
  if (currentWeek === null) {
    const earliestWeek = await findEarliestWeek();
    if (earliestWeek) {
      window.location.href = `kw_${earliestWeek}_2025.html`;
    }
    return;
  }

  // Navigate to next week
  const nextWeek = currentWeek + 1;
  const nextFile = `kw_${nextWeek}_2025.html`;

  const { nextExists } = await pageExists(null, nextFile);

  if (nextExists) {
    window.location.href = nextFile;
  } else {
    window.location.href = "index.html";
  }
}

// Find the latest week available
async function findLatestWeek(maxWeeks = 52) {
  for (let i = maxWeeks; i >= 1; i--) {
    const file = `kw_${i}_2025.html`;
    const { preExists } = await pageExists(file); // Only checking preExists here
    if (preExists) {
      return i;
    }
  }
  return null;
}

// Check if Previous page exists and navigate to it
async function findEarliestWeek(maxWeeks = 52) {
  for (let i = 1; i <= maxWeeks; i++) {
    const file = `kw_${i}_2025.html`;
    const { preExists } = await pageExists(file); // Only checking preExists here
    if (preExists) {
      return i;
    }
  }
  return null;
}

// Define the function to be called at the click of a button
backButton.onclick = getPreWeek;
nextButton.onclick = getNextWeek;