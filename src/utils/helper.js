import { CERNER_SCOPES, EPIC_SCOPES } from './constants';

export const getLaunchOptions = (window) => {
  const context = {};

  if (window.location.href.match('cerner')) {
    context.clientId = process.env.REACT_APP_CERNER_CLIENT_ID;
    context.scope = CERNER_SCOPES;
  }
  if (window.location.href.match('epic')) {
      context.clientId = process.env.REACT_APP_EPIC_CLIENT_ID;
      context.scope = EPIC_SCOPES;
  }

  return context;
};
