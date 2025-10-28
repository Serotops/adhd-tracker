/// <reference types="chrome"/>

// Content script for ADHD Tracker Chrome Extension
// Runs on all web pages and can interact with the DOM

console.log('ADHD Tracker content script loaded')

// Track page activity and focus
let isTracking = false
let activityLog: Array<{
  timestamp: number
  type: string
  data: any
}> = []

// Initialize by checking if tracking is active
chrome.storage.local.get(['isTracking'], (result) => {
  isTracking = result.isTracking || false
  if (isTracking) {
    startPageTracking()
  }
})

// Listen for messages from background or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
void sender;

  switch (message.type) {
    case 'TRACKING_STARTED':
      isTracking = true
      startPageTracking()
      sendResponse({ success: true })
      break

    case 'TRACKING_STOPPED':
      isTracking = false
      stopPageTracking()
      sendResponse({ success: true })
      break

    case 'GET_PAGE_INFO':
      sendResponse({
        title: document.title,
        url: window.location.href,
        activityCount: activityLog.length,
      })
      break

    default:
      sendResponse({ success: false, error: 'Unknown message type' })
  }
})

// Start tracking page activity
function startPageTracking() {
  console.log('Starting page tracking')

  // Track page visibility changes
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Track focus events
  window.addEventListener('focus', handleWindowFocus)
  window.addEventListener('blur', handleWindowBlur)

  // Track clicks (potential distractions)
  document.addEventListener('click', handleClick)

  // Log initial page load
  logActivity('page_load', {
    title: document.title,
    url: window.location.href,
  })
}

// Stop tracking page activity
function stopPageTracking() {
  console.log('Stopping page tracking')

  document.removeEventListener('visibilitychange', handleVisibilityChange)
  window.removeEventListener('focus', handleWindowFocus)
  window.removeEventListener('blur', handleWindowBlur)
  document.removeEventListener('click', handleClick)

  // Send accumulated activity log to background
  if (activityLog.length > 0) {
    chrome.runtime.sendMessage({
      type: 'SAVE_ACTIVITY_LOG',
      data: {
        url: window.location.href,
        activities: activityLog,
      },
    })
    activityLog = []
  }
}

// Event handlers
function handleVisibilityChange() {
  if (!isTracking) return

  logActivity('visibility_change', {
    visible: !document.hidden,
  })
}

function handleWindowFocus() {
  if (!isTracking) return

  logActivity('window_focus', {
    title: document.title,
  })
}

function handleWindowBlur() {
  if (!isTracking) return

  logActivity('window_blur', {
    title: document.title,
  })
}

function handleClick(event: MouseEvent) {
  if (!isTracking) return

  const target = event.target as HTMLElement
  const tagName = target.tagName.toLowerCase()

  // Only log clicks on links and interactive elements
  if (tagName === 'a' || tagName === 'button' || target.onclick !== null) {
    logActivity('click', {
      tagName,
      text: target.textContent?.substring(0, 50),
      href: tagName === 'a' ? (target as HTMLAnchorElement).href : undefined,
    })
  }
}

// Log activity
function logActivity(type: string, data: any) {
  activityLog.push({
    timestamp: Date.now(),
    type,
    data,
  })

  // Periodically send logs to background (every 20 activities)
  if (activityLog.length >= 20) {
    chrome.runtime.sendMessage({
      type: 'SAVE_ACTIVITY_LOG',
      data: {
        url: window.location.href,
        activities: activityLog,
      },
    })
    activityLog = []
  }
}

// Clean up when page is unloaded
window.addEventListener('beforeunload', () => {
  if (isTracking && activityLog.length > 0) {
    chrome.runtime.sendMessage({
      type: 'SAVE_ACTIVITY_LOG',
      data: {
        url: window.location.href,
        activities: activityLog,
      },
    })
  }
})

export {}
