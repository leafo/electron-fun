
import styled from 'styled-components'
import React, { useState, useEffect } from "react"

import { useParams, createSearchParams, Link } from 'react-router-dom'
import { useButlerCall } from "renderer/butler"
import { withProfile } from 'renderer/util'

const withCollection = (C) => {
  const _withCollection = withProfile((props) => {
    const { collectionId } = useParams()

    const res = useButlerCall("Fetch.Collection", {
      profileId: props.profile.id,
      collectionId: parseInt(collectionId),
    })

    if (res) {
      // note this passes through profile
      return <C {...res} {...props} />
    } else {
      return null
    }
  })

  return _withCollection
}

const CollectionGamesList = (props) => {
  return <ul>
    {props.items.map(cg => {
      const gameUrl = `/browser?${createSearchParams({url: cg.game.url})}`
      return <li key={`cg-${cg.collectionId}-${cg.gameId}`}>
        <Link to={gameUrl}>{cg.game.title}</Link>
      </li>
    })}
  </ul>
}

export default CollectionPage = withCollection((props) => {
  const {collection} = props

  const res = useButlerCall("Fetch.Collection.Games", {
    profileId: props.profile.id,
    collectionId: collection.id,
    limit: 50
  })

  return <section>
    <h1>{props.collection.title}</h1>
    <ul>
      <li>Created at: {collection.createdAt}</li>
      <li>Updated at: {collection.updatedAt}</li>
      <li>Games count: {collection.gamesCount}</li>
    </ul>
    {res ? <CollectionGamesList {...res} /> : null }
  </section>
})

