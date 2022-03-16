import { useState, useEffect } from "react"
import { useLocation, useSearchParams } from "react-router-dom"
import { useGlobalState } from "renderer/state"

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


// pulls names from search params and converts them into props
export const withSearchParams = (C, names=[]) => {
  const _withSearchParams = (props) => {
    const [params] = useSearchParams()

    const paramsProps = {}
    names.forEach(k => { paramsProps[k] = params.get(k) })
    return <C {...props} {...paramsProps} />
  }

  return _withSearchParams
}

