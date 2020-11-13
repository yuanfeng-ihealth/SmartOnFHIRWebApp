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
            // clientId: "41fe1b29-1dc6-46e7-beaf-cfa7995d08dc",
            // scope: "launch launch/encounter online_access openid profile user/Account.read user/AllergyIntolerance.read user/Appointment.read user/CarePlan.read user/CareTeam.read user/Condition.read user/Coverage.read user/Device.read patient/Device.read user/DocumentReference.read user/Encounter.read user/Immunization.read user/MedicationRequest.read user/NutritionOrder.read user/Observation.read user/Organization.read user/Patient.read user/Person.read user/Practitioner.read user/Procedure.read user/ServiceRequest.read",
            scope: launchOptions.scope,
            redirectUri: process.env.REACT_APP_REDIRECT_URI
            // redirectUri: "http://localhost:3000/app"
        });
    }
    /**
     * Could also return `null` for empty page
     */
    render() {
        return "Launching...";
    }
}
