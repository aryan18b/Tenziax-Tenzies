import "./App.css";
import Dice from "./Dice";
import React from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

function App() {
  function generateNewDice() {
    return {
      id: nanoid(),
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
    };
  }

  function allNewDice() {
    let randomArr = [];
    for (let i = 0; i < 10; i++) {
      let obj = generateNewDice();
      randomArr.push(obj);
    }

    return randomArr;
  }

  function toggleHeld(id) {
    setDiceHead((prev) => {
      let newDices = prev.map((obj) => {
        return obj.id === id ? { ...obj, isHeld: !obj.isHeld } : obj;
      });

      return newDices;
    });
  }

  const [diceHead, setDiceHead] = React.useState(allNewDice());

  const diceElements = diceHead.map((diceElement) => {
    return (
      <Dice
        toggleHeld={() => toggleHeld(diceElement.id)}
        key={diceElement.id}
        id={diceElement.id}
        value={diceElement.value}
        isHeld={diceElement.isHeld}
      />
    );
  });

  function rollDices() {
    if (tenzies) {
      setRolls(0);
      setTenzies(false);
      setTimer(0);
      setDiceHead(allNewDice());
    } else {
      setDiceHead((prevDiceHead) => {
        return prevDiceHead.map((dice) =>
          dice.isHeld ? dice : generateNewDice()
        );
      });

      setRolls((rolls) => rolls + 1);
    }
  }

  const [tenzies, setTenzies] = React.useState(false);

  const [rolls, setRolls] = React.useState(0);

  const [highScore, setHighScore] = React.useState();

  const [timer, setTimer] = React.useState(0);

  React.useEffect(() => {
    console.log("Enteres into second useEffect");
    if (localStorage.getItem("HighScore") === null) {
      localStorage.setItem("HighScore", 25);
    }

    setHighScore(localStorage.getItem("HighScore"));
  }, []);

  React.useEffect(() => {
    let allHeld = true;
    let allSame = true;
    let num = diceHead[0].value;

    for (let dice of diceHead) {
      allHeld = allHeld && dice.isHeld;
      allSame = num === dice.value ? true : false;
    }

    if (allHeld && allSame) {
      setTenzies(true);
      if (localStorage.getItem("HighScore") > rolls) {
        setHighScore(rolls);
        localStorage.setItem("HighScore", rolls);
      }
    }
  }, [diceHead]);

  function FormatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formattedMinutes} : ${formattedSeconds}`;
  }

  React.useEffect(() => {
    let intervalId;

    if (!tenzies) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [!tenzies]);

  return (
    <div className="game-container">
      <header>
        <h1>Tenzies</h1>
        <p className="description">
          Roll until all dice are the same. Click each die to freeze it at its
          current value between rolls.
        </p>
      </header>

      <main>
        <div className="dice-container">{diceElements}</div>
      </main>

      <footer>
        <div className="button-space">
          <button onClick={rollDices} type="button" className="btn btn-primary">
            {!tenzies ? "Roll Dice" : "New Game"}
          </button>
        </div>
        <div className="score-board">
          <p className="title">
            Score : <span className="roll-score-count">{rolls} Rolls</span>
          </p>
          <p className="title">
            High-Score :
            <span className="roll-score-count">{highScore} Rolls</span>
          </p>
        </div>
      </footer>
      <div className="timer">
        <p className="title">
          <img src="./timer.png" />
          Time :<span className="roll-score-count"> {FormatTime(timer)}</span>
        </p>
      </div>
      {tenzies && <Confetti />}
    </div>
  );
}

export default App;
