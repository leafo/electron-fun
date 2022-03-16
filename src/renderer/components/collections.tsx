
import styled from 'styled-components'
import React, { useState, useEffect } from "react"

import { Link, useNavigate } from "react-router-dom"

import { useGlobalState } from "renderer/state"
import { useButlerCall } from "renderer/butler"

import { useSearchParams, useDebounce, updatedSearchParams } from "renderer/util"

const withProfile = (C) => {
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

CollectionsPageDiv = styled.ul`
`

// try adding sort by, sort direction as query parameters for react router
class CollectionList extends React.PureComponent {
  render() {
    let collections = this.props.items.map(c =>
      <li key={c.id}>{c.title} ({c.gamesCount})</li>
    )
    return <ul>{collections}</ul>
  }
}

const ProfileCollections = withProfile((props) => {
  const params = useSearchParams()

  const res = useButlerCall("Fetch.ProfileCollections", {
    profileId: props.profile.id,
    sortBy: params.get("sortBy"),
    search: params.get("search")
  })

  if (res) {
    return <CollectionList {...res} />
  }
  return null
})

const SearchInput = (props) => {
  const [value, setValue] = useState("")

  const debouncedValue = useDebounce(value)

  const params = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (debouncedValue != (params.get("search") || "")) {
      navigate("?" + updatedSearchParams(params, {
        search: debouncedValue
      }).toString(), { replace: true })
    }
  }, [debouncedValue])

  return <input
    onChange={e => {
      const value = e.target.value
      setValue(value)
    }}
    name={props.name}
    value={value}
    type="text" />
}


export default CollectionsPage = (props) => {
  const params = useSearchParams()

  return <CollectionsPageDiv>
    <div>
      Sort By:
        <Link to={`?${updatedSearchParams(params, { sortBy: "" })}`}>Default</Link>
        <Link to={`?${updatedSearchParams(params, { sortBy: "title" })}`}>Title</Link>
      Filter
        <SearchInput name="search" />
    </div>
    <ProfileCollections />
  </CollectionsPageDiv>
}
