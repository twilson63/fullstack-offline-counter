import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PouchDB from 'pouchdb'

const db = PouchDB('counter')
const remoteDb = PouchDB('http://counter:counter@server.pouchcloud.com/counter')
const remote2Db = PouchDB('https://thanimeltedisheremsedagr:578d7f7a102379cb9604b242465592b7b98c13ad@twilson63.cloudant.com/counter')
PouchDB.sync(db, remote2Db, {
  live: true,
  retry: true
})
PouchDB.sync(db, remoteDb, {
  live: true,
  retry: true
})
class App extends Component {
  constructor () {
    super()
    this.state = {
      counter: 0,
      updateDate: new Date().toISOString()
    }
  }
  componentWillMount() {
    db.get('counter')
      .then(doc => this.setState(doc))
    db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', change => {
      this.setState(change.doc)
    })
  }
  render() {
    return (
      <div className="App">
        <h1>Counter</h1>
        <div style={{fontSize: '8em'}}>{this.state.counter}</div>
        <div>Last Updated: { this.state.updateDate }</div>
        <div>
          <button onClick={e => {
            const state = {
              ...this.state,
              _id: 'counter',
              counter: this.state.counter + 1,
              updateDate: new Date().toISOString()
            }

            db.put(state)
          }}>Increment</button>
          <button onClick={e => {
            const state = {
              ...this.state,
              _id: 'counter',
              counter: this.state.counter - 1,
              updateDate: new Date().toISOString()
            }

            db.put(state)

          }}>Decrement</button>

        </div>
      </div>
    );
  }
}

export default App;
