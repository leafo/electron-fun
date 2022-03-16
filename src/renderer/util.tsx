import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useGlobalState } from "renderer/state"

// TODO: apparently this is inclued in react-router-dom
export const useSearchParams = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);

}

export const updatedSearchParams = (params, obj) => {
  const newParams = new URLSearchParams([...params])
  for (const [k,v] of Object.entries(obj)) {
    if (v == "") {
      newParams.delete(k)
    } else {
      newParams.set(k, v)
    }
  }

  return newParams
}

export const useDebounce = (value, timeout=150) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, timeout)
    return () => clearTimeout(timer)
  }, [value, timeout])

  return debouncedValue
}

export const withProfile = (C) => {
  let _withProfile = (props) => {
    const [profile] = useGlobalState("currentProfile")

    if (profile) {
      return <C {...props} profile={profile} />
    } else {
      return null
    }
  }

  return _withProfile
}


