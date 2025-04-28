import React, { useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Box, Grid, SelectChangeEvent } from '@mui/material';

import { bibleData } from '@/utils/scriptureData';

const bookNames = Object.keys(bibleData);
// --- End Data Structure ---

interface ScriptureSelectorProps {
    // Optional: Callback function to notify parent of selection changes
    onSelectionChange?: (selection: { book: string; chapter: number | ''; verse: string | '' }) => void;
    // Optional: Initial selection
    initialSelection?: { book: string; chapter: number | ''; verse: string | '' };
}

const ScriptureSelector: React.FC<ScriptureSelectorProps> = ({ onSelectionChange, initialSelection }) => {
    const [selectedBook, setSelectedBook] = useState<string>(initialSelection?.book || '');
    const [selectedChapter, setSelectedChapter] = useState<number | ''>(initialSelection?.chapter || '');
    const [selectedStartVerse, setSelectedStartVerse] = useState<number | ''>();
    const [selectedEndVerse, setSelectedEndVerse] = useState<number | ''>();

    const [chapters, setChapters] = useState<number[]>([]);
    const [verses, setVerses] = useState<number[]>([]);

    // Effect to update chapters when book changes
    useEffect(() => {
        if (selectedBook && bibleData[selectedBook]) {
            const chapterNumbers = Object.keys(bibleData[selectedBook].chapters).map(Number);
            setChapters(chapterNumbers);
            // Reset chapter and verse if book changes
            if (!initialSelection || selectedBook !== initialSelection.book) {
                 setSelectedChapter('');
                 setSelectedStartVerse('');
                    setSelectedEndVerse('');
                 setVerses([]);
            } else if (initialSelection?.chapter) {
                // If it's the initial load with a chapter, set it
                setSelectedChapter(initialSelection.chapter);
            }

        } else {
            setChapters([]);
            setSelectedChapter('');
            setSelectedStartVerse('');
            setSelectedEndVerse('');
             // Reset verse if book changes
            setVerses([]);
        }
    }, [selectedBook, initialSelection]); // Rerun if selectedBook or initialSelection changes

    // Effect to update verses when chapter changes
    useEffect(() => {
        if (selectedBook && selectedChapter && bibleData[selectedBook]?.chapters[selectedChapter]) {
            const verseCount = bibleData[selectedBook].chapters[selectedChapter];
            const verseNumbers = Array.from({ length: verseCount }, (_, i) => i + 1);
            setVerses(verseNumbers);
             // Reset verse if chapter changes without an initial verse for this chapter
            if (!initialSelection || selectedBook !== initialSelection.book || selectedChapter !== initialSelection.chapter) {
                setSelectedStartVerse('');
            } else if (initialSelection?.verse) {
                 // If it's the initial load with a verse, set it
                 setSelectedStartVerse(Number(initialSelection.verse) || '')
            }
        } else {
            setVerses([]);
             setSelectedStartVerse('');
        }
    }, [selectedBook, selectedChapter, initialSelection]); // Rerun if book, chapter or initialSelection changes


    // Effect to call the callback when selection changes
    useEffect(() => {
        if (onSelectionChange) {
            onSelectionChange({ book: selectedBook, chapter: selectedChapter, verse: selectedStartVerse + (selectedEndVerse ? `-${selectedEndVerse}` : '') });
        }
    }, [selectedBook, selectedChapter, selectedStartVerse, selectedEndVerse]);


    const handleBookChange = (event: SelectChangeEvent<string>) => {
        setSelectedBook(event.target.value);
        // Reset subsequent selections
        // Note: useEffect handles resetting chapter/verse state now
    };

    const handleChapterChange = (event: SelectChangeEvent<number | ''>) => {
        setSelectedChapter(event.target.value as number | '');
         // Reset subsequent selections
         // Note: useEffect handles resetting verse state now
    };

     const handleStartVerseChange = (event: SelectChangeEvent<number | ''>) => {
        setSelectedStartVerse(event.target.value as number | '');
    };
    const handleEndVerseChange = (event: SelectChangeEvent<number | ''>) => {
        setSelectedEndVerse(event.target.value as number | '');
    }

    return (
        <Box sx={{ flexGrow: 1, padding: 2 }}>
            <Grid container spacing={2} alignItems="center">
                {/* Book Selector */}
                <Grid size={6} >
                    <FormControl fullWidth>
                        <InputLabel id="book-select-label">Book</InputLabel>
                        {/*todo: change to autocomplete */}

                        <Select
                            labelId="book-select-label"
                            id="book-select"
                            value={selectedBook}
                            label="Book"
                            onChange={handleBookChange}
                        >
                            <MenuItem value=""><em>Select Book</em></MenuItem>
                            {bookNames.map((bookName) => (
                                <MenuItem key={bookName} value={bookName}>
                                    {bookName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Chapter Selector */}
                <Grid size={6} >
                    <FormControl fullWidth disabled={!selectedBook}>
                        <InputLabel id="chapter-select-label">Chapter</InputLabel>
                        {/*todo: change to autocomplete */}
                        <Select
                            labelId="chapter-select-label"
                            id="chapter-select"
                            value={selectedChapter}
                            label="Chapter"
                            onChange={handleChapterChange}
                        >
                             <MenuItem value=""><em>Select Chapter</em></MenuItem>
                             {chapters.map((chapterNum:any) => (
                                <MenuItem key={chapterNum} value={chapterNum}>
                                    {chapterNum}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                {/* Start Verse Selector */}
                <Grid size={6}>
                    <FormControl fullWidth disabled={!selectedChapter}>
                        <InputLabel id="start-verse-select-label">Start Verse</InputLabel>
                                                {/*todo: change to autocomplete */}

                        <Select
                            labelId="start-verse-select-label"
                            id="start-verse-select"
                            value={selectedStartVerse}
                            label="Start Verse"
                            onChange={handleStartVerseChange}
                        >
                            <MenuItem value=""><em>Select Start Verse</em></MenuItem>
                            {verses.map((verseNum) => (
                                <MenuItem key={verseNum} value={verseNum}>
                                    {verseNum}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* End Verse Selector */}
                <Grid size={6}>
                    <FormControl fullWidth disabled={!selectedChapter || !selectedStartVerse}>
                        <InputLabel id="end-verse-select-label">End Verse</InputLabel>
                                                {/*todo: change to autocomplete */}

                        <Select
                            labelId="end-verse-select-label"
                            id="end-verse-select"
                            value={selectedEndVerse}
                            label="End Verse"
                            onChange={handleEndVerseChange}
                        >
                            <MenuItem value=""><em>Select End Verse</em></MenuItem>
                            {verses
                                .filter((verseNum) => verseNum >= (selectedStartVerse || 0))
                                .map((verseNum) => (
                                    <MenuItem key={verseNum} value={verseNum}>
                                        {verseNum}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </Grid>
                
                
            </Grid>
        </Box>
    );
};

export default ScriptureSelector;