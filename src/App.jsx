import React, { useState, useEffect } from "react";

function App() {
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");
  const [totalPoints, setTotalPoints] = useState("");
  const [gamePoints, setGamePoints] = useState([]);
  const [currentPoints, setCurrentPoints] = useState({ teamA: 0, teamB: 0 });
  const [cumulativePoints, setCumulativePoints] = useState({
    teamA: 0,
    teamB: 0,
  });
  const [winner, setWinner] = useState(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("appState"));
    if (savedState) {
      setTeamA(savedState.teamA);
      setTeamB(savedState.teamB);
      setTotalPoints(savedState.totalPoints);
      setGamePoints(savedState.gamePoints);
      setCurrentPoints(savedState.currentPoints);
      setCumulativePoints(savedState.cumulativePoints);
      setWinner(savedState.winner);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "appState",
      JSON.stringify({
        teamA,
        teamB,
        totalPoints,
        gamePoints,
        currentPoints,
        cumulativePoints,
        winner,
      })
    );
  }, [
    teamA,
    teamB,
    totalPoints,
    gamePoints,
    currentPoints,
    cumulativePoints,
    winner,
  ]);

  const handleAddPoints = () => {
    setGamePoints([...gamePoints, { ...currentPoints }]);
    setCumulativePoints((prev) => ({
      teamA: Number(prev.teamA) + Number(currentPoints.teamA),
      teamB: Number(prev.teamB) + Number(currentPoints.teamB),
    }));
    setCurrentPoints({ teamA: 0, teamB: 0 });
  };

  const calculateWinner = () => {
    if (
      cumulativePoints.teamA >= totalPoints &&
      cumulativePoints.teamB >= totalPoints
    ) {
      if (cumulativePoints.teamA === cumulativePoints.teamB) {
        setWinner("Draw");
      } else {
        setWinner(
          cumulativePoints.teamA > cumulativePoints.teamB ? teamA : teamB
        );
      }
    } else if (cumulativePoints.teamA >= totalPoints) {
      setWinner(teamA);
    } else if (cumulativePoints.teamB >= totalPoints) {
      setWinner(teamB);
    } else {
      setWinner("No Winner Yet");
    }
  };

  const handleClear = () => {
    setTeamA("");
    setTeamB("");
    setTotalPoints("");
    setGamePoints([]);
    setCurrentPoints({ teamA: 0, teamB: 0 });
    setCumulativePoints({ teamA: 0, teamB: 0 });
    setWinner(null);
  };

  return (
    <div className="App">
      <h1>Point Tracker</h1>

      <div className="setup-section">
        <h2>Set Up Teams and Points</h2>
        <input
          type="text"
          placeholder="Team A Name"
          value={teamA}
          onChange={(e) => setTeamA(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Team B Name"
          value={teamB}
          onChange={(e) => setTeamB(e.target.value)}
        />
        <br />
        <input
          type="number"
          placeholder="Total Points"
          value={totalPoints}
          onChange={(e) => setTotalPoints(Number(e.target.value))}
        />
        <br />
      </div>

      <div className="game-points-section">
        <h2>Enter Game Points</h2>
        <span>Team {teamA} Points</span>
        <input
          type="number"
          placeholder={`${teamA} Points`}
          value={currentPoints.teamA}
          onChange={(e) =>
            setCurrentPoints({
              ...currentPoints,
              teamA: e.target.value,
            })
          }
        />
        <br />
        <span>Team {teamB} Points</span>
        <input
          type="number"
          placeholder={`${teamB} Points`}
          value={currentPoints.teamB}
          onChange={(e) =>
            setCurrentPoints({
              ...currentPoints,
              teamB: e.target.value,
            })
          }
        />
        <br />
        <button onClick={handleAddPoints}>Add Points</button>
      </div>

      <div className="winner-section">
        <button onClick={calculateWinner}>Calculate Winner</button>
        <button
          onClick={handleClear}
          disabled={!winner || winner === "No Winner Yet"}
        >
          Clear
        </button>
        <h2>Winner: {winner}</h2>
      </div>

      <div className="points-log-section">
        <h2>Points Log:</h2>
        <ul>
          {gamePoints.map((round, index) => (
            <li
              key={index}
            >{`${teamA}: ${round.teamA}, ${teamB}: ${round.teamB}`}</li>
          ))}
        </ul>
      </div>

      <div className="cumulative-totals-section">
        <h2>Cumulative Totals:</h2>
        <p>
          {teamA}: {cumulativePoints.teamA}
        </p>
        <p>
          {teamB}: {cumulativePoints.teamB}
        </p>
      </div>
    </div>
  );
}

export default App;
