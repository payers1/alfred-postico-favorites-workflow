const alfy = require('alfy');
const db   = require('sqlite');
const P    = require('bluebird');
const location = process.env.HOME +
  '/Library/Containers/at.eggerapps.Postico/Data/Library/Application\ Support/' +
  'Postico/ConnectionFavorites.db';

const buildConnectionString = ({ZUSER, ZHOST, ZPORT, ZDATABASE}) => [
    'postgresql://',
    `${ZUSER ? ZUSER + '@' : ''}`,
    `${ZHOST || 'localhost'}`,
    `${ZPORT ? ':' + ZPORT : ''}`, '/',
    `${ZDATABASE || ''}`].join('');

return P.resolve(db.open(location))
  .then(() => db.all('SELECT * FROM ZPGEFAVORITE'))
  .map(favorite => ({
    title: favorite.ZNICKNAME && favorite.ZNICKNAME,
    subtitle: buildConnectionString(favorite),
    arg: buildConnectionString(favorite),
    valid: true
  }))
  .then(alfy.output);
