import PaystackHook from "./components/PaystackHook";
import "./App.css";
import { useState } from "react";
import Overlay from "./components/Overlay";

function App() {
  const [overlay, setOverlay] = useState(false);

  const onClick = () => {
    setOverlay(true);
  };
  return (
    <div className="App">
      {overlay && <Overlay />}
      <PaystackHook onClick={onClick} />
    </div>
  );
}

export default App;
