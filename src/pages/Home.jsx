 
// import { useEffect, useRef, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import { GiHamburgerMenu } from "react-icons/gi";
// import Header from "../components/Header";
// import { ChatData } from "../context/ChatContext";
// import { LoadingBig, LoadingSmall } from "../components/Loading";
// import { IoMdSend } from "react-icons/io";
// import { GiRamProfile } from "react-icons/gi";
// import { PiUserSoundFill } from "react-icons/pi";



// const Home = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleSidebar = () => {
//     setIsOpen(!isOpen);
//   };

//   const { fetchResponse, messages, prompt, setPrompt, newRequestLoading, loading, chats } = ChatData();

//   const submitHandler = (e) => {
//     e.preventDefault();
//     fetchResponse();
//   };

//   const messagecontainerRef = useRef();

// //____auto scroll
//   useEffect(() => {
//     if (messagecontainerRef.current) {
//       messagecontainerRef.current.scrollTo({
//         top: messagecontainerRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages]);//when new messages arrive or change we hit that useeffect
// // ____________________


//   return (
//     <div className="flex h-screen bg-gray-900 text-white">
//       <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

//       <div className="flex flex-1 flex-col">
//         <button
//           onClick={toggleSidebar}
//           className="md:hidden p-4 bg-gray-800 text-2xl"
//         >
//           <GiHamburgerMenu />
//         </button>

//         <div className="flex-1 p-6 mb-20 md:mb-0">
//           <Header />

//           {loading ? (
//             <LoadingBig />
//           ) : (
//             <div
//               className="flex-1 p-6 max-h-[calc(100vh-12rem)] overflow-y-auto mb-20 md:mb-0 thin-scrollbar"
//               ref={messagecontainerRef}
//             >
//               {messages && messages.length > 0 ? (
//                 messages.map((e, i) => (
//                   <div key={i}>
//                     <div className="mb-4 p-4 rounded bg-blue-700 text-white flex gap-1">
//                       <div className="bg-white p-2 rounded-full text-black text-2xl h-10">
//                       <PiUserSoundFill />
//                       </div>
//                       <p className="text-xl leading-relaxed">{e.question}</p> {/* Increased font size here */}
//                     </div>

//                     <div className="mb-4 p-4 rounded bg-gray-700 text-white flex gap-1">
//                       <div className="bg-white p-2 rounded-full text-black text-2xl h-10">
//                       <GiRamProfile />
//                       </div>
//                       <p className="text-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: e.answer }}></p> {/* Increased font size here */}
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <p>No chat yet</p>
//               )}

//                 {/* when we send new request then it show loading */}
//               {newRequestLoading && <LoadingSmall />}

//             </div>
//           )}
//         </div>
//       </div>

//         {/* we show input fild(jaha pr hum question puchte hai) when we have a created chat otherwise not */}
//       {chats && chats.length === 0 ? (
//         ""
//       ) : (
//         <div className="fixed bottom-0 right-0 left-auto p-4 bg-gray-900 w-full md:w-[75%]">
//           <form    onSubmit={submitHandler}  className="flex justify-center items-center"      >
//             <input
//               className="flex-grow p-4 bg-gray-700 rounded-l text-white outline-none"
//               type="text"    placeholder="Enter a prompt here"   value={prompt}
//               onChange={(e) => setPrompt(e.target.value)}   required
//             />
//             <button className="p-4 bg-gray-700 rounded-r text-2xl text-white">
//               <IoMdSend />
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;












