import { Box } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../context/AccountProvider";

//components
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import { getConversation } from "../../../services/api";

const ChatBox = () => {
  const { person, account, newMessageFlag, setNewMessageFlag } =
    useContext(AccountContext);

  const [conversation, setConversation] = useState(null);

  // ----------------- FETCH CONVERSATION -----------------
  useEffect(() => {
    const getConversationDetails = async () => {
      let data = await getConversation({
        senderId: account.sub,
        receiverId: person.sub,
      });
      setConversation(data);
    };
    getConversationDetails();
  }, [person.sub]);

  // ------------------ MENU ACTIONS ------------------

  // ⭐ CLEAR CHAT (real-time)
  const clearChat = async () => {
    try {
      await fetch(
        `http://localhost:8000/messages/clear/${conversation?._id}`,
        { method: "DELETE" }
      );

      setNewMessageFlag((prev) => !prev);

    } catch (err) {
      console.log("Clear chat error:", err);
    }
  };

  // ❌ DELETE CHAT REMOVED COMPLETELY


  // ------------------ PROFILE MODAL ------------------
  const [openProfile, setOpenProfile] = useState(false);

  const viewProfile = () => {
    setOpenProfile(true);
  };

  // ------------------ SEARCH STATE ------------------
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchHover = () => {
    setSearchOpen(true);
  };

  const hideSearch = () => {
    setSearchOpen(false);
  };

  return (
    <Box style={{ height: "75%" }}>
      <ChatHeader
        person={person}
        onClearChat={clearChat}
        onViewProfile={viewProfile}
        onSearchClick={handleSearchHover}
      />

      <ChatMessages
        person={person}
        conversation={conversation}
        onClearChat={clearChat}
        onViewProfile={viewProfile}
        searchOpen={searchOpen}
        hideSearch={hideSearch}
      />

      {openProfile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
          onClick={() => setOpenProfile(false)}
        >
          <img
            src={person.picture}
            style={{
              width: "350px",
              height: "350px",
              borderRadius: "10px",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ChatBox;
