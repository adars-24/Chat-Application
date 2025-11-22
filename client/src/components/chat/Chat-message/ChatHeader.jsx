import { useContext, useState } from 'react';

import { Box, Typography, styled, Menu, MenuItem } from '@mui/material';
import { Search, MoreVert } from '@mui/icons-material';

import { AccountContext } from '../../../context/AccountProvider';

const Header = styled(Box)`
    height: 44px;
    background: #ededed;
    display: flex;
    padding: 8px 16px;
    align-items: center;
`;

const RightContainer = styled(Box)`
    margin-left: auto;
    display: flex;
    align-items: center;

    & > svg {
        padding: 8px;
        font-size: 24px;
        color: #000;
        cursor: pointer;
    }
`;

const Image = styled('img')({
    width: 40,
    height: 40,
    objectFit: 'cover',
    borderRadius: '50%'
});

const Name = styled(Typography)`
    margin-left: 12px !important;
`;

const Status = styled(Typography)`
    font-size: 12px !important;
    color: rgba(0, 0, 0, 0.6);
    margin-left: 12px !important;
`;

const ChatHeader = ({ 
    person, 
    onClearChat, 
    onViewProfile,
    onSearchClick 
}) => {

    const { activeUsers, account } = useContext(AccountContext);

    const [anchorEl, setAnchorEl] = useState(null);

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Header>

            {/* Profile Image */}
<Image 
  src={person.picture} 
  alt="dp" 
  onClick={onViewProfile}
  style={{ cursor: "pointer" }} 
/>

            {/* Name + Status */}
            <Box>
                <Name>{person.name}</Name>

               <Status>
  {person.sub === account.sub
    ? "Online"
    : activeUsers?.some(u => u.sub === person.sub)
      ? "Online"
      : "Offline"}
</Status>

            </Box>

            {/* Search + Menu */}
            <RightContainer>

                {/* 🔍 Search Icon */}
                <div 
                    onMouseEnter={onSearchClick}
                    style={{ cursor: "pointer", display: "inline-flex" }}
                >
                    <Search />
                </div>

                {/* ⋮ More Menu Icon */}
                <MoreVert onClick={openMenu} />

                {/* Menu Dropdown */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={closeMenu}
                >
                    <MenuItem
                        onClick={() => {
                            closeMenu();
                            onClearChat();
                        }}
                    >
                        Clear Chat
                    </MenuItem>

                    {/* ❌ DELETE CHAT REMOVED */}

                    <MenuItem
                        onClick={() => {
                            closeMenu();
                            onViewProfile();
                        }}
                    >
                        View Profile
                    </MenuItem>
                </Menu>
            </RightContainer>
        </Header>
    );
};

export default ChatHeader;
