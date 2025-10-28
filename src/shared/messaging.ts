/// <reference types="chrome"/>

import type { Message, MessageResponse, MessageType } from './types'

// Helper functions for Chrome messaging API

export const messaging = {
  // Send message to background script
  async sendToBackground(
    type: MessageType,
    data?: any
  ): Promise<MessageResponse> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ type, data }, (response: MessageResponse) => {
        resolve(response || { success: false, error: 'No response' })
      })
    })
  },

  // Send message to content script in a specific tab
  async sendToTab(
    tabId: number,
    type: MessageType,
    data?: any
  ): Promise<MessageResponse> {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, { type, data }, (response: MessageResponse) => {
        resolve(response || { success: false, error: 'No response' })
      })
    })
  },

  // Send message to all tabs
  async sendToAllTabs(type: MessageType, data?: any): Promise<void> {
    const tabs = await chrome.tabs.query({})
    await Promise.all(
      tabs.map((tab) => {
        if (tab.id) {
          return this.sendToTab(tab.id, type, data)
        }
      })
    )
  },

  // Listen for messages
  onMessage(
    callback: (
      message: Message,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response: MessageResponse) => void
    ) => boolean | void
  ): void {
    chrome.runtime.onMessage.addListener(callback)
  },
}
