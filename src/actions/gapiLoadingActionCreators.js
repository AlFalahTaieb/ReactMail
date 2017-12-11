/* global gapi */
import {gapiLoadRequest, gapiLoadSuccess} from '../constants'
import {updateSigninStatus} from './authActionCreators'

export const loadGapi = () => dispatch => {
  dispatch(gapiLoadRequest());
  gapi.load('client:auth2', () => {
    gapi.client.init({
      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"],
      clientId: '335136984732-skh3j99e0ftkcuj7ku6arc400h1hgmb8.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/gmail.readonly' +
            ' https://www.googleapis.com/auth/gmail.send' +
            ' https://www.googleapis.com/auth/gmail.modify'
    }).then(() => {
      dispatch(gapiLoadSuccess());
      gapi.auth2.getAuthInstance().isSignedIn.listen((status) => dispatch(updateSigninStatus(status)));
      dispatch(updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get()));
    });
  });
};