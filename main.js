const alfy = require('alfy');
const db   = require('sqlite');
const P    = require('bluebird');
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

return P.resolve()
  .then(() => db.open(location))
  .then(() => db.all('SELECT ZNICKNAME, ZUSER, ZHOST, ZPORT, ZDATABASE FROM ZPGEFAVORITE'))
  .map(favorite => {
    const connectionString = buildConnectionString(favorite);
    return {
      title: favorite.ZNICKNAME && favorite.ZNICKNAME,
      subtitle: connectionString,
      arg: connectionString,
      valid: true
    }
  })
  .then(items => alfy.output(items));
