import { createTheme } from '@mui/material/styles';


const sanctuaryTheme = createTheme({
    palette: {
      primary: {
        main: '#8CB4D4', // Gentle Gray-Blue - Represents structured, logical AI
      },
      secondary: {
        main: '#A7C9F5', // Soft Muted Blue - Represents smooth, flowing spirituality
      },
      // You might want to define other palette colors as well,
      // such as error, warning, info, success, and background.
      // Example for background:
      background: {
        default: '#F0F8FF', // A very light blue/off-white for general background
        paper: '#FFFFFF', // White for paper-like elements
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)', // Default primary text color
        secondary: 'rgba(0, 0, 0, 0.6)', // Default secondary text color
      },
    },
    typography: {
      fontFamily: "'Open Sans', sans-serif", // Default font - you can change this
      // You can also define variants like h1, h2, body1, body2, etc.
      // For example:
      // h6: {
      //   fontWeight: 500,
      //   fontSize: '0.8rem',
      // },
      // body1: {
      //   fontSize: '1rem',
      // },
    },
    // You can further customize components' style overrides here if needed
    components: {
      // Example: Customizing the AppBar
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#8CB4D4', // Use the primary color for the app bar
            color: '#FFFFFF', // White text on the primary background
          },
        },
      },
   
      // Example: Customizing buttons
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            backgroundColor: '#8CB4D4',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#779FC0', // Slightly darker shade on hover
            },
          },
          containedSecondary: {
            backgroundColor: '#A7C9F5',
            color: '#333', // Darker text for better contrast
            '&:hover': {
              backgroundColor: '#91B3DF', // Slightly darker shade on hover
            },
          },
        },
      },
    },
  });
  
  export default sanctuaryTheme;