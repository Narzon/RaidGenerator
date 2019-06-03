import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
const fetch = require('node-fetch');


class RaidGenerator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            generatedRaid: [<h1 key="placeholder">Loading ... </h1>],
            region: this.props.region,
            realmName: this.props.realm,
            guildName: this.props.guild,
            raidSize: this.props.raidSize,
            tanksWanted: this.props.tanksWanted,
            minRank: this.props.minRank,
            healersWanted: this.props.healersWanted,
            excludeAlts: this.props.allAltLists,
            token: this.props.token,
            namesOfMembers: [],
            playersRequired: this.fixNameFormat(this.props.reqPlayers.replace(/\s/g, "").split(",")),
            alreadyRerolled: []
        }
    }

    fixRole(aString) {
        if (aString === "DPS") {
            return "DPS"
        } else if (aString === "TANK") {
            return "Tank"
        } else if (aString === "HEALING") {
            return "Healer"
        }
    }
    fixNameFormat(anArray) {
        let newArray = []
        for (let i = 0; i < anArray.length; i++) {
            newArray.push(anArray[i].charAt(0).toUpperCase() + anArray[i].slice(1).toLowerCase());
        }
        return newArray
    }

    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    //filter by characters at max level and above minimum rank
    filter_120s(member) {
        return (member.character.level === 120 && member.rank <= this.state.minRank);
    }
    //check to see if name of generated character is viable for new raid group
    nameIsUnique(aName) {
        let canIUse = true
        // if name exists in raid already, return false
        if (this.state.namesOfMembers.indexOf(aName) !== -1) {
            canIUse = false
            return canIUse
        }
        // if a name is required, it will be added automatically and is not unique
        if (this.state.playersRequired.indexOf(aName) !== -1) {
            canIUse = false
            return canIUse
        }
        // if a name has already been rerolled, return false
        if (this.state.alreadyRerolled.indexOf(aName) !== -1) {
            canIUse = false
            return canIUse
        }
        // check to see if name exists in any of the excludeAlts arrays
        let altsList = Object.keys(this.state.excludeAlts)
        altsList.map((stringName) => {
            let fixedArray = this.fixNameFormat(this.state.excludeAlts[stringName])
            if (fixedArray.indexOf(aName) !== -1) {
                console.log("the name trying to be added exists in the following array: "+fixedArray)
                // if it does, check to see if any other alt names in that array exist within raid or playersRequired already
                fixedArray.map((name) => {
                    // if one does, return false
                    if (this.state.namesOfMembers.indexOf(name) !== -1 || this.state.playersRequired.indexOf(name) !== -1) {
                        console.log("found a name that exists in an array of exceptions")
                        console.log("name that tried to be added: "+aName)
                        console.log("array that it existed in: "+fixedArray)
                        console.log("name that already exists in raid from same array: "+name)
                        canIUse = false
                        return canIUse
                    }
                })
            }
        })
        return canIUse
    }
    //clear list of names upon generating a new list
    refreshMethod() {
        this.setState({namesOfMembers: []})
        this.CreateARaid(this.state.healersWanted, this.state.raidSize, this.state.tanksWanted, this.state.playersRequired)
    }
    CreateARaid = (healerNum, raidSize, tankNum, requiredPlayerArray) => {
        let loops = 0
        let couldNotFind = false
        //keep track of loops to cancel search if too many

        var self = this
        if (healerNum === undefined) {
            healerNum = 5
        }
        if (tankNum === undefined) {
            tankNum = 2
        }
        if (raidSize === undefined) {
            raidSize = 20
        }
        let dpsNum = raidSize - healerNum - tankNum
        //counters of various roles currently in raid group
        let healers = 0
        let dps = 0
        let tanks = 0

        let raid = []
        // add all (if any) players from the requiredPlayerArray argument
        if (requiredPlayerArray[0]) {
            for (let i = 0; i < requiredPlayerArray.length; i++) {
                let newPlayer = fetch(`https://${this.state.region}.api.blizzard.com/wow/guild/${this.state.realmName}/${this.state.guildName}?fields=members&locale=en_US&access_token=${this.state.token}`)
                    .then((response) => {
                        return response.json();
                    })
                    .then((myJson) => {
                        if (myJson.members === undefined) {
                            self.setState({ generatedRaid: <h1>Error! Try to fix information!</h1> })
                            return
                        }

                        let found = myJson.members.find(function (element) {
                            return element.character.name === requiredPlayerArray[i];
                        });
                        if (found === undefined) {
                            couldNotFind = true
                            console.log("the wrong uri was: ")
                            console.log(`https://${this.state.region}.api.blizzard.com/wow/guild/${this.state.realmName}/${this.state.guildName}?fields=members&locale=en_US&access_token=${this.state.token}`)
                            alert("Can't find one or more required members!")
                            self.setState({ generatedRaid: <h1>Error! Try to fix required players info!</h1> })
                            return 
                        }
                        if (found.character.spec.role === "TANK") {
                            tanks += 1
                            
                        } else if (found.character.spec.role === "HEALING") {
                            healers += 1
                            
                        } else if (found.character.spec.role === "DPS") {
                            dps += 1
                            
                        }
                        if (couldNotFind) {
                            return
                        }
    
                        return found      
                    })
                raid.push(newPlayer)
            }
        } 
        // fill the raid with appropriate random players
        while (raid.length < raidSize) {
            let aNewPlayer =
                fetch(`https://${this.state.region}.api.blizzard.com/wow/guild/${this.state.realmName}/${this.state.guildName}?fields=members&locale=en_US&access_token=${this.state.token}`)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (myJson) {
                        if (myJson.members === undefined) {
                            self.setState({ generatedRaid: <h1>Error! Try to fix information!</h1> })
                            return
                        }
                        let maxLevelPlayers = myJson.members.filter((member) => {
                            return (member.character.level === 120 && member.rank <= self.state.minRank);
                        })
                        let maxLength = maxLevelPlayers.length
                        // boolean value to keep track of when a randomly selected character is eligible to be added
                        let acceptablePlayer = false
                        let randomPlayer = {}
                        
                        while (acceptablePlayer === false && loops < 5000) {
                            randomPlayer = maxLevelPlayers[self.getRandomInt(maxLength)]
                            while (randomPlayer.character.spec === undefined) {
                                randomPlayer = maxLevelPlayers[self.getRandomInt(maxLength)]
                            }
                            if (randomPlayer.character.spec.role === "TANK" && tanks < tankNum && self.nameIsUnique(randomPlayer.character.name)) {
                                tanks += 1
                                self.state.namesOfMembers.push(randomPlayer.character.name)
                                acceptablePlayer = true
                            } else if (randomPlayer.character.spec.role === "HEALING" && healers < healerNum && self.nameIsUnique(randomPlayer.character.name)) {
                                healers += 1
                                self.state.namesOfMembers.push(randomPlayer.character.name)
                                acceptablePlayer = true
                            } else if (randomPlayer.character.spec.role === "DPS" && dps < dpsNum && self.nameIsUnique(randomPlayer.character.name)) {
                                dps += 1
                                self.state.namesOfMembers.push(randomPlayer.character.name)
                                acceptablePlayer = true
                            }

                            loops += 1
                            
                        }
                        if (loops > 4999) {
                            self.setState({ generatedRaid: <h1>Error! Can't find enough players! Try searching for more ranks.</h1> })
                            return
                        }
                                        
                        return (randomPlayer);
                    })
            raid.push(aNewPlayer)
        }
        Promise.all(raid).then(result => {
            
            if (result[0] === undefined || loops > 4999 || (couldNotFind)) {
                return
            }
            let namesArray = []
            let euToGb = ""
            if (this.state.region === "EU") {
                euToGb = "gb"
            } else {
                euToGb = "us"
            }
            namesArray = result.map((char, index) => {
                if (requiredPlayerArray.indexOf(char.character.name) !== -1) {
                    return <div  className="raid-member" key={char.character.spec.role + (index+1)}><img src={`http://render-${this.state.region}.worldofwarcraft.com/character/${char.character.thumbnail}`}></img>&nbsp;&nbsp;{char.character.name} - {this.fixRole(char.character.spec.role)} - Rank: {char.rank}&nbsp;&nbsp;<Button onClick={() => {this.handleCharClick(`https://worldofwarcraft.com/en-${euToGb}/character/${this.state.region.toLowerCase()}/${this.state.realmName.replace(" ","-")}/${char.character.name}`)}} size="sm" variant="outline-info">Armory</Button></div>
                } else {
                    return <div  className="raid-member" key={char.character.spec.role + (index+1)}><img src={`http://render-${this.state.region}.worldofwarcraft.com/character/${char.character.thumbnail}`}></img>&nbsp;&nbsp;{char.character.name} - {this.fixRole(char.character.spec.role)} - Rank: {char.rank}&nbsp;&nbsp;<Button size="sm" variant="outline-success" onClick={()=>{this.refreshOne(index+1, char.character.name)}}>Reroll</Button><Button onClick={() => {this.handleCharClick(`https://worldofwarcraft.com/en-${euToGb}/character/${this.state.region.toLowerCase()}/${this.state.realmName.replace(" ","-")}/${char.character.name}`)}} size="sm" variant="outline-info">Armory</Button></div>
                }
            })
            namesArray.push(
                <h1 key="footer">Tanks: {"" + tankNum}, Healers: {"" + healerNum}, DPS: {"" + dpsNum}</h1>
            )
            namesArray.unshift(
            <div key="header"><h1>Raid Size: {raidSize}</h1></div>
            )
            this.setState({ generatedRaid: namesArray })
        }) 

    }
    handleCharClick = (url)=> {
        var win = window.open(url, '_blank');
        win.focus();
    }
    //generate a new player of the same role for given index
    refreshOne = (index, name) => {
        // remove name of member to be refreshed from array to prevent alts from being excluded
        let newNamesOfMembers = this.state.namesOfMembers
        for (let i = 0; i < newNamesOfMembers.length; i++) {
            if (newNamesOfMembers[i] === name) {
                newNamesOfMembers.splice(i, 1)
            }
        }
        this.setState({namesOfMembers: newNamesOfMembers})
        // add name to alreadyRerolled array to prevent it appearing again
        let newAlreadyRerolled = this.state.alreadyRerolled
        newAlreadyRerolled.push(name)
        this.setState({alreadyRerolled: newAlreadyRerolled})
        // find a valid new random player of the same role 
        let loops = 0
        let oldRole = ""
        if (this.state.generatedRaid[index].key === "DPS" + index) {
            oldRole = "DPS"
        } else if (this.state.generatedRaid[index].key === "TANK" + index) {
            oldRole = "TANK"
        } else if (this.state.generatedRaid[index].key === "HEALING" + index) {
            oldRole = "HEALING"
        }
        fetch(`https://${this.state.region}.api.blizzard.com/wow/guild/${this.state.realmName}/${this.state.guildName}?fields=members&locale=en_US&access_token=${this.state.token}`)
                    .then((response) => {
                        return response.json();
                    })
                    .then((myJson) => {
                        if (myJson.members === undefined) {
                            this.setState({ generatedRaid: <h1>Error! Try to fix information!</h1> })
                            return
                        }
                        let maxLevelPlayers = myJson.members.filter((member) => {
                            return (member.character.level === 120 && member.rank <= this.state.minRank);
                        })
                        let maxLength = maxLevelPlayers.length
                        // boolean value to keep track of when a randomly selected character is eligible to be added
                        let acceptablePlayer = false
                        let randomPlayer = {}
                        
                        while (acceptablePlayer === false && loops < 5000) {
                            randomPlayer = maxLevelPlayers[this.getRandomInt(maxLength)]
                            while (randomPlayer.character.spec === undefined) {
                                randomPlayer = maxLevelPlayers[this.getRandomInt(maxLength)]
                            }
                            if (randomPlayer.character.spec.role === oldRole  && this.nameIsUnique(randomPlayer.character.name)) {
                                this.state.namesOfMembers.push(randomPlayer.character.name)
                                acceptablePlayer = true
                            } 
                            loops += 1
                        }
                        if (loops > 4999) {
                            this.setState({ generatedRaid: <h1>Error! Can't find enough players! Try searching for more ranks.</h1> })
                            return
                        }
                                        
                        return (randomPlayer);
                    }).then((char)=> {
                        if (char === undefined) {
                            return 
                        }
                        let euToGb = ""
                        if (this.state.region === "EU") {
                            euToGb = "gb"
                        } else {
                            euToGb = "us"
                        }
                        let returnArray = this.state.generatedRaid
                        returnArray[index] = <div className="raid-member" key={oldRole+index}><img src={`http://render-${this.state.region}.worldofwarcraft.com/character/${char.character.thumbnail}`}></img>&nbsp;&nbsp;{char.character.name} - {this.fixRole(char.character.spec.role)} - Rank: {char.rank}&nbsp;&nbsp;<Button size="sm" variant="outline-success" onClick={()=>{this.refreshOne(index, char.character.name)}}>Reroll</Button><Button onClick={() => {this.handleCharClick(`https://worldofwarcraft.com/en-${euToGb}/character/${this.state.region.toLowerCase()}/${this.state.realmName.replace(" ","-")}/${char.character.name}`)}} size="sm" variant="outline-info">Armory</Button></div>
                        this.setState({generatedRaid: []})
                        this.setState({generatedRaid: returnArray})

                        
                    })
        ////
    }
    componentDidMount() {
        this.CreateARaid(this.state.healersWanted, this.state.raidSize, this.state.tanksWanted, this.state.playersRequired);
        this.props.onRef(this)
        
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }
    render() {
        return (
            <div>
                <br></br>
                {this.state.generatedRaid}
            </div>
        )

    }
}
























export default RaidGenerator