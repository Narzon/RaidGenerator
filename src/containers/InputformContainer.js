import { connect } from 'react-redux'
import Inputform from '../components/Inputform'
import store from "../index"

const mapStateToProps = (state) => {
    return {
        raidSize: state.raidSize,
        playersRequired: state.playersRequired,
        excludeAlts: state.excludeAlts,
        minRank: state.minRank,
        healersWanted: state.healersWanted,
        tanksWanted: state.tanksWanted,
        region: state.region,
        guildName: state.guildName,
        realmName: state.realmName        
    }
}



let setRaidSize = (e) => {
    let returnObj = store.dispatch({ type: "SET_SIZE", value: e.target.value})  
    return returnObj
}
let setRealmName = (e) => {
    let returnObj = store.dispatch({ type: "SET_REALM", value: e.target.value})
    return returnObj
}
let setGuildName = (e) => {
    let returnObj = store.dispatch({ type: "SET_GUILD", value: e.target.value})
    return returnObj
}
let setRegion = (e) => {
    let returnObj = store.dispatch({ type: "SET_REGION", value: e.target.value})
    return returnObj
}
let setMinRank = (e) => {
    let returnObj = store.dispatch({ type: "SET_MINRANK", value: e.target.value})
    return returnObj
}
let setHealersWanted = (e) => {
    let returnObj = store.dispatch({ type: "SET_HEALERS", value: e.target.value})
    return returnObj
}
let setTanksWanted = (e) => {
    let returnObj = store.dispatch({ type: "SET_TANKS", value: e.target.value})
    return returnObj
}
let setRequiredPlayers = (e) => {
    let returnObj = store.dispatch({ type: "SET_REQUIRED", value: e.target.value})
    return returnObj
}
let setExcludeAlts = (e) => {
    let returnObj = store.dispatch({ type: "SET_EXCLUSIONS", value: e.target.value})
    return returnObj
}
let resetExclusionString = () => {
    let returnObj = store.dispatch({ type: "SET_EXCLUSIONS", value:""})
    return returnObj
}

const mapDispatchToProps = { setRaidSize, setMinRank, setRegion, setGuildName, setRealmName, setHealersWanted, setTanksWanted, setRequiredPlayers, setExcludeAlts, resetExclusionString, }

export default connect(mapStateToProps, mapDispatchToProps)(Inputform)