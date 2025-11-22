import { useContext, useState } from 'react';

import { AccountContext } from '../../../context/AccountProvider';
import { Box, styled } from '@mui/material';

import ChatIcon from '@mui/icons-material/Chat';
import DataSaverOffIcon from '@mui/icons-material/DataSaverOff';

//components
import HeaderMenu from './HeaderMenu';
import InfoDrawer from '../../drawer/infoDrawer';

const Component = styled(Box)`
  height: 44px;
  background: #ededed;
  padding: 8px 16px;
  display: flex;
  align-items: center;
`;

const Wrapper = styled(Box)`
  margin-left: auto;
  & > * {
    margin-left: 2px;
    padding: 8px;
    color: #000;
  }
`;

const Image = styled('img')({
  height: 40,
  width: 40,
  borderRadius: '50%',
  cursor: 'pointer'
});

const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const { account } = useContext(AccountContext);

  // ⭐ NEW: enlarged DP modal state
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <Component>
        {/* YOUR PROFILE PIC */}
        <Image
          src={account.picture}
          alt="dp"
          onClick={() => setShowProfile(true)}   // ⭐ enlarge image
        />

        <Wrapper>
          <DataSaverOffIcon />
          <ChatIcon />
          <HeaderMenu setOpenDrawer={setOpenDrawer} />
        </Wrapper>
      </Component>

      {/* EXISTING DRAWER (still works) */}
      <InfoDrawer open={openDrawer} setOpen={setOpenDrawer} />

      {/* ⭐ NEW FULL-SCREEN PROFILE POPUP */}
      {showProfile && (
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
            cursor: "pointer",
          }}
          onClick={() => setShowProfile(false)}  // close on outside click
        >
          <img
            src={account.picture}
            alt="profile enlarged"
            style={{
              width: "350px",
              height: "350px",
              borderRadius: "10px",
              objectFit: "cover"
            }}
          />
        </Box>
      )}
    </>
  );
};

export default Header;
