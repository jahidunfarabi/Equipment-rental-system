// eslint-disable-next-line @typescript-eslint/no-var-requires
const PusherLib = require('pusher');

export const pusher = new PusherLib({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_APP_SECRET,
  cluster: process.env.PUSHER_APP_CLUSTER,
  useTLS: true,
});