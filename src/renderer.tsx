
import {PureComponent} from "react"
import {render} from "react-dom"

import styled from 'styled-components'

import "./style/renderer.css"

const AddressBar = styled.div`
  display: flex;
  gap: 5px;

  .input {
    flex: 1;
  }
`

AddressBar.displayName = "AddressBar"

class ButlerVersion extends PureComponent {
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
      console.log("got response", response)
    })
  }
}

class ProfileList extends PureComponent {
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
        return <li key={profile.id}>{profile.user.username}</li>
      })
    }</ul>
  }

  async componentDidMount() {
    this.setState(Object.assign({
      loading: false
    }, await Butler.call("Profile.List")))
  }

}

class EmbeddedBrowser extends PureComponent {
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

class App extends PureComponent {
  render() {
    return <div>
      <p>Hello world from react test two</p>

      <p>Some versions</p>

      <ul>
        <li>Chrome: {Versions.chrome}</li>
        <li>Node: {Versions.node}</li>
        <li>Electron: {Versions.electron}</li>
      </ul>

      <ButlerVersion />
      <ProfileList />
      <EmbeddedBrowser src="https://itch.io" />
    </div>
  }
}

render(<App />, document.getElementById("app"))

