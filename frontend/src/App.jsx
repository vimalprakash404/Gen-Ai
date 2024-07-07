import  { useRef, useState, useEffect } from "react";
import chefImage from "./assets/bot.jpeg";
import profileImage from "./assets/profile.png";
import DOMPurify from "dompurify";
import { marked } from "marked";
import axios from "axios";

marked.use({ gfm: true });

function App() {


  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const chatContainerRef = useRef(null); // Ref for the chat container
  const [data, setData] = useState([]);




  function handleOnChange() {
    if (inputRef.current.value !== "") {
      buttonRef.current.hidden = false;
    } else {
      buttonRef.current.hidden = true;
    }
  }

  async function onSubmitPrompt() {
    setData([...data, { me: inputRef.current.value }]);
    
    const res = await getResultFromServer(inputRef.current.value);
    
    buttonRef.current.hidden = true; // Hide button after submitting
    setData([...data, { me: inputRef.current.value }, {bot : res}]);
    inputRef.current.value = "";
  }

  async function  getResultFromServer(input) {
    inputRef.current.value = "";
    const res =  await axios.get(`/api/${input}`);
    
    return res.data ;
  }

  useEffect(() => {
    // Scroll to the bottom whenever `data` changes
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [data]);

  return (
    <main style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <h1 style={{ padding: "10px", marginBottom: "0" }}>Gen Chat</h1>
      <div style={{ margin: "0", flexGrow: "1", overflow: "hidden" }}>
        <div 
          ref={chatContainerRef} // Attach ref to chat container
          style={{ 
            width: "100%", 
            height: "100%", 
            overflowY: "auto", // Enable vertical scrolling
            padding: "10px" 
          }}
        >
          {data.map((item, index) => {
            if ("me" in item) {
              return (
                <div key={index} style={{ display: "flex", marginTop: "10px", textAlign: "right" }}>
                  <article
                    style={{ margin: "0", flexGrow: "1", marginRight: "10px", marginLeft: "10px" }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(item.me)) }}
                  />
                  <img
                    src={profileImage}
                    alt="User"
                    style={{ width: "50px", height: "50px", borderRadius: "100%", marginRight: "10px" }}
                  />
                </div>
              );
            } else {
              return (
                <div key={index} style={{ display: "flex", marginTop: "10px" }}>
                  <img
                    src={chefImage}
                    alt="Bot"
                    style={{ width: "50px", height: "50px", borderRadius: "100%", marginLeft: "10px" }}
                  />
                  <article
                    style={{ margin: "0", flexGrow: "1", marginRight: "10px", marginLeft: "10px" }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(item.bot)) }}
                  />
                </div>
              );
            }
          })}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "end", backgroundColor: "#222", padding: "10px" }}>
        <textarea
          style={{ margin: 0, flexGrow: "1", overflowY: "hidden" }}
          placeholder="Type text here"
          ref={inputRef}
          onChange={handleOnChange}
        />
        <button
          style={{ margin: "0", marginLeft: "10px", marginBottom: "10px" }}
          hidden
          ref={buttonRef}
          onClick={onSubmitPrompt}
        >
          Go
        </button>
      </div>
    </main>
  );
}

export default App;
