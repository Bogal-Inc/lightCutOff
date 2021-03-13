import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import {mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  constructor(
    private angularFireMessaging: AngularFireMessaging
  ) {}

  /**
   * Browser/ device will ask to user for permission to receive notification.
   * After permission is granted by the user, firebase will return a token that can use
   * as a reference to send a notification to the browser.
   */
  requestPermission() {
    return this.angularFireMessaging.requestToken;
  }

  /**
   * This function will be triggered when a new message has received.
   */
  receiveMessage() {
    return this.angularFireMessaging.messages;
  }

  /**
   * Once you have a user's token and they are subscribed, you can listen to messages in the foreground.
   * The Firebase Messaging Service Worker handles background push notifications.
   */
  listen() {
    return this.angularFireMessaging.messages;
  }

  deleteToken() {
    return this.angularFireMessaging.getToken
      .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)));
  }
}
