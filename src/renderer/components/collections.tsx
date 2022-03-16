
import styled from 'styled-components'
import React from "react"

import { useGlobalState } from "renderer/state"
import { useButlerCall } from "renderer/butler"

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

CollectionListUl = styled.ul`
`

class CollectionList extends React.PureComponent {
  render() {
    let collections = this.props.items.map(c =>
      <li key={c.id}>{c.title} ({c.gamesCount})</li>
    )
    return <CollectionListUl>{collections}</CollectionListUl>
  }
}

export const ProfileCollections = withProfile((props) => {
  const res = useButlerCall("Fetch.ProfileCollections", {
    profileId: props.profile.id
  })

  if (res) {
    return <CollectionList {...res} />
  }
  return null
})



