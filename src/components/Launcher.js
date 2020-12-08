import React from "react";
import { oauth2 as SMART } from "fhirclient";
import { getLaunchOptions } from '../utils/helper';
import '../App.scss'

export default class Launcher extends React.Component {
    smartLaunch = () => {
        const launchOptions = getLaunchOptions(window);
        SMART.authorize({
            clientId: launchOptions.clientId,
            scope: launchOptions.scope,
            redirectUri: launchOptions.redirectUri
        });
    }

    standaloneLaunch = () => {
        this.props.history.push({pathname: '/app', standaloneLaunch: true})
    }

    redirectLogin = () => {
        this.props.history.push({pathname: '/login', launch: window.location.href})
    }

    render() {
        return (
            <div>
                <div className="button" onClick={() => this.smartLaunch()}>
                    Smart Launch
                </div>
                <div className="button" onClick={() => this.standaloneLaunch()}>
                    iHealth Launch
                </div>
                <div className="button" onClick={() => this.redirectLogin()} >
                    login
                </div>
            </div>
        )
    }
}
