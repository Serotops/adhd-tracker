/// <reference types="chrome"/>

// Background service worker for ADHD Tracker Chrome Extension

console.log('ADHD Tracker background service worker loaded')

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('ADHD Tracker extension installed')
    // Initialize default settings
    chrome.storage.local.set({
      isTracking: false,
      sessionHistory: [],
      settings: {
        notificationsEnabled: true,
        trackingInterval: 30, // minutes
      },
    })
  } else if (details.reason === 'update') {
    console.log('ADHD Tracker extension updated')
  }
})

// Listen for messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message)
  void sender;

  switch (message.type) {
    case 'START_TRACKING':
      handleStartTracking()
      sendResponse({ success: true })
      break

    case 'STOP_TRACKING':
      handleStopTracking()
      sendResponse({ success: true })
      break

    case 'GET_STATUS':
      getTrackingStatus().then(sendResponse)
      return true // Will respond asynchronously

    default:
      console.warn('Unknown message type:', message.type)
      sendResponse({ success: false, error: 'Unknown message type' })
  }
})

// Handle starting a tracking session
async function handleStartTracking() {
  console.log('Starting tracking session')
  const startTime = Date.now()

  await chrome.storage.local.set({
    isTracking: true,
    currentSession: {
      startTime,
      activities: [],
    },
  })

  // Set up periodic check-ins using alarms
  chrome.alarms.create('trackingCheckIn', { periodInMinutes: 5 })

  // Send notification
  if (await isNotificationEnabled()) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'ADHD Tracker',
      message: 'Tracking session started',
    })
  }
}

// Handle stopping a tracking session
async function handleStopTracking() {
  console.log('Stopping tracking session')

  const data = await chrome.storage.local.get(['currentSession', 'sessionHistory'])
  const currentSession = data.currentSession

  if (currentSession) {
    const endTime = Date.now()
    const completedSession = {
      ...currentSession,
      endTime,
      duration: endTime - currentSession.startTime,
    }

    const sessionHistory = data.sessionHistory || []
    sessionHistory.push(completedSession)

    await chrome.storage.local.set({
      isTracking: false,
      currentSession: null,
      sessionHistory,
    })
  }

  // Clear the alarm
  chrome.alarms.clear('trackingCheckIn')

  // Send notification
  if (await isNotificationEnabled()) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon48.png',
      title: 'ADHD Tracker',
      message: 'Tracking session stopped',
    })
  }
}

// Get current tracking status
async function getTrackingStatus() {
  const data = await chrome.storage.local.get(['isTracking', 'currentSession'])
  return {
    isTracking: data.isTracking || false,
    currentSession: data.currentSession || null,
  }
}

// Check if notifications are enabled
async function isNotificationEnabled(): Promise<boolean> {
  const data = await chrome.storage.local.get('settings')
  return data.settings?.notificationsEnabled ?? true
}

// Handle periodic check-ins during tracking
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'trackingCheckIn') {
    console.log('Tracking check-in')
    // Here you could send a notification or update the badge
    chrome.action.setBadgeText({ text: '•' })
    chrome.action.setBadgeBackgroundColor({ color: '#667eea' })
  }
})

// Keep service worker alive (Chrome MV3 service workers can be terminated)
// This is a workaround to keep it more persistent
let keepAliveInterval: number | undefined

function keepAlive() {
  keepAliveInterval = setInterval(() => {
    console.log('Keep alive ping')
  }, 20000) // Every 20 seconds
}

function stopKeepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval)
  }
}

// Start keep alive
keepAlive()

// Export for testing
export { handleStartTracking, handleStopTracking, getTrackingStatus, stopKeepAlive }
