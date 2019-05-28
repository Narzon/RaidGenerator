import React, { Component } from 'react';
const fetch = require('node-fetch');


class RaidGenerator extends Component {
    constructor(props) {
        super(props)
        this.state = {
            generatedRaid: [<h1>Loading ... </h1>]

        }
    }
    //USERDEFINED default guild
    region = this.props.region
    realmName = this.props.realm
    guildName = this.props.guild
    raidSize = this.props.raidSize
    tanksWanted = this.props.tanksWanted
    
    //USERDEFINED default rank
    minRank = this.props.minRank
    healersWanted = this.props.healersWanted
    //USERDEFINED default info for excludeAlts - multiple characters belonging to same person
    excludeAlts = {
        names1: ["Existnceffs", "Existncekms"],
        names2: ["Yangwarrior", "Yangabang"],
        names3: ["Bottiheal", "Botticlap", "Bottistab", "Bottimonk", "Bottishift"]
    }
    //USERDEFINED optional array of players to always include
    playersRequired = this.fixNameFormat(this.props.reqPlayers.replace(" ","").split(","))

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
    //array of all members already added to raid group
    namesOfMembers = []
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
    // filter guild members array by max level (120) characters over the minimum rank
    filter_120s(member) {
        return (member.character.level == 120 && member.rank <= this.minRank);
    }
    nameIsUnique(aName) {
        let canIUse = true
        // if name exists in raid already, return false
        if (this.namesOfMembers.indexOf(aName) !== -1) {
            canIUse = false
            return canIUse
        }
        // check to see if name exists in any of the excludeAlts arrays
        let altsList = Object.keys(this.excludeAlts)
        altsList.map((stringName) => {
            if (this.excludeAlts[stringName].indexOf(aName) !== -1) {
                // if it does, check to see if any other alt names in that array exist within raid already
                this.excludeAlts[stringName].map((name) => {
                    // if one does, return false
                    if (this.namesOfMembers.indexOf(name) !== -1) {
                        canIUse = false
                        return canIUse
                    }
                })
            }
        })
        return canIUse
    }
    CreateARaid = (healerNum, raidSize, tankNum, requiredPlayerArray) => {
        var idCounter = 0
        var self = this
        if (healerNum == undefined) {
            healerNum = 5
        }
        if (tankNum == undefined) {
            tankNum = 2
        }
        if (raidSize == undefined) {
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
            requiredPlayerArray.map((playerName) => {
                let newReqPlayer = 
                    fetch(`https://${this.region}.api.blizzard.com/wow/guild/${this.realmName}/${this.guildName}?fields=members&locale=en_US&access_token=USCndI8E8ud3fx5XzcX6TeDvPlXrJgJkY0`)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (myJson) {
                        if (myJson.members === undefined) {
                            self.setState({ generatedRaid: <h1>Error! Try to fix information!</h1> })
                            return
                        }

                        let found = myJson.members.find(function(element) {
                            return element.character.name === playerName;
                        });
                        if (found.character.spec.role === "TANK") {
                            tanks += 1
                            self.namesOfMembers.push(found.character.name)
                        } else if (found.character.spec.role === "HEALING") {
                            healers += 1
                            self.namesOfMembers.push(found.character.name)
                        } else if (found.character.spec.role === "DPS") {
                            dps += 1
                            self.namesOfMembers.push(found.character.name)
                        }
                        return (found);
                    })
                
                raid.push(newReqPlayer)
            })
        }
        // fill the raid with appropriate random players
        while (raid.length < raidSize) {
            let aNewPlayer =
                fetch(`https://${this.region}.api.blizzard.com/wow/guild/${this.realmName}/${this.guildName}?fields=members&locale=en_US&access_token=USCndI8E8ud3fx5XzcX6TeDvPlXrJgJkY0`)
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (myJson) {
                        if (myJson.members === undefined) {
                            self.setState({ generatedRaid: <h1>Error! Try to fix information!</h1> })
                            return
                        }
                        let maxLevelPlayers = myJson.members.filter((member) => {
                            return (member.character.level == 120 && member.rank <= self.minRank);
                        })
                        let maxLength = maxLevelPlayers.length
                        // boolean value to keep track of when a randomly selected character is eligible to be added
                        let acceptablePlayer = false
                        let randomPlayer = {}
                        while (acceptablePlayer === false) {
                            randomPlayer = maxLevelPlayers[self.getRandomInt(maxLength)]
                            while (randomPlayer.character.spec === undefined) {
                                randomPlayer = maxLevelPlayers[self.getRandomInt(maxLength)]
                            }
                            if (randomPlayer.character.spec.role === "TANK" && tanks < tankNum && self.nameIsUnique(randomPlayer.character.name)) {
                                tanks += 1
                                self.namesOfMembers.push(randomPlayer.character.name)
                                acceptablePlayer = true
                            } else if (randomPlayer.character.spec.role === "HEALING" && healers < healerNum && self.nameIsUnique(randomPlayer.character.name)) {
                                healers += 1
                                self.namesOfMembers.push(randomPlayer.character.name)
                                acceptablePlayer = true
                            } else if (randomPlayer.character.spec.role === "DPS" && dps < dpsNum && self.nameIsUnique(randomPlayer.character.name)) {
                                dps += 1
                                self.namesOfMembers.push(randomPlayer.character.name)
                                acceptablePlayer = true
                            }
                        }
                        return (randomPlayer);
                    })
            raid.push(aNewPlayer)
        }

        Promise.all(raid).then(result => {
            if (result[0] === undefined) {
                return
            }
            let namesArray = result.map((char, index) => {
                if (index === 0) {
                    return <div><h1>Raid Size: {raidSize}</h1><div><p>{char.character.name} - {this.fixRole(char.character.spec.role)} - Rank: {char.rank}</p></div></div>
                } else {
                    return <div><p>{char.character.name} - {this.fixRole(char.character.spec.role)} - Rank: {char.rank}</p></div>
                }
            })
            namesArray.push(
                <h1>Tanks: {"" + tankNum}, Healers: {"" + healerNum}, DPS: {"" + dpsNum}</h1>
            )
            this.setState({ generatedRaid: namesArray })
        });

    }
    componentDidMount() {
        this.CreateARaid(this.healersWanted, this.raidSize, this.tanksWanted, this.playersRequired);
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