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
    padding: "5px",
    borderRadius: "inherit",
    overflow: "hidden",
  },
  overlay: {
    height: "55vh",
    aspectRatio: "1",
    inset: "auto 20px 15% auto",
    position: "fixed",
    right: "10px",
    borderRadius: "1rem",
    boxShadow:
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",

    outline: "1px solid red", //Remove this line
  },
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
