// Shared types for ADHD Tracker Chrome Extension

export interface Activity {
  timestamp: number
  type: string
  data: any
}

export interface TrackingSession {
  startTime: number
  endTime?: number
  duration?: number
  activities: Activity[]
}

export interface Settings {
  notificationsEnabled: boolean
  trackingInterval: number // in minutes
}

export interface StorageData {
  isTracking: boolean
  currentSession: TrackingSession | null
  sessionHistory: TrackingSession[]
  settings: Settings
}

// Message types for communication between components
export type MessageType =
  | 'START_TRACKING'
  | 'STOP_TRACKING'
  | 'GET_STATUS'
  | 'TRACKING_STARTED'
  | 'TRACKING_STOPPED'
  | 'GET_PAGE_INFO'
  | 'SAVE_ACTIVITY_LOG'

export interface Message {
  type: MessageType
  data?: any
}

export interface MessageResponse {
  success: boolean
  data?: any
  error?: string
}
