import React from 'react';

interface SalutationProps {
  firstName: string;
}

const Salutation: React.FC<SalutationProps> = ({ firstName }) => {
  const currentHour = new Date().getHours();
  let greeting = 'Good Morning';

  if (currentHour >= 12 && currentHour < 18) {
    greeting = 'Good Afternoon';
  } else if (currentHour >= 18 && currentHour < 24) {
    greeting = 'Good Evening';
  } else if (currentHour >= 0 && currentHour < 6) {
    greeting = `Burning the midnight oil, ${firstName}?`;
  }

  return (
    <h1>{greeting}, {firstName}!</h1>
  );
};

export default Salutation;