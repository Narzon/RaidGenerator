import { combineReducers } from 'redux'
import React from 'react';



function generatedRaid (state=<h1>Loading ...</h1>, action) {
    if (action.type === "RENDER_RAID") {
        return action.value;
    }
    return state;
}
function region (state="us", action) {
    if (action.type === "SET_REGION") {
        return action.value
    }
    return state;
}
function realmName (state="", action) {
    if (action.type === "SET_REALM") {
        return action.value
    }
    return state
}
function guildName (state="", action) {
    if (action.type === "SET_GUILD") {
        return action.value
    }
    return state
}
function raidSize (state=20, action) {
    if (action.type === "SET_SIZE") {
        state = action.value
        return state
    }
    return state
}
function tanksWanted (state=2, action) {
    if (action.type === "SET_TANKS") {
        return action.value
    }
    return state
}
function healersWanted (state=5, action) {
    if (action.type === "SET_HEALERS") {
        return action.value
    }
    return state
}
function minRank (state=10, action) {
    if (action.type === "SET_MINRANK") {
        return action.value
    }
    return state
}
function excludeAlts (state="", action) {
    if (action.type === "SET_EXCLUSIONS") {
        return action.value;
    } 
    return state
}
function namesOfMembers (state=[], action) {
    if (action.type === "ADD_MEMBER") {
        let newMember = action.value
        return [...state, newMember];
    }
    return state
}
function playersRequired (state="", action) {
    if (action.type === "SET_REQUIRED") {
        return action.value
    }
    return state
}



export default combineReducers({
    playersRequired,
    namesOfMembers,
    excludeAlts,
    minRank,
    healersWanted,
    tanksWanted,
    raidSize,
    generatedRaid,
    region,
    guildName,
    realmName
})