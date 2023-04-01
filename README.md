# Slither.io

### Running the project
Make sure you have Node and NPM installed.
Then, use these commands:
```bash
$ npm install
$ npm run develop
```

To run the project in a production setting, simply

```bash
$ npm install
$ npm run build
$ npm start
```


### Sources
- https://github.com/bibhuticoder/snake.io - offline game
- https://victorzhou.com/blog/build-an-io-game-part-1 


### TODO
- collisions with players / @luluu9
- interpolating
- scoring
- leaderboard
- improving players state update
- returning from death (play again)
- unique color for each player
- snake's eyes
- minimap
- field of vision
- make each part of player's body independent (to be sure the tail is also rendered when players are distant from each other)
- drop food on death


### Found bugs
- when doing a full circle with the mouse around the player wrong direction is chosen