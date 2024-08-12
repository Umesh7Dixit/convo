import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";
import toast from "react-hot-toast";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");  //we take question from user
  const [newRequestLoading, setNewRequestLoading] = useState(false); //loading animation

  async function fetchResponse() {

    if (prompt === "") return alert("Write prompt");

    setNewRequestLoading(true);
    setPrompt("");

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDa2qu4ySDHnpdrDhZHGhDXSt-BmvGBn2w",
        method: "post",
        data: {
          contents: [{ parts: [{ text: prompt }] }],  //prompt is the question what we ask to gemini
        },
      });

      const message = {
        question: prompt,
        answer: response["data"]["candidates"][0]["content"]["parts"][0]["text"]
          .replace(/\n/g, '<br>') // Convert line breaks to <br>
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert **bold** to <strong>
          .replace(/\*(.*?)\*/g, '<em>$1</em>'), // Convert *italic* to <em>,
      };

      setMessages((prev) => [...prev, message]);
      setNewRequestLoading(false);

      const { data } = await axios.post(
        `${server}/api/chat/${selected}`,
        {  //send to the database
          question: prompt,
          answer:   
            response["data"]["candidates"][0]["content"]["parts"][0]["text"].replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>'),
        },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

    } catch (error) {
      alert("someting went wrong");
      console.log(error);
      setNewRequestLoading(false);
    }
  }

  const [chats, setChats] = useState([]);

  const [selected, setSelected] = useState(null);

  async function fetchChats() {
    try {
      const { data } = await axios.get(`${server}/api/chat/all`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setChats(data);
      setSelected(data[0]._id);
    } catch (error) {
      console.log(error);
    }
  }

  const [createLod, setCreateLod] = useState(false);

  async function createChat() {
    setCreateLod(true);
    try {
      const { data } = await axios.post( `${server}/api/chat/new`, {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      fetchChats();
      setCreateLod(false);

    } catch (error) {
      console.log(error)
      toast.error("some went wrong");
      setCreateLod(false);
    }
  }

  const [loading, setLoading] = useState(false);

  async function fetchMessages() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${server}/api/chat/${selected}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function deleteChat(id) {
    try {
      const { data } = await axios.delete(`${server}/api/chat/${id}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
      toast.success(data.message);
      fetchChats();
      window.location.reload();
    } catch (error) {
      console.log(error);
      alert("something went wrong");
    }
  }

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [selected]);


  return (
    <ChatContext.Provider
      value={{
        fetchResponse,
        messages,
        prompt,
        setPrompt,
        newRequestLoading,
        chats,
        createChat,
        createLod,
        selected,
        setSelected,
        loading,
        setLoading,
        deleteChat,
        fetchChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatData = () => useContext(ChatContext);








 