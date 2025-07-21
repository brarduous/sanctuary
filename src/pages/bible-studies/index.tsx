import Head from "next/head";
import { AppBar, Autocomplete, Backdrop, Box, Button, Card, CardContent, CircularProgress, Dialog, DialogActions, DialogContent, TextField, Toolbar, Typography, Container, Grid, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabaseClient';

import { books, bibleStudyMethods } from "@/lib/declarations";

import { app } from "@/utils/firebaseConfig"; // Ensure this path points to your Firebase configuration file
import { saveSermon, getSermons, saveBibleStudy, getBibleStudies, saveBibleStudyLesson } from "@/utils/supabase";

import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccountCircle from '@mui/icons-material/AccountCircle'; // Icon for avatar fallback
import { getBibleStudy } from "@/utils/openai";

//create Bible Study type
export type BibleStudy = {
    title: string;
    subtitle: string;
    studies?: Lesson[];
    illustration?: string;
    study_id?: string; // Added for routing
};
export type Lesson = {
    title: string;
    scripture: string;
    study_outline: string;
    study_body: string;
    reflection_questions: string[];
    study_id?: string;
    lesson_number?: number;
};
export type Scripture = {
    book: string;
    chapter: number;
    verse: number;
};


export default function BibleStudies() {
    const router = useRouter();
    const [user, setUser] = useState<any | null>(null);
    const [bibleStudies, setBibleStudies] = useState<BibleStudy[]>([]); // Use BibleStudy type
    const [authenticated, setAuthenticated] = useState(false);
    const [studyModalOpen, setStudyModalOpen] = useState(false);
    const [studyType, setStudyType] = useState('');
    const [studyMethod, setStudyMethod] = useState('');
    const [book, setBook] = useState<string | null>(null); // Changed to string for book name
    const [studyLength, setStudyLength] = useState<number>(0); // Initialize as number
    const [loading, setLoading] = useState(true);
    const [topic, setTopic] = useState('');
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

    function newBibleStudyFromBook() {
        setStudyType('book');
        setStudyModalOpen(true);
    }
    function newBibleStudyFromTopic() { // Renamed from newSermonFromTopic for clarity
        setStudyType('topic');
        setStudyModalOpen(true);
    }

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

    useEffect(() => {
        if (!authenticated) return; // Only fetch if authenticated

        getBibleStudies().then((e) => {
            console.log(e);
            if (e == null) return;
            setBibleStudies(e);
        });

    }, [authenticated]); // Depend on 'authenticated' state

    async function createBibleStudy() { // Renamed from createSermon for clarity
        setStudyModalOpen(false);
        setLoading(true);

        try {
            let generatedStudy: string | null = null;

            if (studyType === 'book' && book) {
                generatedStudy = await getBibleStudy(`The Book of ${book}`, studyLength, studyMethod);
            } else if (studyType === 'topic' && topic) {
                generatedStudy = await getBibleStudy(topic, studyLength, studyMethod);
            }

            if (generatedStudy) {
                const bibleStudy: BibleStudy = JSON.parse(generatedStudy);
                const bibleStudyLessons = bibleStudy.studies;
                delete bibleStudy.studies; // Remove studies before saving the main study

                const savedStudy = await saveBibleStudy(bibleStudy);
                if (savedStudy && savedStudy.study_id) {
                    const study_id = savedStudy.study_id;

                    if (bibleStudyLessons && bibleStudyLessons.length > 0) {
                        for (let i = 0; i < bibleStudyLessons.length; i++) {
                            const lesson = bibleStudyLessons[i];
                            lesson.lesson_number = i + 1;
                            lesson.study_id = study_id;
                            await saveBibleStudyLesson(lesson);
                            console.log("Lesson saved successfully");
                        }
                    }
                    router.push('/bible-studies/' + study_id);
                } else {
                    console.error("Failed to save bible study or retrieve study ID.");
                }
            } else {
                console.warn("No bible study content generated.");
            }
        } catch (error) {
            console.error("Error creating bible study:", error);
        } finally {
            setLoading(false);
            setStudyType(''); // Reset study type
            setBook(null);
            setTopic('');
            setStudyLength(0);
            setStudyMethod('');
        }
    }

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
                <title>Bible Studies - Sanctuary App</title>
                <meta name="description" content="Manage your bible studies with Sanctuary AI App" />
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
                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
                    </Typography>
                    <Typography variant="h6" component="p" sx={{ mb: 3 }}>
                        Start a new Bible Study:
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<HistoryEduIcon />}
                            onClick={newBibleStudyFromBook}
                            sx={{ py: 2, px: 4, borderRadius: 2, boxShadow: 3 }}
                        >
                            From Book of the Bible
                        </Button>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AutoAwesomeIcon />}
                            onClick={newBibleStudyFromTopic}
                            sx={{ py: 2, px: 4, borderRadius: 2, boxShadow: 3 }}
                        >
                            From Topic
                        </Button>
                    </Box>
                </Box>

                {bibleStudies.length > 0 && (
                    <Box sx={{ my: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom>
                            Your Bible Studies:
                        </Typography>
                        <Grid container spacing={3}>
                            {bibleStudies.map((bibleStudy, index) => (
                                <Grid size={{xs:12, sm:6, md:4}} key={bibleStudy.study_id || index}>
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
                                        onClick={() => { router.push('/bible-studies/' + bibleStudy.study_id) }}
                                    >
                                        <CardContent>
                                            <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                                                {bibleStudy.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {bibleStudy.subtitle}
                                            </Typography>
                                        </CardContent>
                                        {/* CardActions can be added here if needed */}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}
            </Container>

            {/* Bible Study Creation Dialog */}
            <Dialog open={studyModalOpen} onClose={() => setStudyModalOpen(false)} fullWidth maxWidth="sm">
                <DialogContent sx={{ p: 4 }}>
                    {studyType === "book" ?
                        (
                            <>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Select your Book of the Bible
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    Choose a book of the Bible to base your Bible Study on.
                                </Typography>
                                <Autocomplete
                                    onChange={(e, selectedBook) => {
                                        if (selectedBook != null) {
                                            setBook(selectedBook);
                                        }
                                    }}
                                    options={books}
                                    renderInput={(params) => <TextField {...params} label="Book of the Bible" variant="outlined" fullWidth margin="normal" />}
                                />
                                <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                                    Choose a Bible Study Method.
                                </Typography>
                                <Autocomplete
                                    onChange={(e, method) => {
                                        if (method != null) {
                                            setStudyMethod(method);
                                        }
                                    }}
                                    options={bibleStudyMethods}
                                    renderInput={(params) => <TextField {...params} label="Bible Study Method" variant="outlined" fullWidth margin="normal" />}
                                />
                                <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                                    How many lessons should this study contain?
                                </Typography>
                                <TextField
                                    label="Number of Studies"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    value={studyLength === 0 ? '' : studyLength} // Handle initial 0 display
                                    onChange={(event) => { setStudyLength(Number(event.currentTarget.value)) }}
                                    inputProps={{ min: 1 }} // Ensure positive number
                                />
                            </>
                        )
                        : studyType === "topic" ?
                            (<>
                                <Typography variant="h5" component="h2" gutterBottom>
                                    Select your Topic
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2 }}>
                                    Enter a topic to base your Bible Study on.
                                </Typography>
                                <TextField
                                    label="Topic"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    onChange={(event) => { setTopic(event.currentTarget.value) }}
                                />
                                <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                                    Choose a Bible Study Method.
                                </Typography>
                                <Autocomplete
                                    onChange={(e, method) => {
                                        if (method != null) {
                                            setStudyMethod(method);
                                        }
                                    }}
                                    options={bibleStudyMethods}
                                    renderInput={(params) => <TextField {...params} label="Bible Study Method" variant="outlined" fullWidth margin="normal" />}
                                />
                                <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
                                    How many lessons should this study contain?
                                </Typography>
                                <TextField
                                    label="Number of Studies"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    value={studyLength === 0 ? '' : studyLength} // Handle initial 0 display
                                    onChange={(event) => { setStudyLength(Number(event.currentTarget.value)) }}
                                    inputProps={{ min: 1 }} // Ensure positive number
                                />
                            </>)
                            : null}
                </DialogContent>
                <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
                    <Button
                        startIcon={<AutoAwesomeIcon />}
                        variant="contained"
                        onClick={createBibleStudy}
                        disabled={
                            (studyType === 'book' && (!book || studyLength <= 0 || !studyMethod)) ||
                            (studyType === 'topic' && (!topic || studyLength <= 0 || !studyMethod))
                        }
                    >
                        Create
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setStudyModalOpen(false);
                            setStudyType('');
                            setBook(null);
                            setTopic('');
                            setStudyLength(0);
                            setStudyMethod('');
                        }}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
