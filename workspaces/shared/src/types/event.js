'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.IEventProvider = exports.IEventChannel = exports.IEventPriority = void 0;
var IEventPriority;
(function (IEventPriority) {
  IEventPriority['DEFAULT'] = 'default';
  IEventPriority['CRITICAL'] = 'critical';
})(IEventPriority || (exports.IEventPriority = IEventPriority = {}));
var IEventChannel;
(function (IEventChannel) {
  IEventChannel['SMS'] = 'sms';
  IEventChannel['EMAIL'] = 'email';
  IEventChannel['PUSH'] = 'push';
})(IEventChannel || (exports.IEventChannel = IEventChannel = {}));
var IEventProvider;
(function (IEventProvider) {
  IEventProvider['TWILIO'] = 'twilio';
  IEventProvider['MESSAGE_BIRD'] = 'messagebird';
  IEventProvider['SENDGRID'] = 'sendgrid';
  IEventProvider['MAILGUN'] = 'mailgun';
  IEventProvider['FIREBASE'] = 'firebase';
  IEventProvider['ONE_SIGNAL'] = 'onesignal';
})(IEventProvider || (exports.IEventProvider = IEventProvider = {}));
