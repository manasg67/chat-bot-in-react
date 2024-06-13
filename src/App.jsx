import { useState } from "react";
//import avatar from "./assets/avatar.jpeg";
import idle from "./assets/idle.mp4";
import Modal from "react-modal";
import Chatbot from "./components/Chatbot";

const customStyles = {
  content: {
    border: "none",
    inset: 0,
    maxHeight: "100vh",
    padding: "25px",
  },
  overlay: {},
};

function App() {
  const [visible, setisvisible] = useState(false);

  return (
    <div>
      <Modal isOpen={visible} style={customStyles}>
        <Chatbot />
      </Modal>
      <video
        onClick={() => setisvisible(!visible)}
        muted
        src={idle}
        autoPlay={true}
        loop={true}
        style={{
          height: 200,
          width: 200,
          position: "absolute",
          right: 10,
          bottom: 40,
        }}
      />
    </div>
  );
}

export default App;