import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "../components/Header";
import { ChatData } from "../context/ChatContext";
import { LoadingBig, LoadingSmall } from "../components/Loading";
import { IoMdSend } from "react-icons/io";
import { GiRamProfile } from "react-icons/gi";
import { PiUserSoundFill } from "react-icons/pi";
import { AiOutlineDownload } from "react-icons/ai";
import { FaCopy } from "react-icons/fa";
import { jsPDF } from "jspdf";
import { htmlToText } from "html-to-text";
import toast from 'react-hot-toast';

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const { fetchResponse, messages, prompt, setPrompt, newRequestLoading, loading, chats } = ChatData();

  const submitHandler = (e) => {
    e.preventDefault();
    fetchResponse();
  };

  const messagecontainerRef = useRef();

  useEffect(() => {
    if (messagecontainerRef.current) {
      messagecontainerRef.current.scrollTo({
        top: messagecontainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const downloadAsPDF = (answer, question) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;

    const formattedAnswer = htmlToText(answer, {
      wordwrap: 130,
      tags: {
        h1: { options: { uppercase: true, singleNewLine: true } },
        h2: { options: { uppercase: true, singleNewLine: true } },
        h3: { options: { uppercase: true, singleNewLine: true } },
        p: { options: { singleNewLine: true } },
        br: { options: { singleNewLine: true } },
      },
    });

    const splitQuestion = doc.splitTextToSize("Question: " + question, pageWidth - margin * 2);
    const splitAnswer = doc.splitTextToSize("Answer: " + formattedAnswer, pageWidth - margin * 2);

    doc.text(splitQuestion, margin, 10);

    const questionHeight = doc.getTextDimensions(splitQuestion).h;
    const answerY = 10 + questionHeight + 10;

    doc.text(splitAnswer, margin, answerY);

    doc.save("response.pdf");
  };

  const copyToClipboard = (answer) => {
    const text = htmlToText(answer, { wordwrap: 1300 });
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-3 bg-gray-800 text-xl"
        >
          <GiHamburgerMenu />
        </button>

        <div className="flex-1 p-4 mb-16 md:mb-0 smaller-text">
          <Header />

          {loading ? (
            <LoadingBig />
          ) : (
            <div
              className="flex-1 p-4 max-h-[calc(100vh-10rem)] overflow-y-auto mb-16 md:mb-0 thin-scrollbar"
              ref={messagecontainerRef}
            >
              {messages && messages.length > 0 ? (
                messages.map((e, i) => (
                  <div key={i}>
                    <div className="mb-3 p-3 rounded bg-blue-700 text-white flex gap-1 items-start">
                      <div className="bg-white p-1 rounded-full text-black text-xl h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <PiUserSoundFill />
                      </div>
                      <p className="text-lg leading-relaxed">{e.question}</p>
                    </div>

                    <div className="mb-3 p-3 rounded bg-gray-700 text-white flex gap-1 items-start">
                      <div className="bg-white p-1 rounded-full text-black text-xl h-8 w-8 flex items-center justify-center flex-shrink-0">
                        <GiRamProfile />
                      </div>
                      <div className="flex-grow">
                        <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: e.answer }}></p>
                      </div>
                      <div className="flex flex-col gap-2 ml-2">
                        <button
                          onClick={() => downloadAsPDF(e.answer, e.question)}
                          className="bg-gray-600 p-2 rounded text-white w-8 h-8 flex items-center justify-center"
                          title="Download as PDF"
                        >
                          <AiOutlineDownload />
                        </button>
                        <button
                          onClick={() => copyToClipboard(e.answer)}
                          className="bg-gray-600 p-2 rounded text-white w-8 h-8 flex items-center justify-center"
                          title="Copy to clipboard"
                        >
                          <FaCopy />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No chat yet</p>
              )}

              {newRequestLoading && <LoadingSmall />}
            </div>
          )}
        </div>
      </div>

      {chats && chats.length === 0 ? (
        ""
      ) : (
        <div className="fixed bottom-0 right-0 left-auto p-3 bg-gray-900 w-full md:w-[75%]">
          <form onSubmit={submitHandler} className="flex justify-center items-center">
            <input
              className="flex-grow p-3 bg-gray-700 rounded-l text-white outline-none text-sm"
              type="text"
              placeholder="Enter a prompt here"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
            />
            <button className="p-3 bg-gray-700 rounded-r text-xl text-white">
              <IoMdSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;