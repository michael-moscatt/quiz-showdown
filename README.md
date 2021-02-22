# QuizShowdown

![Logo](https://user-images.githubusercontent.com/51413275/108643386-6c7d9880-7478-11eb-9db9-95f405091aab.png)

[QuizShowdown](http://quizshowdown.com) is a fast-paced quiz website where you can compete with friends to
answer Jeopardy questions. The site features a buzzer system, wagering, and three rounds of questions.
Before the game starts, the host can decide if players should be able to buzz prior to the end of question
by changing the 'Interrupt' checkbox. At the end of Final Jeopardy, whoever has the most money wins!

## Technical Details

The frontend was built with [React](https://reactjs.org/), using components from
[Material UI](https://material-ui.com/). Components are located in the `client/src/components` folder.

The backend uses Node.js with Express.js, and the app uses Socket.IO for client/server communication.
The production site is hosted on DigitalOcean.

## Installing

To build the site, first install Node.js and npm. Then run the following in the root folder:

```
npm install
cd client
npm install
cd ..
npm run dev
```
The site is then accessible through the browser at 'localhost:3000'

## Acknowledgments

* Special thanks to J for playtesting
