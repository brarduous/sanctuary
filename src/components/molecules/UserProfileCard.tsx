import React from 'react';
import { Card, CardHeader, CardContent, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

type UserProfile = {
  firstName: string;
  lastName: string;
  // Add other profile fields as needed
};

type UserProfileCardProps = {
  userProfile: UserProfile;
  onEdit: () => void;
};

const UserProfileCard: React.FC<UserProfileCardProps> = ({ userProfile, onEdit }) => {
  return (
    <Card>
      <CardHeader
        title="Profile Overview"
        action={
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        }
      />
      <CardContent>
        <p>First Name: {userProfile.firstName}</p>
        <p>Last Name: {userProfile.lastName}</p>
        {/* Add other profile information here */}
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;