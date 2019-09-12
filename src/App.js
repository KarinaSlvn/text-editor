import React, {Component} from 'react';
import './App.css';
import FileZone from "./file-zone/FileZone";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header>
                    <span>Simple Text Editor</span>
                </header>
                <main>
                    <FileZone/>
                </main>
            </div>
        );
    }
}

export default App;
