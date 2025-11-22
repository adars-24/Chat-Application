import { useEffect, useState, useRef } from "react";

import { Box, InputBase, styled } from "@mui/material";

import { EmojiEmotionsOutlined, AttachFile, Mic, Send } from "@mui/icons-material";

import EmojiPicker from "emoji-picker-react";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

import { uploadFile } from "../../../services/api";

const Container = styled(Box)`
  height: 55px;
  background: #ededed;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0 15px;
  position: relative;   /* for emoji popup */
  & > * {
    margin: 5px;
    color: #919191;
  }
`;

const Search = styled(Box)`
  border-radius: 18px;
  background-color: #ffffff;
  width: calc(94% - 100px);
`;

const InputField = styled(InputBase)`
  width: 100%;
  padding: 20px;
  padding-left: 25px;
  font-size: 14px;
  height: 20px;
  width: 100%;
`;

const ClipIcon = styled(AttachFile)`
  transform: rotate(40deg);
`;

const Footer = ({ sendText, setValue, value, file, setFile, setImage }) => {
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);   // ⭐ NEW REF for outside click detection

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        data.append("name", file.name);
        data.append("file", file);

        let response = await uploadFile(data);
        setImage(response.data);
      }
    };
    getImage();
  }, [file]);

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
    setValue(e.target.files[0].name);
  };

  // send message on clicking send icon
  const onSendClick = () => {
    const e = { keyCode: 13, which: 13 };
    sendText(e);
  };

  const onEmojiClick = (emojiData) => {
    setValue((prev) => prev + emojiData.emoji);
  };

  // ⭐ CLOSE EMOJI POPUP WHEN CLICK OUTSIDE
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };

    if (showEmoji) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showEmoji]);

  return (
    <Container>
      {/* EMOJI ICON */}
      <InsertEmoticonIcon
        style={{ cursor: "pointer" }}
        onClick={() => setShowEmoji((prev) => !prev)}
      />

      {/* EMOJI PICKER POPUP */}
      {showEmoji && (
        <Box
          ref={emojiRef}
          sx={{
            position: "absolute",
            bottom: "60px",
            left: "10px",
            zIndex: 20,
          }}
        >
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </Box>
      )}

      {/* FILE ICON */}
      <label htmlFor="fileInput">
        <ClipIcon />
      </label>

      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={(e) => onFileChange(e)}
      />

      {/* INPUT BOX */}
      <Search>
        <InputField
          placeholder="type a message"
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => sendText(e)}
          value={value}
        />
      </Search>

      {/* SEND / MIC */}
      {value.trim() ? (
        <Send onClick={onSendClick} style={{ cursor: "pointer" }} />
      ) : (
        <Mic />
      )}
    </Container>
  );
};

export default Footer;
