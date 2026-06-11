import { useState } from "react";
import GalaxyPage from "./pages/GalaxyPage";
import HomePage from "./pages/HomePage";
import LetterPage from "./pages/LetterPage";

export default function App() {
  const [screen, setScreen] = useState("home");

  return (
    <main className="app-shell">
      <div className="ambient-grain" aria-hidden="true" />
      {screen === "home" && <HomePage onOpen={() => setScreen("letter")} />}
      {screen === "letter" && (
        <LetterPage
          onBack={() => setScreen("home")}
          onEnter={() => setScreen("galaxy")}
        />
      )}
      {screen === "galaxy" && <GalaxyPage onBack={() => setScreen("letter")} />}
    </main>
  );
}
