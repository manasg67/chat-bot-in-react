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
  const [visible, setVisible] = useState(false);

  const toggleModal = () => {
    console.log("Toggling modal");
    setVisible(!visible);
  };

  return (
    <div>
      <Modal isOpen={visible} style={customStyles}>
        <Chatbot onClose={toggleModal} />
      </Modal>
      <video
        onClick={toggleModal}
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
