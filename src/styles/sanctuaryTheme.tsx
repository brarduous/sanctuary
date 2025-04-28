import { createTheme } from '@mui/material/styles';

// Option 1: Earthy Monochrome

// Primary: Rich Sage Green (~#8A9A5B)
// Secondary: Lighter Sage/Olive (~#A9B87E)
// Accent: Creamy Beige (~#F5F5DC)
// Text/Dark Elements: Deep Charcoal Grey (~#36454F)
// Vibe: Very calming, natural, grounded.

const sanctuaryTheme = createTheme({
    palette: {
      primary: {
        main: '#8A9A5B', // Gentle Sage - Represents structured, logical AI
      },
      secondary: {
        main: '#A9B87E', // Soft Muted Sage - Represents smooth, flowing spirituality
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
            
          },
        },
      },
      MuiDrawer: {
        styleOverrides: { 
          paper: {
            width: 240, // Width of the drawer
            backgroundColor: '#8A9A5B', // Gentle Sage for the drawer background
            color: '#FFFFFF', // White text in the drawer
            padding: '20px 40px', // Padding for the drawer content
          },
        },
      },
   
      // Example: Customizing buttons
      MuiButton: {
        styleOverrides: {
          containedPrimary: {
            backgroundColor: '#8A9A5B',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#A9B87E', // Slightly darker shade on hover
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