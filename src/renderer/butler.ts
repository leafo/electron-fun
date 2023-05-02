
import { useState, useEffect } from "react"

export const useButlerCall = (method, params) => {
  const [result, setResult] = useState(null)

  const deps = [method]

  // params must be serialized into dependencies to prevent infinite re-renders.
  // Can not use object directly since object is typically different instance
  // with same value
  if (params)  {
    for (const key of Object.keys(params).sort()) {
      deps.push(key)
      deps.push(params[key])
    }
  }

  useEffect(() => {
    async function call() {
      setResult(await Butler.call(method, params))
    }

    call().catch(console.error)
  }, deps)

  return result
}
