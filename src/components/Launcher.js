import React from "react";
import { Redirect } from 'react-router';
import smart, { client, oauth2 as SMART } from "fhirclient";
import { getAllMeasurements } from '../api'
// import { CERNER_SCOPES, EPIC_SCOPES } from  "../utils/constants";
import { getLaunchOptions } from '../utils/helper';
import '../App.scss'

/**
 * Typically the launch page is an empty page with a `SMART.authorize`
 * call in it.
 *
 * This example demonstrates that the call to authorize can be postponed
 * and called manually. In this case we use ReactRouter which will match
 * the `/launch` path and render our component. Then, after our page is
 * rendered we start the auth flow.
 */

export default class Launcher extends React.Component {
    /**
     * This is configured to make a Standalone Launch, just in case it
     * is loaded directly. An EHR can still launch it by passing `iss`
     * and `launch` url parameters
     */
    // componentDidMount() {
    //     const launchOptions = getLaunchOptions(window);
    //     SMART.authorize({
            // clientId: launchOptions.clientId,
            // clientId: "a905a8ee-7701-445a-bc31-83354e0ff185",
            // clientId: "aac145fa-a1b3-4730-b5ac-c072b383394a",
            // clientId: "41fe1b29-1dc6-46e7-beaf-cfa7995d08dc",
            // scope: launchOptions.scope,
            // scope:"patient/Patient.read patient/Observation.read launch/patient online_access openid profile",
            // iss: "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/R4",
            // iss: "https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
            // redirectUri: "http://localhost:3000/app"
            // redirectUri: process.env.REACT_APP_REDIRECT_URI
        // });
    // }

    smartLaunch = () => {
        const launchOptions = getLaunchOptions(window);
        SMART.authorize({
            clientId: launchOptions.clientId,
            // clientId: "a905a8ee-7701-445a-bc31-83354e0ff185",
            // clientId: "aac145fa-a1b3-4730-b5ac-c072b383394a",
            // clientId: "41fe1b29-1dc6-46e7-beaf-cfa7995d08dc",
            scope: launchOptions.scope,
            // scope:"patient/Patient.read patient/Observation.read launch/patient online_access openid profile",
            // iss: "https://apporchard.epic.com/interconnect-aocurprd-oauth/api/FHIR/R4",
            // iss: "https://fhir-ehr-code.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d",
            redirectUri: "http://localhost:3000/app",
            // redirectUri: process.env.REACT_APP_REDIRECT_URI
        });
    }

    standaloneLaunch = () => {
        this.props.history.push({pathname: '/app', standaloneLaunch: true})
    }
    /**
     * Could also return `null` for empty page
     */
    render() {
        return (
            <div>
                <div className="button" onClick={() => this.smartLaunch()}>
                    Smart Launch
                </div>
                <div className="button" onClick={() => this.standaloneLaunch()}>
                    iHealth Launch
                </div>
            </div>
        )
    }
}
