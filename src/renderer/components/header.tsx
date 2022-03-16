
import React from "react"

import {NavLink, useLocation} from "react-router-dom"

import styled from 'styled-components'

import { useGlobalState } from "renderer/state"

const HeaderDiv = styled.div`
  display: flex;
  gap: 5px;
  background: #fafafa;
  padding: 0 10px;
  height: 50px;
  align-items: center;

  a.active {
    font-weight: bold;
  }

  .currentUser {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .currentLocation {
    margin-left: auto;
  }
`

const CurrentLocation = () => {
  const location = useLocation()

  let fullPath = location.pathname
  if (location.search) {
    fullPath += location.search
  }

  return <span className="currentLocation" title={window.location.toString()}>{fullPath}</span>
}

const CurrentUser = (props) => {
  const {profile} = props

  let profileImage = null
  if (profile.user.coverUrl) {
    profileImage = <img width="30" height="30" src={profile.user.coverUrl} />
  }

  return <div className="currentUser">
    {profileImage} {profile.user.username}
  </div>
}

export default Header = () => {
  const [profile] = useGlobalState("currentProfile")

  return <HeaderDiv>
    <NavLink to="/profiles">Profiles</NavLink>
    {profile ? <NavLink to="/collections">Collections</NavLink> : null}
    <NavLink to="/browser">Browser</NavLink>
    <NavLink to="/versions">Versions</NavLink>

    <CurrentLocation />
    {profile ? <CurrentUser profile={profile} /> : <em>logged out</em>}
  </HeaderDiv>
}

