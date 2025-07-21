//page for individual bible study

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Markdown from 'react-markdown';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Backdrop,
  CircularProgress,
  Avatar, // For user avatar
  Grid,
  Tab,
  Tabs
} from "@mui/material";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AccountCircle from '@mui/icons-material/AccountCircle'; // Icon for avatar fallback

import { getBibleStudyById, getBibleStudyLessons } from "@/utils/supabase";
import { supabase } from '@/lib/supabaseClient'; // For authentication

// Define BibleStudy and Lesson types (ensure they match your database structure)
export type BibleStudy = {
  study_id?: string;
  title: string;
  subtitle: string;
  illustration?: string;
};

export type Lesson = {
  lesson_id?: string;
  study_id?: string;
  lesson_number?: number;
  title: string;
  scripture: string | string[]; // Can be string (JSON) from DB or string[] in state
  commentary: string; // This was 'study_body' in previous index.tsx
  discussion_starters?: string[]; // This was 'reflection_questions' in previous index.tsx
  application_sidebar: {
    title: string;
    body: string;
  };
  conclusion: {
    summary: string;
    thoughtToRemember: string;
    prayer: string;
  };
};

export default function BibleStudyPage() {
  const router = useRouter();
  const { study_id } = router.query;
  const [user, setUser] = useState<any | null>(null); // For user data in header
  const [authenticated, setAuthenticated] = useState(false); // For authentication check
  const [study, setStudy] = useState<BibleStudy | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null); // To track active lesson tab
  const [loading, setLoading] = useState(true);
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<null | HTMLElement>(null); // For avatar menu

  const isAvatarMenuOpen = Boolean(avatarAnchorEl);

  // Handlers for avatar menu
  const handleAvatarMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAvatarAnchorEl(event.currentTarget);
  };

  const handleCloseAvatarMenu = () => {
    setAvatarAnchorEl(null);
  };

  const handleProfileClick = () => {
    handleCloseAvatarMenu();
    router.push('/profile'); // Assuming a profile management page exists
  };

  const handleLogout = async () => {
    handleCloseAvatarMenu();
    try {
      await supabase.auth.signOut();
      router.push('/login'); // Redirect to login after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // --- Authentication and User Profile Logic ---
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
      }
    };
    checkAuth();
  }, [router]);
  // --- End Authentication and User Profile Logic ---

  // Effect to load Bible Study and Lessons data
  useEffect(() => {
    if (!router.isReady || !study_id) {
      // router.isReady ensures query params are available
      return;
    }

    const fetchStudyData = async () => {
      setLoading(true);
      try {
        const fetchedStudy: BibleStudy = await getBibleStudyById(study_id as string);
        if (fetchedStudy) {
          setStudy(fetchedStudy);

          const fetchedLessons: Lesson[] = await getBibleStudyLessons(study_id as string) || [];
          if (fetchedLessons && fetchedLessons.length > 0) {
            // Parse scripture if it's a JSON string
            const parsedLessons = fetchedLessons.map(lesson => ({
              ...lesson,
              scripture: typeof lesson.scripture === 'string' && lesson.scripture.startsWith('[') && lesson.scripture.endsWith(']')
                ? JSON.parse(lesson.scripture)
                : lesson.scripture,
              discussion_starters: typeof lesson.discussion_starters === 'string' && String(lesson.discussion_starters).startsWith('[') && String(lesson.discussion_starters).endsWith(']')
                ? JSON.parse(lesson.discussion_starters)
                : lesson.discussion_starters,
            }));
            setLessons(parsedLessons);
            setCurrentLessonId(parsedLessons[0]?.lesson_id || null); // Set the first lesson as current
          } else {
            setLessons([]);
            setCurrentLessonId(null);
          }
        } else {
          console.warn("Bible Study not found.");
          router.push("/bible-studies"); // Redirect if study not found
        }
      } catch (error) {
        console.error("Error fetching Bible Study:", error);
        router.push("/bible-studies"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchStudyData();
  }, [study_id, router.isReady, router]); // Depend on router.isReady to ensure query is available

  const currentLesson = lessons.find(lesson => lesson.lesson_id === currentLessonId);

  if (loading || !authenticated) {
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!study) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5">Bible Study not found.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/bible-studies')}>
          Go to Bible Studies List
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Sanctuary App - {study.title}</title>
        <meta name="description" content={`Bible Study: ${study.title}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* AppBar for consistent top navigation/branding */}
      <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back to bible studies" onClick={() => router.push('/bible-studies')}>
            <HistoryEduIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
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
                aria-controls="menu-appbar-avatar"
                aria-haspopup="true"
                onClick={handleAvatarMenu}
                color="inherit"
              >
                <Avatar alt={user?.user_metadata?.full_name || 'User'} src={user?.user_metadata?.avatar_url || ''}>
                  {!user?.user_metadata?.avatar_url && <AccountCircle />}
                </Avatar>
              </IconButton>
              <Menu
                id="menu-appbar-avatar"
                anchorEl={avatarAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={isAvatarMenuOpen}
                onClose={handleCloseAvatarMenu}
              >
                <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom>
              {study.title}
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {study.subtitle}
            </Typography>
          </CardContent>
        </Card>

        {lessons.length > 0 && (
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Lessons
              </Typography>
              <Tabs
                value={currentLessonId}
                onChange={(event, newValue) => setCurrentLessonId(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ mb: 2 }}
              >
                {lessons.map((lesson) => (
                  <Tab value={lesson.lesson_id} label={`Lesson ${lesson.lesson_number}`} key={lesson.lesson_id} />
                ))}
              </Tabs>

              {currentLesson && (
                <Grid container spacing={4}>
                  <Grid size={{xs:12, md:8}}>
                    <Card sx={{ height: '100%', borderRadius: 2, boxShadow: 1 }}>
                      <CardContent>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {currentLesson.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
                          <Box component="span" sx={{ fontWeight: 600, color: '#8A9A5B' }}>Background Scripture:</Box>{" "}
                          {Array.isArray(currentLesson.scripture)
                            ? currentLesson.scripture.join(', ')
                            : currentLesson.scripture}
                        </Typography>
                        <Markdown>{currentLesson.commentary}</Markdown>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{xs:12, md:4}}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {currentLesson.discussion_starters && currentLesson.discussion_starters.length > 0 && (
                        <Card sx={{ borderLeft: '4px solid #8A9A5B', borderRadius: 2, boxShadow: 1 }}>
                          <CardContent>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }} gutterBottom>
                              Discussion Starters
                            </Typography>
                            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                              {currentLesson.discussion_starters.map((starter: string, index: number) => (
                                <Typography component="li" key={index} sx={{ mb: 0.5 }}>
                                  {starter}
                                </Typography>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                      {currentLesson.application_sidebar && (
                        <Card sx={{ borderLeft: '4px solid #8A9A5B', borderRadius: 2, boxShadow: 1 }}>
                          <CardContent>
                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }} gutterBottom>
                              {currentLesson.application_sidebar.title}
                            </Typography>
                            <Typography variant="body2">{currentLesson.application_sidebar.body}</Typography>
                          </CardContent>
                        </Card>
                      )}
                      {currentLesson.conclusion && (
                        <>
                          <Card sx={{ borderLeft: '4px solid #8A9A5B', borderRadius: 2, boxShadow: 1 }}>
                            <CardContent>
                              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }} gutterBottom>
                                Summary
                              </Typography>
                              <Typography variant="body2">{currentLesson.conclusion.summary}</Typography>
                            </CardContent>
                          </Card>
                          <Card sx={{ borderLeft: '4px solid #8A9A5B', borderRadius: 2, boxShadow: 1 }}>
                            <CardContent>
                              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }} gutterBottom>
                                Remember...
                              </Typography>
                              <Typography variant="body2">{currentLesson.conclusion.thoughtToRemember}</Typography>
                            </CardContent>
                          </Card>
                          <Card sx={{ borderLeft: '4px solid #8A9A5B', borderRadius: 2, boxShadow: 1 }}>
                            <CardContent>
                              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }} gutterBottom>
                                Prayer
                              </Typography>
                              <Typography variant="body2">{currentLesson.conclusion.prayer}</Typography>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              )}
            </CardContent>
          </Card>
        )}
      </Container>
    </>
  );
}