/// <reference types="chrome"/>

import type { StorageData } from './types'

// Helper functions for Chrome storage API

export const storage = {
  // Get data from chrome.storage.local
  async get<K extends keyof StorageData>(
    keys: K | K[]
  ): Promise<Pick<StorageData, K>> {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys as string | string[], (result) => {
        resolve(result as Pick<StorageData, K>)
      })
    })
  },

  // Set data in chrome.storage.local
  async set<K extends keyof StorageData>(
    data: Pick<StorageData, K>
  ): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, () => {
        resolve()
      })
    })
  },

  // Remove data from chrome.storage.local
  async remove<K extends keyof StorageData>(keys: K | K[]): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.remove(keys as string | string[], () => {
        resolve()
      })
    })
  },

  // Clear all data
  async clear(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.clear(() => {
        resolve()
      })
    })
  },
}

// Listen for storage changes
export function onStorageChange(
  callback: (changes: { [key: string]: chrome.storage.StorageChange }) => void
): void {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local') {
      callback(changes)
    }
  })
}
