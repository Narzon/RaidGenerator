import React from 'react';
import logo from './logo.svg';
import './App.css';
import Playerlist from './components/Playerlist'
import Jumbotron from 'react-bootstrap/Jumbotron'

function App() {
  return (
    <div className="App">
      <header>
        <Jumbotron>
        <h1>World of Warcraft Raid Generator</h1>
        <p>
          Assemble random raid groups from any guild!
        </p>
        </Jumbotron>

      </header>

      <Playerlist />
      <br>
      </br>
      <br>
      </br>
      <br>
      </br>
      <footer>Compiled by Nicolai Antonov </footer>
    </div>
  );
}

export default App;
