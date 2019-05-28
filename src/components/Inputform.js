import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Select from 'react-select';
import Button from 'react-bootstrap/Button'
import RaidGenerator from './RaidGenerator'

class Inputform extends Component {
    constructor() {
        super();
        this.state = {
          region: "us",
          realm: "",
          guild: "",
          loadThis: <h1>Enter Your Information Above</h1>,
          minRank: 10,
          healersWanted: 5,
          raidSize: 20,
          tanksWanted: 2,
          reqPlayers: "",
          currentButton: <Button variant="primary" type="submit" onClick={this.handleClick}>Submit</Button>

        }; 
      }
      
    handleClick = (event) => {
        event.preventDefault()
        
        this.setState( {loadThis: <RaidGenerator reqPlayers={this.state.reqPlayers} tanksWanted={this.state.tanksWanted} raidSize={this.state.raidSize} healersWanted={this.state.healersWanted} minRank={this.state.minRank} region={this.state.region} realm={this.state.realm.replace("'","")} guild={this.state.guild.replace("'","")}/>})
        this.setState( {currentButton: <Button variant="primary" type="submit" onClick={this.render}>Go Back</Button>})


        };

    changeRealmHandler = (event) => {
        this.setState({
            realm: event.target.value
        });
        }
    changeGuildHandler = (event) => {
        this.setState({
            guild: event.target.value
        });
        }
    setRegion = (event) => {
        this.setState({region: event.target.value})
    }
    handleMinChange = (event) => {
        let minValue = Number(event.target.value)
        this.setState({minRank: minValue})
        
    }
    handleHealerChange = (event) => {
        let healerValue = Number(event.target.value)
        this.setState({healersWanted: healerValue})
    }
    changeRaidHandler = (event) => {
        let raidValue = Number(event.target.value)
        this.setState({raidSize: raidValue})
    }
    changeTankHandler = (event) => {
        let tanksValue = Number(event.target.value)
        this.setState({tanksWanted: tanksValue})
    }
    changeReqHandler = (event) => {
        this.setState({reqPlayers: event.target.value})
    }
    render () {
        return (
                <div>
                    <div onChange={this.setRegion.bind(this)}>
                        <input type="radio" value="US" name="region"/> US&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="radio" value="EU" name="region"/> EU
                    </div>
                <Form>
                <Form.Group controlId="formRealm">
                    
                    
                    <Form.Label>Realm:&nbsp;&nbsp;  </Form.Label>
                    <input type="text" 
                            name="realm"   
                            value={this.state.realm} 
                            onChange={this.changeRealmHandler} 
                    />
                </Form.Group>

                <Form.Group controlId="formGuild">
                    <Form.Label>Guild:&nbsp;&nbsp;  </Form.Label>
                    <input type="text" 
                            name="guild"   
                            value={this.state.guild} 
                            onChange={this.changeGuildHandler} 
                    />
                </Form.Group>
                <Form.Label>Minimum Rank:&nbsp;&nbsp;  </Form.Label>
                    <select value={this.state.minRank} onChange={this.handleMinChange}>
                        <option value="10">10</option>
                        <option value="9">9</option>
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>

                    </select>&nbsp;&nbsp;
                <Form.Label>Healers:&nbsp;&nbsp;  </Form.Label>
                    <select value={this.state.healersWanted} onChange={this.handleHealerChange}>
                        <option value="10">10</option>
                        <option value="9">9</option>
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>

                    </select>&nbsp;&nbsp;
                <Form.Label>Tanks:&nbsp;&nbsp;  </Form.Label>
                    <select value={this.state.tanksWanted} onChange={this.changeTankHandler}>
                        <option value="10">10</option>
                        <option value="9">9</option>
                        <option value="8">8</option>
                        <option value="7">7</option>
                        <option value="6">6</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>

                    </select>
                    
                    <br></br>
                    <Form.Group controlId="formWanted">
                    
                    
                    <Form.Label>Raid Size:&nbsp;&nbsp;  </Form.Label>
                        <input type="text" 
                                name="raid"   
                                value={""+this.state.raidSize} 
                                onChange={this.changeRaidHandler} 
                        />
                        <br></br>
                    <Form.Label>Required Players (separate by , ) :&nbsp;&nbsp;  </Form.Label>
                        <input type="text" 
                                name="reqPlayer"   
                                value={this.state.reqPlayers} 
                                onChange={this.changeReqHandler} 
                        />
                    
                    </Form.Group>
                <br></br>
                {this.state.currentButton}
                </Form>
                    {this.state.loadThis}
                </div>
            )
    }
}

export default Inputform