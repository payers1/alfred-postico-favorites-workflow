import alfy from 'alfy';
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const location = process.env.HOME +
  '/Library/Containers/at.eggerapps.Postico/Data/Library/Application\ Support/' +
  'Postico/ConnectionFavorites.db';


const buildConnectionString = ({ ZUSER, ZHOST, ZPORT, ZDATABASE }) => [
  'postgresql://',
  `${ZUSER ? ZUSER + '@' : ''}`,
  `${ZHOST || 'localhost'}`,
  `${ZPORT ? ':' + ZPORT : ''}`, '/',
  `${ZDATABASE || ''}`
].join('');

const db = await open({
  filename: location,
  driver: sqlite3.Database
})
const favorites = await db.all('SELECT * FROM ZPGEFAVORITE');
const filteredFavorites = favorites.filter(favorite => favorite.ZNAME || favorite.ZNICKNAME)


const items = alfy.inputMatches(filteredFavorites, (item, input) => {
  if (input === '') return true
  const nicknameMatches = item.ZNICKNAME?.toLowerCase().includes(input.toLowerCase()) ?? false
  const nameMatches = item.ZNAME?.toLowerCase().includes(input.toLowerCase()) ?? false
  return nicknameMatches || nameMatches
})
  .map(favorite => ({
    title: favorite.ZNICKNAME ?? favorite.ZNAME,
    subtitle: favorite.ZHOST ?? 'localhost',
    arg: buildConnectionString(favorite)
  }))

alfy.output(items)


