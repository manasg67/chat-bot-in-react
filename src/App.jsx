import { useState } from "react";
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

  const handleVisible = () => {
    setisvisible((prev) => !prev);
  };

  return (
    <div>
      <Modal isOpen={visible} style={customStyles}>
      <Chatbot change={handleVisible} />
      </Modal>
      <video
        onClick={() => handleVisible()}         
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
