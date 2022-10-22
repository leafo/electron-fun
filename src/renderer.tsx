import React from "react"
import {createRoot} from "react-dom/client"

import { HashRouter, Routes, Route, Link, NavLink } from "react-router-dom"

import styled from 'styled-components'
import "./style/renderer.css"
import { setGlobalState } from "renderer/state"
import Header from "renderer/components/header"

import CollectionsPage from "renderer/components/collections"
import CollectionPage from "renderer/components/collection"
import EmbeddedBrowser from "renderer/components/browser"

class ButlerVersion extends React.PureComponent {
  constructor() {
    super()
    this.state = { loading: true }
  }

  render() {
    return <span>{this.state.loading ? "Loading" : <code>{this.state.versionString}</code>}</span>
  }

  async componentDidMount() {
    const response = await Butler.getVersion()
    this.setState({loading: false, ...response})
  }
}

class ProfileList extends React.PureComponent {
  constructor() {
    super()
    this.state = { loading: true }
  }

  render() {
    if (this.state.loading) {
      return null
    }

    return <ul className="ProfileList">{
      this.state.profiles.map(profile => {
        return <li key={profile.id}>{this.renderProfileButton(profile)}</li>
      })
    }</ul>
  }

  renderProfileButton(profile) {
    return <>
      <button onClick={e => {
        this.activateProfile(profile)
      }}>
        {profile.user.username}
      </button>
      {" "}
      {profile.lastConnected}
    </>
  }

  async activateProfile(profile) {
    const res = await Butler.call("Profile.UseSavedLogin", {
      profileId: profile.id
    })

    // successfully connected
    if (res.profile) {
      setGlobalState({ currentProfile: res.profile })
    }
  }

  async componentDidMount() {
    this.setState(Object.assign({
      loading: false
    }, await Butler.call("Profile.List")))
  }
}

class App extends React.PureComponent {
  // force load first profile for now
  async componentDidMount() {
    let res = await Butler.call("Profile.List")

    // find the most recently connected profile and use that as the default
    if (res.profiles) {
      const profiles = [...res.profiles]
      profiles.sort((a,b) => new Date(b.lastConnected) - new Date(a.lastConnected))

      if (profiles[0]) {
        setGlobalState({ currentProfile: profiles[0] })
      }
    }
  }

  render() {
    return <HashRouter>
      <Header />
      <Routes>
        <Route path="/profiles" element={<ProfileList />} />
        <Route path="/collections" element={<CollectionsPage />} />
        <Route path="/collections/:collectionId" element={<CollectionPage />} />
        <Route path="/browser" element={<EmbeddedBrowser defaultSrc="https://itch.io" />} />
        <Route path="/versions" element={
          <div>
            <ul>
              <li>Chrome: {Versions.chrome}</li>
              <li>Node: {Versions.node}</li>
              <li>Electron: {Versions.electron}</li>
              <li>Butler: <ButlerVersion /></li>
            </ul>
          </div>
        } />
      </Routes>

    </HashRouter>
  }
}

createRoot(document.getElementById("app")).render(<App />)

