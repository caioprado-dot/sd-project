import React from "react";
import Game from "./components/game";

function App() {
  return (
      <div style={{display: "grid", justifyContent: "center", alignItems: "center"}}>
        <h1>Jogo IO de Espaçonaves 🚀</h1>
        <Game />
      </div>
  );
}

export default App;
