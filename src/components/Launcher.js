import React from "react";
import { client, oauth2 as SMART } from "fhirclient";
// import { CERNER_SCOPES, EPIC_SCOPES } from  "../utils/constants";
import { getLaunchOptions } from '../utils/helper';

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
    componentDidMount() {
        const launchOptions = getLaunchOptions(window);
        SMART.authorize({
            clientId: launchOptions.clientId,
            scope: launchOptions.scope,
            // redirectUri: "http://localhost:3000/app"
//             redirectUri: process.env.REACT_APP_REDIRECT_URI
        });
    }
    /**
     * Could also return `null` for empty page
     */
    render() {
        return "Launching...";
    }
}
