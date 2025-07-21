import React from 'react';
import { Card, CardHeader, CardContent, CardActions, Button, Typography } from '@mui/material';

interface ContentSummaryCardProps {
  title: string;
  itemCount: number;
  onViewAll: () => void;
}

const ContentSummaryCard: React.FC<ContentSummaryCardProps> = ({ title, itemCount, onViewAll }) => {
  return (
    <Card>
      <CardHeader title={title} />
    <CardContent style={{ textAlign: 'center' }}>
      {/* large bold green number item count */}
      <Typography variant="h4" color="primary" style={{ fontWeight: 'bold' }}>
        {itemCount}
      </Typography>
    </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={onViewAll}>
          View All
        </Button>
      
      </CardActions>
    </Card>
  );
};

export default ContentSummaryCard;