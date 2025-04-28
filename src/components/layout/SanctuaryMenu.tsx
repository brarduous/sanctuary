
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import Drawer from '@mui/material/Drawer';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { app } from '../../utils/firebaseConfig'; // Ensure this path points to your Firebase configuration file

export default function SanctuaryMenu() {
  const router = useRouter();   
    const user = getAuth(app).currentUser;
    const [authenticated, setAuthenticated] = useState(false);

    return(
<Drawer sx={{width: '200px'}} className="dashboard-menu" variant="permanent" anchor="left" open={true}>
              
              <Typography paddingBottom={'1rem'} fontSize={'1.6rem'}>sanctuary</Typography>
          <>
          {user?.displayName}
          </>
          <MenuList>
            <MenuItem onClick={() => router.push('/sermons')}>
              <ListItemIcon>
                <HistoryEduIcon htmlColor="white" fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sermons</ListItemText>
              
            </MenuItem>
          </MenuList>
        </Drawer>
    );
}
