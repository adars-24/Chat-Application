import { useContext } from "react";

import { AccountContext } from "../../../context/AccountProvider";

import { Box, styled, Typography } from "@mui/material";

import { formatDate, downloadMedia } from "../../../utils/common-utils";

import GetAppIcon from "@mui/icons-material/GetApp";

import { iconPDF } from "../../../constants/data";

const Own = styled(Box)`
  background: #dcf8c6;
  padding: 5px;
  max-width: 60%;
  width: fit-content;
  margin-left: auto;
  display: flex;
  border-radius: 10px;
  word-break: break-word;
`;

const Wrapper = styled(Box)`
  background: #ffffff;
  padding: 5px;
  max-width: 60%;
  width: fit-content;
  display: flex;
  border-radius: 10px;
  word-break: break-word;
`;

const Text = styled(Typography)`
  font-size: 14px;
  padding: 0 25px 0 5px;
`;

const Time = styled(Typography)`
  font-size: 10px;
  color: #919191;
  margin-top: auto;
`;

// ⭐ Highlight function
function highlightText(text, highlight) {
  if (!highlight || typeof highlight !== "string") return text;

  const lowerText = text.toLowerCase();
  const lowerHighlight = highlight.toLowerCase();

  const start = lowerText.indexOf(lowerHighlight);
  if (start === -1) return text;

  const end = start + highlight.length;

  return (
    <>
      {text.substring(0, start)}
      <span style={{ backgroundColor: "yellow" }}>
        {text.substring(start, end)}
      </span>
      {text.substring(end)}
    </>
  );
}


const Message = ({ message, highlight }) => {
  const { account } = useContext(AccountContext);

  return (
    <>
      {account.sub === message.senderId ? (
        <Own>
          {message.type === "file" ? (
            <ImageMessage message={message} />
          ) : (
            <TextMessage message={message} highlight={highlight} />
          )}
        </Own>
      ) : (
        <Wrapper>
          {message.type === "file" ? (
            <ImageMessage message={message} />
          ) : (
            <TextMessage message={message} highlight={highlight} />
          )}
        </Wrapper>
      )}
    </>
  );
};

const ImageMessage = ({ message }) => {
  return (
    <Box style={{ position: "relative" }}>
      {message?.text?.includes(".pdf") ? (
        <Box style={{ display: "flex" }}>
          <img src={iconPDF} alt="pdf" style={{ width: 80 }} />
          <Typography style={{ fontSize: 14 }}>
            {message.text.split("/").pop()}
          </Typography>
        </Box>
      ) : (
        <img
          style={{ width: 300, height: "100%", objectFit: "cover" }}
          src={message.text}
          alt="message.text"
        />
      )}

      <Time style={{ position: "absolute", bottom: 0, right: 0 }}>
        <GetAppIcon
          onClick={(e) => downloadMedia(e, message.text)}
          fontSize="small"
          style={{
            marginRight: 10,
            border: "1px solid grey",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />
        {formatDate(message.createdAt)}
      </Time>
    </Box>
  );
};

const TextMessage = ({ message, highlight }) => {
  return (
    <>
      <Text>{highlightText(message.text, highlight)}</Text>
      <Time>{formatDate(message.createdAt)}</Time>
    </>
  );
};

export default Message;
