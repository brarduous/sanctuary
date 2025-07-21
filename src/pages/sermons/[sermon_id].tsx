//page for individual sermon

import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Markdown from 'react-markdown';
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css'; // Add css for snow theme
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
  TextField,
  Backdrop,
  CircularProgress,
  Avatar // For user avatar
} from "@mui/material";
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // For the options menu
import CloseIcon from '@mui/icons-material/Close'; // For preach mode close button
import AccountCircle from '@mui/icons-material/AccountCircle'; // Icon for avatar fallback

import { getSermonById, updateSermon, getProfile } from "@/utils/supabase"; // Assuming updateSermon and getProfile exist
import { supabase } from '@/lib/supabaseClient'; // For authentication
import { Marked, marked } from 'marked'; // For Markdown to HTML conversion
import { update } from "firebase/database";

// Define Sermon type (ensure it matches your database structure)
// Assuming sermon_outline and key_takeaways are stored as JSON strings
// but handled as string arrays in the component state.
export type Sermon = {
  sermon_id?: string;
  scripture: string;
  title: string;
  sermon_outline: string | string[]; // Can be string (JSON) from DB or string[] in state
  key_takeaways: string | string[]; // Can be string (JSON) from DB or string[] in state
  sermon_body: string; // Can be Markdown or HTML
  illustration?: string;
};

