const AlfredNode = require('alfred-workflow-nodejs');
const {actionHandler, workflow, Item} = AlfredNode;
const db = require('sqlite');
const P = require('bluebird');
const location = process.env.HOME +
  '/Library/Containers/at.eggerapps.Postico/Data/Library/Application\ Support/' +
  'Postico/ConnectionFavorites.db';

const buildConnectionString = ({ZUSER, ZHOST, ZPORT, ZDATABASE}) => {
  return 'postgresql://' +
    `${ZUSER ? ZUSER + '@' : ''}` +
    `${ZHOST || 'localhost'}` +
    `${ZPORT ? ':' + ZPORT : ''}` + '/' +
    `${ZDATABASE || ''}`;
}

(function main() {
    actionHandler.onAction("getPosticoFavorites", (query) => {
      return P.resolve()
      .then(() =>  db.open(location))
      .then(() => db.all('SELECT ZNICKNAME, ZUSER, ZHOST, ZPORT, ZDATABASE FROM ZPGEFAVORITE'))
      .map(favorite => {
        const connectionString = buildConnectionString(favorite);
        workflow.addItem(new Item({
          title: favorite.ZNICKNAME,
          subtitle: connectionString,
          arg: connectionString,
          valid: true
        }));
      }).then(() => workflow.feedback());
    });
    AlfredNode.run();
})();
