
import { useState, useEffect } from "react"

const appState = {}
const listeners = {}

export const getAppState = () => appState
export const getListeners = () => listeners

export const setGlobalState = (obj) => {
  console.log("setting global state", obj)
  const entries = Object.entries(obj)

  // note we update the object together first, before notifying listeners to
  // have an 'atomic' update
  for (const [k,v] of entries) {
    appState[k] = v
  }

  for (const [k,v] of entries) {
    listeners[k]?.forEach(listener => listener(appState[k]))
  }
}

export const useGlobalState = (name) => {
  const [currentValue, setCurrentValue] = useState(appState[name])

  useEffect(() => {
    listeners[name] ||= []
    listeners[name].push(setCurrentValue)

    return () => {
      // filter out the listener
      listeners[name] = listeners[name].filter(l => l != setCurrentValue)
    }
  }, [name, setCurrentValue])

  return [
    currentValue,

    // note this doesn't support the function syntax of setState
    (newValue) => {
      const update = {}
      update[name] = newValue
      setGlobalState(update)
    }
  ]
}
  
