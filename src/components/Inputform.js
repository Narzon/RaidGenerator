import React, { Component } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import RaidGenerator from './RaidGenerator'


class Inputform extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            authenticateButton: <div><Button type="button" variant="info" href="https://raidgenerator.herokuapp.com/auth/bnet"><img src={require('../blizzLogin.png')} /></Button><br></br></div>,
            addStatus: "",
            altCounters: 0,
            loadThis: "",
            allAltLists: {},
            currentButton: <Button variant="primary" type="submit" onClick={this.handleClick}>Create Raid</Button>,
            hideForms: true,
            oldProps: {},
            radioElements: <div><input type="radio" value="US" name="region"  defaultChecked/> <span className="radioButton">US</span>&nbsp;&nbsp;&nbsp;&nbsp;
            <input type="radio" value="EU" name="region" /> <span className="radioButton">EU</span></div>
        };
        this.getToken = this.getToken.bind(this)
    }
    componentDidMount = () => {
        //display proper page depending on whether authentication was successful
        if (window.location.pathname === "/loginSuccess") {
            this.setState({authenticateButton: <h1>Obtaining access token ... </h1>})
            this.getToken()
        } else if (window.location.pathname === "/loginFailure") {
            this.setState({authenticateButton: <div><h1>Error logging in, fix credentials!</h1><Button type="button" variant="info" href="https://raidgenerator.herokuapp.com/auth/bnet">Retry Login</Button></div>})
        }
    }
    getToken = () => {
        //grab token from database via backend server
        fetch(`/tokenFromDB`)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            this.setState({token: data.token, authenticateButton: "", hideForms: false})
            console.log("This is the token received: "+this.state.token)
        })     
    }
    handleClick = (event) => {
        //render generated raid group component and modify buttons as appropriate
        event.preventDefault()
        this.setState({ oldProps: this.props})
        this.setState({ loadThis: <RaidGenerator token={this.state.token} onRef={ref => (this.child = ref)} allAltLists={this.state.allAltLists} reqPlayers={this.props.playersRequired} tanksWanted={this.props.tanksWanted} raidSize={this.props.raidSize} healersWanted={this.props.healersWanted} minRank={this.props.minRank} region={this.props.region} realm={this.props.realmName.replace("'", "")} guild={this.props.guildName.replace("'", "")} /> })
        //this.setState( {currentButton: <Button variant="primary" type="submit" onClick={this.render}>Go Back</Button>})
        this.setState({ currentButton: <div><Button variant="primary" type="submit" onClick={this.refreshList}>Randomize Again!</Button>&nbsp;&nbsp;&nbsp;<Button variant="secondary" type="submit" onClick={this.reRenderForms}>Go Back</Button></div> })
        this.setState({ hideForms: true })
    };
    refreshList = (event) => {
        //rerender raid group component
        event.preventDefault()
        this.child.refreshMethod()
    }
    addAnAltList = (event) => {
        //parse alt group strings to reference later
        event.preventDefault()
        let counterString = this.state.altCounters + ""
        this.state.altCounters += 1
        this.setState({ altCounters: this.state.altCounters})
        let newAltList = this.props.excludeAlts.replace(/ /g,"").split(",")
        this.state.allAltLists[counterString] = newAltList
        this.setState({ allAltLists: this.state.allAltLists })
        this.setState({ addStatus: "Alts saved! Feel free to add more lists." })
        this.props.resetExclusionString()
    }
    reRenderForms = (e) => {
        //allow user to go back to information forms with previous information still present
        let oldProps = this.state.oldProps
        if (this.props.region === "EU") {
            this.setState({
                radioElements: <div><input type="radio" value="US" name="region"  /> <span className="radioButton">US</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="radio" value="EU" name="region" defaultChecked /> <span className="radioButton">EU</span></div>
            })
        } else if (this.props.region === "US") {
            this.setState({
                radioElements: <div><input type="radio" value="US" name="region"  defaultChecked/> <span className="radioButton">US</span>&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="radio" value="EU" name="region" /> <span className="radioButton">EU</span></div>
            })
        }
        this.setState({
            hideForms: false,
            currentButton: <Button variant="primary" type="submit" onClick={this.handleClick}>Create Raid</Button> ,
            loadThis: "",
            addStatus: ""
        })
        this.props = oldProps
    }
    render() {
        if (this.state.hideForms === false) {
            return (
                <div>
                    <div onChange={this.props.setRegion} value={this.props.region}>
                        {this.state.radioElements}
                    </div>
                    <Form>
                        <Form.Group controlId="formRealm">
                            <Form.Label>Realm:&nbsp;&nbsp;  </Form.Label>
                            <input type="text"
                                name="realm"
                                value={this.props.realmName}
                                onChange={this.props.setRealmName}
                                placeholder="Enter realm name"
                            />
                        </Form.Group>

                        <Form.Group controlId="formGuild">
                            <Form.Label>Guild:&nbsp;&nbsp;  </Form.Label>
                            <input type="text"
                                name="guild"
                                value={this.props.guildName}
                                onChange={this.props.setGuildName}
                                placeholder="Enter guild name"
                            />
                        </Form.Group>
                        <Form.Label>Minimum Rank:&nbsp;&nbsp;  </Form.Label>
                        <select value={this.props.minRank} onChange={this.props.setMinRank}>
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
                        <select value={this.props.healersWanted} onChange={this.props.setHealersWanted}>
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
                        <select value={this.props.tanksWanted} onChange={this.props.setTanksWanted}>
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
                                value={"" + this.props.raidSize}
                                onChange={this.props.setRaidSize}
                                
                            />
                            <br></br><br></br>
                            <Form.Label> (Optional) Required Players:&nbsp;&nbsp;  </Form.Label>
                            <input type="text"
                                name="reqPlayer"
                                value={this.props.playersRequired}
                                onChange={this.props.setRequiredPlayers}
                                placeholder="Player1, Player2, etc."
                            />

                        </Form.Group>
                        
                        <div>
                            <div>
                                <Form.Label>(Optional) Alt Group:&nbsp;&nbsp;  </Form.Label>
                                <input type="text" value={this.props.excludeAlts} placeholder="Main, Alt1, Alt2, etc." onChange={this.props.setExcludeAlts} /> <span></span> <span></span>
                                <Button variant="secondary" type="button" onClick={this.addAnAltList} >Add list of alts</Button>&nbsp;<Button variant="danger" type="button" onClick={()=>{this.setState({allAltLists: {}, addStatus: "Alts cleared!"})}}>Clear</Button>
                            </div>
                            <p>{this.state.addStatus}</p>
                        </div>
                        {this.state.currentButton}
                    </Form>
                    {this.state.loadThis}
                </div>
            )
            //render generated raid group
        } else if (this.state.authenticateButton === "") {
            return(<div>{this.state.currentButton}
            {this.state.loadThis}</div>)
            //present button to authenticate Blizzard user
        } else {
            return (<div>
                    {this.state.authenticateButton}
                    </div>)
        }
    }
}

export default Inputform