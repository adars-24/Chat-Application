import { Box, Typography, styled } from "@mui/material";

import { useContext, useEffect, useState } from "react";

import { AccountContext } from "../../../context/AccountProvider";

import { setConversation, getConversation } from "../../../services/api";

import { formatDate } from "../../../utils/common-utils";

const Component = styled(Box)`
  display: flex;
  height: 45px;
  padding: 13px 0;
  cursor: pointer;
`;

const Image = styled("img")({
  width: 50,
  height: 50,
  borderRadius: "50%",
  padding: "0 14px",
  objectFit: "cover",
});

const Container = styled(Box)`
  display: flex;
`;

const Timestamp = styled(Typography)`
  font-size: 12px;
  margin-left: auto;
  color: #00000099;
  margin-right: 20px;
`;
const Text = styled(Typography)`
  display: block;
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
`;

const Conversation = ({ user }) => {
  const { setPerson, account, newMessageFlag } = useContext(AccountContext);
  const [message, setMessage] = useState({});

  // ⭐ MODAL STATES
  const [openProfile, setOpenProfile] = useState(false);

  useEffect(() => {
    const getConversationMessage = async () => {
      const data = await getConversation({
        senderId: account.sub,
        receiverId: user.sub,
      });
      setMessage({ text: data?.message, timestamp: data?.updatedAt });
    };
    getConversationMessage();
  }, [newMessageFlag]);

  const getUser = async () => {
    setPerson(user);
    await setConversation({ senderId: account.sub, receiverId: user.sub });
  };

  return (
    <>
      {/* ROW */}
      <Component onClick={() => getUser()}>
        <Box
          onClick={(e) => {
            e.stopPropagation();     // IMPORTANT: stops opening chat
            setOpenProfile(true);    // show enlarged image
          }}
        >
          <Image
            src={user.picture}
            alt="dp"
            style={{ cursor: "pointer" }}
          />
        </Box>

        <Box style={{ width: "100%" }}>
          <Container>
            <Typography>{user.name}</Typography>
            {message?.text && (
              <Timestamp>{formatDate(message?.timestamp)}</Timestamp>
            )}
          </Container>

          <Box>
            <Text>
              {message?.text?.includes("localhost") ? "media" : message.text}
            </Text>
          </Box>
        </Box>
      </Component>

      {/* ⭐ FULL SCREEN PROFILE POPUP */}
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
            zIndex: 2000,
          }}
          onClick={() => setOpenProfile(false)}   // click anywhere to close
        >
          <img
            src={user.picture}
            style={{
              width: "350px",
              height: "350px",
              borderRadius: "10px",
              objectFit: "cover",
            }}
            alt="profile"
          />
        </Box>
      )}
    </>
  );
};

export default Conversation;
