
import React, {useEffect} from "react"
import styled from 'styled-components'

import { withSearchParams } from "renderer/util"

import { useSearchParams, createSearchParams, Link } from "react-router-dom"

const AddressBar = styled.div`
  display: flex;
  gap: 5px;

  .input {
    flex: 1;
  }
`


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
        key="webview"
        ref={this.webviewRef ||= React.createRef()}
        src={this.props.url || this.props.defaultSrc}
        style={{
          width: "100%",
          height: "400px"
        }}/>

      <p>Bookmarks</p>
      <ul>
        <li>
          <Link to={`/browser?${createSearchParams({url: "https://leafo.net"})}`}>leafo.net</Link>
        </li>
        <li>
          <Link to={`/browser?${createSearchParams({url: "https://itch.io"})}`}>itch.io</Link>
        </li>
      </ul>
    </div>
  }
}

export default withSearchParams(EmbeddedBrowser, ["url"])

