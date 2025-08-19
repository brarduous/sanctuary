import Head from "next/head";
import { AppBar, Box, Button, Card, CardActions, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, TextField, Toolbar, Typography, Container, Grid, Backdrop, IconButton, Avatar, Menu, MenuItem, Snackbar } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';

// Assuming these are correctly configured and available
import { app } from "@/utils/firebaseConfig";
import { saveSermon, getSermons, getProfile } from "@/lib/db";

import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Using AutoAwesomeIcon for consistency
import ScriptureSelector from "@/components/input/ScriptureSelector";
import { getSermonByTopic, getSermonByScripture } from "@/utils/openai";
import { generateSermonByTopicBackend, generateSermonByScriptureBackend } from "@/lib/api"; // Importing backend functions
import AccountCircle from '@mui/icons-material/AccountCircle'; // Icon for avatar fallback
import { set } from "firebase/database";

// Define Sermon and Scripture types
export type Sermon = {
  sermon_id?: string; // Added sermon_id for routing
  scripture: string;
  title: string;
  sermon_outline: string;
  key_takeaways: string;
  sermon_body: string;
  illustration?: string;
};

export type Scripture = {
  book: string;
  chapter: number;
  verse: number;
};

export default function Sermons() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [sermons, setSermons] = useState<Sermon[]>([]); // Initialize as Sermon[]
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [sermonModalOpen, setSermonModalOpen] = useState(false);
  const [sermonType, setSermonType] = useState('');
  const [scripture, setScripture] = useState<Scripture | null>(null); // Use Scripture type
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for avatar menu anchor

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const isMenuOpen = Boolean(anchorEl);

  // Handlers for avatar menu
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleCloseMenu();
    // Assuming a profile management page exists
    router.push('/profile');
  };

  const handleLogout = async () => {
    handleCloseMenu();
    try {
      await supabase.auth.signOut();
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Effect to check authentication and redirect if necessary
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        if (!user) {
          router.push('/login'); // Redirect to login if not authenticated
        } else {
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push('/login'); // Redirect on error as well
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  // Effect to fetch sermons and user profile
  useEffect(() => {
    if (!authenticated) return; // Only fetch if authenticated

    const fetchSermonData = async () => {
      try {
        const fetchedSermons = await getSermons();
        if (fetchedSermons) {
          setSermons(fetchedSermons);
        }

        const profile = await getProfile();
        if (profile) {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error("Error fetching sermon data or profile:", error);
      }
    };

    fetchSermonData();
  }, [authenticated]); // Depend on 'authenticated' state

  // Handlers for opening sermon creation modals
  const newSermonFromScripture = () => {
    setSermonType('scripture');
    setSermonModalOpen(true);
  };

  const newSermonFromTopic = () => {
    setSermonType('topic');
    setSermonModalOpen(true);
  };

  // Function to create a sermon based on type (scripture or topic)
  const createSermon = async () => {
    setSermonModalOpen(false);
    setLoading(true);

    try {
      let sermonContent: any | null = null;

      if (sermonType === 'scripture' && scripture) {
        const scriptureString = `${scripture.book} ${scripture.chapter}:${scripture.verse}`;
        sermonContent = await generateSermonByScriptureBackend(user.id, scriptureString, userProfile);
      } else if (sermonType === 'topic' && topic) {
        sermonContent = await generateSermonByTopicBackend(user.id, topic, userProfile);
      }

      if (sermonContent) {
        if ( sermonContent.message == "Sermon generation initiated." ){
          // display snackbar saying that sermon generation has been started, and will be available as soon as it completes
          setSnackbarMessage("Sermon generation initiated. It will be available once completed.");
          setSnackbarOpen(true);
        }
      } else {
        console.warn("No sermon content generated.");
      }
    } catch (error) {
      console.error("Error creating sermon:", error);
    } finally {
      setLoading(false);
      setSermonType(''); // Reset sermon type
    }
  };

  if (loading || !authenticated) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      <Head>
        <title>Sanctuary App - Sermons</title>
        <meta name="description" content="Manage your sermons with Sanctuary AI App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* AppBar for consistent top navigation/branding */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <HistoryEduIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sanctuary App
          </Typography>

          {/* Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }}>
            <Button color="inherit" onClick={() => router.push('/sermons')}>
              Sermons
            </Button>
            <Button color="inherit" onClick={() => router.push('/bible-studies')}>
              Bible Studies
            </Button>
          </Box>

          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="subtitle1" sx={{ mr: 1 }}>
                Welcome, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
              </Typography>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar alt={user?.user_metadata?.full_name || 'User'} src={user?.user_metadata?.avatar_url || ''}>
                  {!user?.user_metadata?.avatar_url && <AccountCircle />}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleCloseMenu}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Let's get to work, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
          </Typography>
          <Typography variant="h6" component="p" sx={{ mb: 3 }}>
            Start a new sermon:
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<HistoryEduIcon />}
              onClick={newSermonFromScripture}
              sx={{ py: 2, px: 4, borderRadius: 2, boxShadow: 3 }}
            >
              From Scripture
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeIcon />}
              onClick={newSermonFromTopic}
              sx={{ py: 2, px: 4, borderRadius: 2, boxShadow: 3 }}
            >
              From Topic
            </Button>
          </Box>
        </Box>

        {sermons.length > 0 && (
          <Box sx={{ my: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Your Sermons:
            </Typography>
            <Grid container spacing={3}>
              {sermons.map((sermon) => (
                <Grid size={{xs:12, sm:6, md:4}} key={sermon.sermon_id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRadius: 2,
                      boxShadow: 3,
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                        {sermon.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {sermon.scripture}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => router.push(`/sermons/${sermon.sermon_id}`)}
                      >
                        View Sermon
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Sermon Creation Dialog */}
      <Dialog open={sermonModalOpen} onClose={() => setSermonModalOpen(false)} fullWidth maxWidth="sm">
        <DialogContent sx={{ p: 4 }}>
          {sermonType === "scripture" ? (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                Select your Scripture
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Choose a scripture to base your sermon on.
              </Typography>
              <ScriptureSelector onSelectionChange={(selectedScripture) => {
                if (selectedScripture) {
                  setScripture({
                    book: selectedScripture.book,
                    chapter: Number(selectedScripture.chapter),
                    verse: Number(selectedScripture.verse),
                  });
                }
              }} />
            </>
          ) : sermonType === "topic" ? (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                Select your Topic
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Choose a topic to base your sermon on.
              </Typography>
              <TextField
                label="Topic"
                variant="outlined"
                fullWidth
                margin="normal"
                onChange={(event) => setTopic(event.target.value)}
              />
            </>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            onClick={createSermon}
            disabled={
              (sermonType === 'scripture' && !scripture) ||
              (sermonType === 'topic' && !topic)
            }
          >
            Create Sermon
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setSermonModalOpen(false);
              setSermonType('');
              setScripture(null); // Clear scripture selection
              setTopic(''); // Clear topic input
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        action={
          <Button color="inherit" onClick={() => setSnackbarOpen(false)}>
            Close
          </Button>
        }
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: 80 }} // Adjusted to avoid overlap with the AppBar  
        TransitionProps={{ onExited: () => setSnackbarMessage('') }} // Clear message after closing
      />
    </>
  );
}
