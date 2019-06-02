import React from 'react';
import './App.css';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Inputform from './containers/InputformContainer'


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
      <Inputform />
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
