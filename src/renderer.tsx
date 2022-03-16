

import React from "react"
import {render} from "react-dom"

import { HashRouter, Routes, Route, Link, NavLink } from "react-router-dom"

import styled from 'styled-components'
import "./style/renderer.css"
import { setGlobalState } from "renderer/state"
import Header from "renderer/components/header"
import CollectionsPage from "renderer/components/collections"

const AddressBar = styled.div`
  display: flex;
  gap: 5px;

  .input {
    flex: 1;
  }
`

class ButlerVersion extends React.PureComponent {
  constructor() {
    super()
    this.state = { loading: true }
  }

  render() {
    return <div>{this.state.loading ? "Loading" : <code>{this.state.versionString}</code>}</div>
  }

  componentDidMount() {
    Butler.getVersion().then(response => {
      this.setState(Object.assign({ loading: false }, response))
    })
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

    console.log(this.state.profiles)

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

class EmbeddedBrowser extends React.PureComponent {
  constructor() {
    super()
    this.state = {}
  }

  // refresh state from webview
  refreshState(e) {
    const webview = this.webviewRef.current;
    if (!webview) return

    this.setState({
      displayURL: e.url || webview.src,
      canGoBack: webview.canGoBack(),
      canGoForward: webview.canGoForward()
    })
  }

  componentDidMount() {
    const webview = this.webviewRef.current;
    webview.addEventListener("did-navigate", e => {
      this.refreshState(e)
    })

    webview.addEventListener("will-navigate", e => {
      this.refreshState(e)
    })

    webview.addEventListener("did-start-loading", e => {
      this.setState({
        loading: true
      })
    })

    webview.addEventListener("did-stop-loading", e => {
      this.setState({
        loading: false
      })
    })
  }

  render() {
    return <div
      style={{
        border: this.state.loading ? "2px solid red" : "2px solid gray"
      }}
      className="browser">
      <AddressBar>
        <button
          type="button"
          disabled={!this.state.canGoBack}
          onClick={e => {
            this.webviewRef.current?.goBack()
          }}>Back</button>

        <button
          type="button"
          disabled={!this.state.canGoForward}
          onClick={e => {
            this.webviewRef.current?.goForward()
          }}>Forward</button>

        <input className="input" type="text" readOnly value={this.state.displayURL || ""} />

        <button
          type="button"
          onClick={e => {
            this.webviewRef.current?.openDevTools()
          }}>Open Devtools</button>
      </AddressBar>

      <webview
        ref={this.webviewRef ||= React.createRef()}
        src={this.props.src}
        style={{
          width: "100%",
          height: "400px"
        }}/>
    </div>
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
        <Route path="/collections/:collectionId" element={<CollectionsPage />} />
        <Route path="/browser" element={<EmbeddedBrowser src="https://itch.io" />} />
        <Route path="/versions" element={
          <div>
            <ul>
              <li>Chrome: {Versions.chrome}</li>
              <li>Node: {Versions.node}</li>
              <li>Electron: {Versions.electron}</li>
            </ul>
          </div>
        } />
      </Routes>

    </HashRouter>
  }
}

render(<App />, document.getElementById("app"))

