import React, { Component } from 'react';
import BlockContainer from "./BlockContainer";
import Header from "../components/layout/Header";
import Progressbar from "../components/layout/Progressbar";
import Navigationbar from '../components/layout/Navigationbar';
import './css/Timeline.css';

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { ipcRenderer } from "electron";
const Mousetrap = require('mousetrap');

class Timeline extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saveSign: true,
      note_title: ''
    }
  }

  componentDidMount() {
    ipcRenderer.on('init-note-title', (event, args) => {
      let title = args.split('\\').pop()
      title = title.split('.')[0]
      this.setState({
        note_title: title
      });
    });

    // When you press stop recording, then you could save slu
    ipcRenderer.on('savebutton', () => {
      this.setState({
        saveSign: !this.state.saveSign
      });
    });

    // When you press start recording, the you could not save slu
    ipcRenderer.on('hidesavebutton', () => {
      this.setState({
        saveSign: !this.state.saveSign
      });
    });

    // With Mousetrap package, you should specify "Ctrl" as "ctrl"
    Mousetrap.bind(['ctrl+s', 'ctrl+S'], () => {
      this.saveChange();
    });

    Mousetrap.bind(['ctrl+z', 'ctrl+Z'], () => {
      ipcRenderer.send('pre-step-click');
    });

    Mousetrap.bind(['ctrl+y', 'ctrl+Y'], () => {
      ipcRenderer.send('next-step-click');
    });
  }

  // Return to Mainwindow
  returnToMain = () => {
    ipcRenderer.send('slu-return-to-main');
  }

  // Write the data model to the json file
  saveChange = () => {
    ipcRenderer.send('Navbar-save-slu');
  }

  scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  handleClickPreviousStep = () => {
    ipcRenderer.send('pre-step-click');
  }

  handleClickNextStep = () => {
    ipcRenderer.send('next-step-click');
  }

  handleTitleChanged = (title) => {
    if(title === ''){
      return;
    }else{
      this.setState({
        note_title: title
      });
    }
  }

  render() {
    return (
      <BlockUi tag="div" blocking={!this.state.saveSign
      } >
        <div className="App" id="App">
          <div className="pageContent" id="content">
            <Header title={this.state.note_title} handleTitleChanged={this.handleTitleChanged} />
            <div><Progressbar /></div>
            <BlockContainer
              onNewBlock={this.scrollToBottom}
              ReturnToTop={this.scrollToTop}
              clickHome={this.returnToMain}
              clickSave={this.state.saveSign && this.saveChange}
            />
            <Navigationbar
              clickPreviousStep={this.handleClickPreviousStep}
              clickNextStep={this.handleClickNextStep}
              clickSave={this.saveChange}
              clickHome={this.returnToMain}
              clickTop={this.scrollToTop}
              clickBottom={this.scrollToBottom}
            />
          </div>
        </div>
      </BlockUi >
    )
  }
}

export default Timeline;