export default function SermonPage() {
  const router = useRouter();
  const { sermon_id } = router.query;
  const [user, setUser] = useState<any | null>(null); // For user data in header
  const [authenticated, setAuthenticated] = useState(false); // For authentication check
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [preachMode, setPreachMode] = useState(false);
  const [editedSermon, setEditedSermon] = useState<Sermon | null>(null);
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null); // For options menu
  const [avatarAnchorEl, setAvatarAnchorEl] = useState<null | HTMLElement>(null); // For avatar menu

  const isOptionsMenuOpen = Boolean(optionsAnchorEl);
  const isAvatarMenuOpen = Boolean(avatarAnchorEl);

  const { quill, quillRef } = useQuill({
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],
        ['clean']
      ],
    },
    theme: 'snow',
    readOnly: !editMode, // Set readOnly based on editMode
  });

  // --- Authentication and User Profile Logic (Copied from index.tsx) ---
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
  // --- End Authentication and User Profile Logic ---


  // Effect to load sermon data
  useEffect(() => {
    if (!sermon_id) {
      router.push("/sermons"); // Redirect if sermon_id is not present
      return;
    }

    const fetchSermon = async () => {
      setLoading(true);
      try {
        const fetchedSermon: Sermon = await getSermonById(sermon_id as string);

        if (fetchedSermon) {
          // Parse sermon_outline and key_takeaways if they are JSON strings
          const parsedSermon: Sermon = {
            ...fetchedSermon,
            sermon_outline: typeof fetchedSermon.sermon_outline === 'string'
              ? JSON.parse(fetchedSermon.sermon_outline)
              : fetchedSermon.sermon_outline,
            key_takeaways: typeof fetchedSermon.key_takeaways === 'string'
              ? JSON.parse(fetchedSermon.key_takeaways)
              : fetchedSermon.key_takeaways,
          };
          setSermon(parsedSermon);
          setEditedSermon(parsedSermon); // Initialize editedSermon
        } else {
          console.warn("Sermon not found.");
          router.push("/sermons"); // Redirect if sermon not found
        }
      } catch (error) {
        console.error("Error fetching sermon:", error);
        router.push("/sermons"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };

    fetchSermon();
  }, [sermon_id, router]);

  // Update Quill content when sermon data changes or editMode changes
  useEffect(() => {
    async function updateQuillContent() {
    if (quill && editedSermon) {
      if (editMode) {
        quill.enable(true); // Enable editing
        // Convert Markdown to HTML for Quill, or use existing HTML
        const htmlContent = editedSermon.sermon_body.startsWith('<p>') || editedSermon.sermon_body.startsWith('<h') || editedSermon.sermon_body.includes('<div')
          ? editedSermon.sermon_body // Already HTML
          : await marked.parse(editedSermon.sermon_body); // Convert Markdown to HTML
        quill.clipboard.dangerouslyPasteHTML(htmlContent);
      } else {
        quill.enable(false); // Disable editing
        // When not in edit mode, Quill should not interfere with display
        // The sermon body will be rendered by the Markdown component below
      }
    }
  }
  updateQuillContent();
  }, [quill, editedSermon, editMode]); // Removed sermon from dependencies to prevent re-rendering Quill on initial load

  // Handlers for edit mode
  const handleEditClick = () => {
    setEditMode(true);
    // Ensure editedSermon is a deep copy to avoid direct mutation
    if (sermon) {
      setEditedSermon({
        ...sermon,
        sermon_outline: Array.isArray(sermon.sermon_outline) ? [...sermon.sermon_outline] : [],
        key_takeaways: Array.isArray(sermon.key_takeaways) ? [...sermon.key_takeaways] : [],
      });
    }
  };

  const handleSaveClick = async () => {
    if (!editedSermon || !sermon_id) return;

    setLoading(true);
    try {
      const updatedSermonData = {
        sermon_id: sermon_id as string,
        title: editedSermon.title,
        scripture: editedSermon.scripture,
        sermon_body: quill?.root.innerHTML || editedSermon.sermon_body, // Get content from Quill (will be HTML)
        sermon_outline: JSON.stringify(editedSermon.sermon_outline), // Convert array back to JSON string
        key_takeaways: JSON.stringify(editedSermon.key_takeaways), // Convert array back to JSON string
        illustration: editedSermon.illustration,
      };

      const result = await updateSermon(updatedSermonData);
      if (result) {
        console.log("Sermon updated successfully!");
        // Update main sermon state with parsed arrays for consistency
        setSermon({
          ...result,
          sermon_outline: JSON.parse(result.sermon_outline as string),
          key_takeaways: JSON.parse(result.key_takeaways as string),
        });
        setEditMode(false);
      }
    } catch (error) {
      console.error("Error saving sermon:", error);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = async () => {
    setEditMode(false);
    // Revert changes by setting editedSermon back to original sermon
    if (sermon) {
      setEditedSermon({
        ...sermon,
        sermon_outline: Array.isArray(sermon.sermon_outline) ? [...sermon.sermon_outline] : [],
        key_takeaways: Array.isArray(sermon.key_takeaways) ? [...sermon.key_takeaways] : [],
      });
    }
    if (quill) {
      quill.enable(false); // Disable Quill editing
      // Re-render Markdown content if Quill was showing HTML
      const htmlContent = sermon?.sermon_body.startsWith('<p>') || sermon?.sermon_body.startsWith('<h') || sermon?.sermon_body.includes('<div')
          ? sermon?.sermon_body // Already HTML
          : await marked.parse(sermon?.sermon_body || ''); // Convert Markdown to HTML
      quill.clipboard.dangerouslyPasteHTML(htmlContent); // This will be hidden by Markdown component
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedSermon(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  const handleOutlineChange = (index: number, value: string) => {
    setEditedSermon(prev => {
      const newOutline = Array.isArray(prev?.sermon_outline) ? [...prev!.sermon_outline] : [];
      newOutline[index] = value;
      return { ...prev!, sermon_outline: newOutline };
    });
  };

  const handleTakeawaysChange = (index: number, value: string) => {
    setEditedSermon(prev => {
      const newTakeaways = Array.isArray(prev?.key_takeaways) ? [...prev!.key_takeaways] : [];
      newTakeaways[index] = value;
      return { ...prev!, key_takeaways: newTakeaways };
    });
  };

  // Handlers for preach mode
  const handlePreachModeClick = () => {
    setPreachMode(true);
  };

  const handleClosePreachMode = () => {
    setPreachMode(false);
  };

  // Handler for print
  const handlePrintClick = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Ensure sermon_body is HTML for printing
      const sermonBodyHtml = sermon?.sermon_body.startsWith('<p>') || sermon?.sermon_body.startsWith('<h') || sermon?.sermon_body.includes('<div')
        ? sermon?.sermon_body // Already HTML
        : marked.parse(sermon?.sermon_body || ''); // Convert Markdown to HTML

      printWindow.document.write(`
        <html>
        <head>
          <title>${sermon?.title || 'Sermon'}</title>
          <style>
            body { font-family: 'Inter', sans-serif; margin: 20mm; }
            h1, h2, h3 { color: #333; margin-bottom: 10px; }
            p, ul, li { line-height: 1.6; margin-bottom: 8px; }
            ul { list-style-type: disc; margin-left: 20px; }
            .footer {
              position: fixed;
              bottom: 10mm;
              left: 20mm;
              right: 20mm;
              text-align: center;
              font-size: 0.8em;
              color: #777;
              border-top: 1px solid #eee;
              padding-top: 5mm;
            }
            @media print {
              body { margin: 0; padding: 20mm; }
              .footer { position: fixed; bottom: 10mm; }
            }
          </style>
        </head>
        <body>
          <h1>${sermon?.title || ''}</h1>
          <p><strong>Scripture:</strong> ${sermon?.scripture || ''}</p>
          <h2>Outline</h2>
          <ul>
            ${Array.isArray(sermon?.sermon_outline) ? sermon?.sermon_outline.map((point: string) => `<li>${point}</li>`).join('') : ''}
          </ul>
          <h2>Key Takeaways</h2>
          <ul>
            ${Array.isArray(sermon?.key_takeaways) ? sermon?.key_takeaways.map((takeaway: string) => `<li>${takeaway}</li>`).join('') : ''}
          </ul>
          <h2>Sermon Body</h2>
          <div>${sermonBodyHtml}</div> {/* Use the HTML content here */}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Handlers for options menu
  const handleOpenOptionsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOptionsAnchorEl(event.currentTarget);
  };

  const handleCloseOptionsMenu = () => {
    setOptionsAnchorEl(null);
  };

  if (loading || !authenticated) { // Wait for both sermon data and auth to load
    return (
      <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  if (!sermon) {
    return (
      <Container sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h5">Sermon not found.</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => router.push('/sermons')}>
          Go to Sermons List
        </Button>
      </Container>
    );
  }

  // Preach Mode UI
  if (preachMode) {
    return (
      <Box
        sx={{
          bgcolor: 'black',
          color: 'white',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
          onClick={handleClosePreachMode}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
        <Typography variant="h3" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
          {sermon.title}
        </Typography>
        <Typography variant="h5" component="p" sx={{ mb: 6, textAlign: 'center' }}>
          {sermon.scripture}
        </Typography>
        <Box sx={{ maxWidth: '800px', width: '100%', fontSize: '1.5rem', lineHeight: 1.8 }}>
          {/* Render sermon body as HTML for preach mode */}
          <Markdown>{sermon.sermon_body}</Markdown>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Head>
        <title>Sanctuary App - {sermon.title}</title>
        <meta name="description" content={`Sermon: ${sermon.title}`} />
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

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 2 }}>
          {editMode ? (
            <>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSaveClick}>
                Save
              </Button>
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancelEdit} color="error">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditClick}>
                Edit
              </Button>
              <IconButton color="primary" onClick={handleOpenOptionsMenu}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={optionsAnchorEl}
                open={isOptionsMenuOpen}
                onClose={handleCloseOptionsMenu}
              >
                <MenuItem onClick={() => { handleCloseOptionsMenu(); handlePreachModeClick(); }}>
                  <VisibilityIcon sx={{ mr: 1 }} /> Preach Mode
                </MenuItem>
                <MenuItem onClick={() => { handleCloseOptionsMenu(); handlePrintClick(); }}>
                  <PrintIcon sx={{ mr: 1 }} /> Print
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            {editMode ? (
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={editedSermon?.title || ''}
                onChange={handleFieldChange}
                variant="outlined"
                margin="normal"
              />
            ) : (
              <Typography variant="h4" component="h1" gutterBottom>
                {sermon.title}
              </Typography>
            )}
            {editMode ? (
              <TextField
                fullWidth
                label="Scripture"
                name="scripture"
                value={editedSermon?.scripture || ''}
                onChange={handleFieldChange}
                variant="outlined"
                margin="normal"
              />
            ) : (
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {sermon.scripture}
              </Typography>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Outline
            </Typography>
            {editMode ? (
              <Box>
                {Array.isArray(editedSermon?.sermon_outline) && editedSermon?.sermon_outline.map((point: string, index: number) => (
                  <TextField
                    key={index}
                    fullWidth
                    value={point}
                    onChange={(e) => handleOutlineChange(index, e.target.value)}
                    variant="outlined"
                    margin="dense"
                    sx={{ mb: 1 }}
                  />
                ))}
                {/* Add button to add new outline point */}
                <Button
                  variant="outlined"
                  onClick={() => setEditedSermon(prev => ({ ...prev!, sermon_outline: [...(prev?.sermon_outline || []), ''] }))}
                  sx={{ mt: 1 }}
                >
                  Add Outline Point
                </Button>
              </Box>
            ) : (
              <ul>
                {Array.isArray(sermon.sermon_outline) && sermon.sermon_outline.map((point: string, index: number) => (
                  <Typography component="li" key={index} sx={{ mb: 0.5 }}>
                    {point}
                  </Typography>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Key Takeaways
            </Typography>
            {editMode ? (
              <Box>
                {Array.isArray(editedSermon?.key_takeaways) && editedSermon?.key_takeaways.map((takeaway: string, index: number) => (
                  <TextField
                    key={index}
                    fullWidth
                    value={takeaway}
                    onChange={(e) => handleTakeawaysChange(index, e.target.value)}
                    variant="outlined"
                    margin="dense"
                    sx={{ mb: 1 }}
                  />
                ))}
                {/* Add button to add new takeaway */}
                <Button
                  variant="outlined"
                  onClick={() => setEditedSermon(prev => ({ ...prev!, key_takeaways: [...(prev?.key_takeaways || []), ''] }))}
                  sx={{ mt: 1 }}
                >
                  Add Key Takeaway
                </Button>
              </Box>
            ) : (
              <ul>
                {Array.isArray(sermon.key_takeaways) && sermon.key_takeaways.map((takeaway: string, index: number) => (
                  <Typography component="li" key={index} sx={{ mb: 0.5 }}>
                    {takeaway}
                  </Typography>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Sermon Body
            </Typography>
            <Box sx={{ border: editMode ? '1px solid #ccc' : 'none', borderRadius: 1, p: editMode ? 1 : 0 }}>
              {editMode ? (
                <div ref={quillRef} /> // Quill editor in edit mode
              ) : (
                // Display sermon body as Markdown when not in edit mode
                <Markdown>{sermon.sermon_body}</Markdown>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
