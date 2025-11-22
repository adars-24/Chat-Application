import { Box, styled } from "@mui/material";
import { useContext, useState, useEffect, useRef } from "react";

import { AccountContext } from "../../../context/AccountProvider";
import { getMessage, newMessage } from "../../../services/api";

//components
import Footer from "./Footer";
import Message from "./Message";

const Container = styled(Box)`
  padding: 1px 80px;
`;

const Wrapper = styled(Box)`
  background-image: url(${"https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"});
  background-size: 50%;
`;

const Component = styled(Box)`
  height: 75vh;
  overflow-y: scroll;
  scroll-behavior: smooth;
`;

const ChatMessages = ({
  person,
  conversation,
  onClearChat,         // delete removed
  onViewProfile,
  searchOpen,
  hideSearch
}) => {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);

  const [file, setFile] = useState();
  const [image, setImage] = useState();
  const [incomingMessage, setIncomingMessage] = useState(null);

  const [searchText, setSearchText] = useState("");

  const scrollRef = useRef();
  const searchRef = useRef(null);

  const { account, socket, newMessageFlag, setNewMessageFlag } =
    useContext(AccountContext);

  // CLEAR MESSAGES WHEN CONVERSATION IS EMPTY
  useEffect(() => {
    if (!conversation || conversation.message === "") {
      setMessages([]);
    }
  }, [conversation]);

  // HANDLE CLICK OUTSIDE SEARCH
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchText("");
        hideSearch();
      }
    }

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  // SOCKET RECEIVE
  useEffect(() => {
    socket.current.on("getMessgae", (data) => {
      setIncomingMessage({
        ...data,
        createdAt: Date.now(),
      });
    });
  }, []);

  // FETCH MESSAGES
  useEffect(() => {
    if (!conversation?._id) {
      setMessages([]);
      return;
    }

    const getMessageDetails = async () => {
      let data = await getMessage(conversation._id);
      setMessages(data || []);
    };

    getMessageDetails();
  }, [conversation?._id, newMessageFlag]);

  // ADD INCOMING MESSAGE
  useEffect(() => {
    if (
      incomingMessage &&
      conversation?.members?.includes(incomingMessage.senderId)
    ) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage, conversation]);

  // AUTO SCROLL
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // SEARCH SCROLL
  useEffect(() => {
    if (!searchText.trim()) return;

    const firstMatch = messages.find((msg) =>
      msg.text?.toLowerCase().includes(searchText.toLowerCase())
    );

    if (firstMatch) {
      const el = document.getElementById(firstMatch._id);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [searchText, messages]);

  // SEND MESSAGE
  const sendText = async (e) => {
    const code = e.keyCode || e.which;

    if (code === 13) {
      let message = {};

      if (!file) {
        message = {
          senderId: account.sub,
          receiverId: person.sub,
          conversationId: conversation?._id,
          type: "text",
          text: value,
        };
      } else {
        message = {
          senderId: account.sub,
          receiverId: person.sub,
          conversationId: conversation?._id,
          type: "file",
          text: image?.imageUrl || image,
        };
      }

      socket.current.emit("sendMessage", message);
      await newMessage(message);

      setValue("");
      setFile("");
      setImage("");
      setNewMessageFlag((prev) => !prev);
    }
  };

  return (
    <Wrapper>
      {/* SEARCH BAR */}
      {searchOpen && (
        <Box
          ref={searchRef}
          sx={{
            padding: "4px 12px",
            background: "#fff",
            borderBottom: "1px solid #ddd",
            width: "100%",
            position: "sticky",
            top: 0,
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
          }}
          onMouseLeave={hideSearch}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              width: "40%",
              padding: "5px 10px",
              borderRadius: "20px",
              border: "1px solid #ccc",
              fontSize: "12px",
            }}
          />
        </Box>
      )}

      {/* MESSAGE LIST */}
      <Component>
        {messages.map((message) => (
          <Container key={message._id} id={message._id}>
            <Message message={message} highlight={searchText} />
          </Container>
        ))}

        <div ref={scrollRef} />
      </Component>

      {/* FOOTER */}
      <Footer
        sendText={sendText}
        setValue={setValue}
        value={value}
        file={file}
        setFile={setFile}
        setImage={setImage}
      />
    </Wrapper>
  );
};

export default ChatMessages;
