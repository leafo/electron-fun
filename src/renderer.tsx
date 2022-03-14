
import {PureComponent} from "react"
import {render} from "react-dom"

class WebView extends PureComponent {
	render() {
		return <div clas="browser">
			<button
				type="button"
				onClick={e => {
					this.webviewRef.current?.openDevTools()
				}}>Open Devtools</button>

			<webview
				ref={this.webviewRef ||= React.createRef()}
				src="https://itch.io"
				style={{
					width: "600px",
					height: "400px"
				}}/>
		</div>
	}
}

class App extends PureComponent {
	render() {
		return <div>
			<p>Hello world from react app</p>

			<p>Some versions</p>

			<ul>
				<li>Chrome: {Versions.chrome}</li>
				<li>Node: {Versions.node}</li>
				<li>Electron: {Versions.electron}</li>
			</ul>

			<WebView />
		</div>
	}
}

render(<App />, document.getElementById("app"))

