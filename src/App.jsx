import { useState, useEffect } from "react";
import Chat from "./components/Chat";
import Login from "./components/Login";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem("theme", JSON.stringify(darkMode));
  }, [darkMode]);

  return user ? (
    <Chat
      username={user.username}
      room="global"   // 🔥 default room (can upgrade later)
      darkMode={darkMode}
      setDarkMode={setDarkMode}
    />
  ) : (
    <Login setUser={setUser} darkMode={darkMode} />
  );
}

export default App;