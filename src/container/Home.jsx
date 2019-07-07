import React, { Component } from 'react';
import Block from "../components/Block";
import Header from "../components/layout/Header";
import { JSONManager } from "../renderer/json-manager";
import { ipcRenderer } from 'electron';
import './css/ViewPage.css';

const jsonManager = new JSONManager();

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      timeline: {}
    }
  }

  componentDidMount() {
    ipcRenderer.on('sync-with-note', (event, note) => {
      this.setState({
        timeline: note
      });
      console.log(this.state.timeline);
    });
  }

  // Delete Todo
  delTodo = (time) => {
    console.log('Now you choose the block', time);
    this.setState({
      timeline: { blocks: [...this.state.timeline.blocks.filter(block => block.timestamp !== time)] }
    })
  }

  // Add Description
  addDescription = (des, time) => {
    let data = this.state.timeline.blocks;

    data.map((block) => {
      // assign the description to the block you point
      if (block.timestamp === time) {
        block.description = des
      }
      this.setState({
        timeline: {
          blocks: data
        }
      })
    })
  }

  render() {
    // Yield undefined, because the first value it gets is undefined
    if (this.state.timeline.blocks === undefined) { return null }

    //progressBar related
    window.onscroll = () =>{
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      let h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      let scrolled = (winScroll / h) * 100;
      document.getElementById("bar").style.height = scrolled + "%";
    }


    return (
      <div className="App">
        <div className="container" >
          <Header />
          <body>

            <div className="progressContainer">
              <div className="progressBar" id="bar"></div>
            </div>
            
            <Block
              blocks={this.state.timeline.blocks}
              delTodo={this.delTodo}
              addDescription={this.addDescription}
            />
          </body>

            <ul className="navigatorBar">
              <li><a href="#"><i className="fas fa-bars"></i></a></li> 
              <li><input className="search" type="text" value=""/></li>
              <li><a href="#"><i className="fas fa-search"></i></a></li>
              <li><a href="#"><i className="fas fa-compress-arrows-alt"></i></a></li>
              <li><a href="#"><i className="fas fa-edit"></i></a></li>
              <li><a href="#"><i className="fas fa-times"></i></a></li>
            </ul>
            
        </div>
      </div>
    )
  }
}

export default Home;