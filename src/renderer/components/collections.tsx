
import styled from 'styled-components'
import React, { useState, useEffect } from "react"

import { Link, useNavigate } from "react-router-dom"

import { useButlerCall } from "renderer/butler"

import { useSearchParams, useDebounce, updatedSearchParams, withProfile } from "renderer/util"

CollectionsPageSection = styled.section`
`

// try adding sort by, sort direction as query parameters for react router
class CollectionList extends React.PureComponent {
  render() {
    let collections = this.props.items.map(c =>
      <li key={c.id}>
        <Link to={`/collections/${c.id}`}>
          {c.title} ({c.gamesCount})
        </Link>
      </li>
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

  return <CollectionsPageSection>
    <div>
      Sort By:
        <Link to={`?${updatedSearchParams(params, { sortBy: "" })}`}>Default</Link>
        <Link to={`?${updatedSearchParams(params, { sortBy: "title" })}`}>Title</Link>
      Filter
        <SearchInput name="search" />
    </div>
    <ProfileCollections />

  </CollectionsPageSection>
}
