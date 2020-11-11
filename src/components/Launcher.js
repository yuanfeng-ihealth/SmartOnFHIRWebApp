import React from "react";
import { oauth2 as SMART } from "fhirclient";
import { CERNER_SCOPES, EPIC_SCOPES } from  "../utils/constants";

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
        SMART.authorize({
            // clientId: "41fe1b29-1dc6-46e7-beaf-cfa7995d08dc",
            clientId: "aac145fa-a1b3-4730-b5ac-c072b383394a",
            scope: CERNER_SCOPES,
            // scope: EPIC_SCOPES,
            redirectUri: "http://localhost:3000/app"
        });
    }
    /**
     * Could also return `null` for empty page
     */
    render() {
        return "Launching...";
    }
}
