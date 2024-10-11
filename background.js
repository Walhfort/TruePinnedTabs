// Utility function to extract the domain from a URL
function getDomain(url) {
    const a = document.createElement("a");
    a.href = url;
    return a.hostname;
  }
  
  // Listen for outgoing requests
  chrome.webRequest.onBeforeRequest.addListener(
      async function (details) {
        try {
          // Get the current tab
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          const currentTab = tabs[0];
  
          // Check if the current tab is pinned
          if (currentTab.pinned) {
            const currentDomain = getDomain(currentTab.url);
            const newDomain = getDomain(details.url);
  
            // If the domains are different, open the link in a new tab
            if (currentDomain !== newDomain) {
              // noinspection ES6MissingAwait We want to cancel the nav event as soon as possible
              chrome.tabs.create({url: details.url, active: true})
              return { cancel: true }; // Prevent navigation in the pinned tab
            }
          }
        } catch (error) {
          console.error("Error handling web request:", error);
        }
      },
      { urls: ["<all_urls>"] }, // Filter for all URLs
      ["blocking"] // Allows us to block the original request
  );
  