import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    Stepper,
    Step,
    StepLabel,
    Typography,
    TextField,
    Grid,
    Paper,
    RadioGroup,
    FormControlLabel,
    Radio,
    Card,
    CardActionArea,
    CardContent,
} from "@mui/material";

import { supabase } from "../lib/supabaseClient"; // Adjust the import path as needed

// --- Types ---
type PreachingStyle =
    | "Expository"
    | "Topical"
    | "Textual"
    | "Principle";

type OratoricalStyle =
    | "Persuader"
    | "Prophet"
    | "Evangelist"
    | "Scholar";

type SermonLength =
    | "Short"
    | "Standard"
    | "Long";

interface OnboardingState {
    churchName: string;
    denomination: string;
    preachingStyle: PreachingStyle | null;
    oratoricalStyle: OratoricalStyle | null;
    sermonLength: SermonLength | null;
}

// --- Step Titles ---
const stepTitles = [
    "Tell Us About Your Ministry",
    "What is your primary preaching style?",
    "Choose an Oratorical Style",
    "Final Details",
    "Confirm Your Preferences",
];

// --- Main Onboarding Component ---
const Onboarding: React.FC = () => {
    const [form, setForm] = useState<OnboardingState>({
        churchName: "",
        denomination: "",
        preachingStyle: null,
        oratoricalStyle: null,
        sermonLength: null,
    });
    const [step, setStep] = useState(0);

    // Navigation handlers
    const nextStep = () => setStep((s) => Math.min(s + 1, stepTitles.length - 1));
    const prevStep = () => setStep((s) => Math.max(s - 1, 0));

    // Step validation
    const isStepValid = () => {
        switch (step) {
            case 0:
                return true;
            case 1:
                return !!form.preachingStyle;
            case 2:
                return !!form.oratoricalStyle;
            case 3:
                return !!form.sermonLength;
            case 4:
                return true;
            default:
                return false;
        }
    };

    const handleFinish = async () => {
        // eslint-disable-next-line no-console
        console.log("Onboarding Complete:", form);
        const user_id = (await supabase.auth.getUser()).data.user?.id;
        supabase.from('user_profiles').upsert({
            user_id: user_id,
            updated_at: new Date(),
            sermon_preferences: form,
        }).then(({ error }) => {
            if (error) {
                console.error("Error saving onboarding data:", error);
            } else {
                // Redirect to home page:
                window.location.href = "/";
                console.log("Onboarding data saved successfully.");
            }
        });
    };

    return (
        <Container maxWidth="sm" sx={{ py: 6 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
                    {stepTitles.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Box>
                    {step === 0 && (
                        <StepMinistryInfo
                            form={form}
                            setForm={setForm}
                        />
                    )}
                    {step === 1 && (
                        <StepPreachingStyle
                            selected={form.preachingStyle}
                            onSelect={(val) => setForm((f) => ({ ...f, preachingStyle: val }))}
                        />
                    )}
                    {step === 2 && (
                        <StepOratoricalStyle
                            selected={form.oratoricalStyle}
                            onSelect={(val) => setForm((f) => ({ ...f, oratoricalStyle: val }))}
                        />
                    )}
                    {step === 3 && (
                        <StepSermonDetails
                            selected={form.sermonLength}
                            onSelect={(val) => setForm((f) => ({ ...f, sermonLength: val }))}
                        />
                    )}
                    {step === 4 && (
                        <StepConfirmation form={form} />
                    )}
                </Box>
                <Box display="flex" justifyContent="space-between" mt={4}>
                    <Button
                        variant="outlined"
                        onClick={prevStep}
                        disabled={step === 0}
                    >
                        Back
                    </Button>
                    {step < stepTitles.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={nextStep}
                            disabled={!isStepValid()}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleFinish}
                        >
                            Finish Setup
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
};

// --- Step 1: Ministry Info ---
const StepMinistryInfo: React.FC<{
    form: OnboardingState;
    setForm: React.Dispatch<React.SetStateAction<OnboardingState>>;
}> = ({ form, setForm }) => (
    <Box>
        <Typography variant="h5" fontWeight="bold" mb={1}>
            Tell Us About Your Ministry
        </Typography>
        <Typography mb={3} color="text.secondary">
            This information is optional, but helps us personalize your experience.
        </Typography>
        <Box component="form" noValidate autoComplete="off">
            <TextField
                label="Church Name (Optional)"
                fullWidth
                margin="normal"
                value={form.churchName}
                onChange={(e) => setForm((f) => ({ ...f, churchName: e.target.value }))}
                placeholder="e.g. Grace Community Church"
            />
            <TextField
                label="Denomination (Optional)"
                fullWidth
                margin="normal"
                value={form.denomination}
                onChange={(e) => setForm((f) => ({ ...f, denomination: e.target.value }))}
                placeholder="e.g. Baptist, Methodist, Non-denominational"
            />
        </Box>
    </Box>
);

// --- Step 2: Preaching Style ---
const preachingStyles: {
    key: PreachingStyle;
    title: string;
    desc: string;
}[] = [
    {
        key: "Expository",
        title: "Expository",
        desc: "Explains the meaning of a specific passage of scripture, following its structure.",
    },
    {
        key: "Topical",
        title: "Topical",
        desc: "Explores a specific subject using various scriptures from across the Bible.",
    },
    {
        key: "Textual",
        title: "Textual",
        desc: "Derives the main points from a short scripture text, like one or two verses.",
    },
    {
        key: "Principle",
        title: "Principle",
        desc: "Focuses on extracting timeless, practical principles from a text or topic.",
    },
];

const StepPreachingStyle: React.FC<{
    selected: PreachingStyle | null;
    onSelect: (val: PreachingStyle) => void;
}> = ({ selected, onSelect }) => (
    <Box>
        <Typography variant="h5" fontWeight="bold" mb={1}>
            What is your primary preaching style?
        </Typography>
        <Typography mb={3} color="text.secondary">
            This helps the AI understand how to structure the sermon content.
        </Typography>
        <Grid container spacing={2}>
            {preachingStyles.map((style) => (
                <Grid size= {{xs:12,  sm:6}} key={style.key}>
                    <Card
                        variant={selected === style.key ? "elevation" : "outlined"}
                        sx={{
                            borderColor: selected === style.key ? "primary.main" : undefined,
                            boxShadow: selected === style.key ? 4 : undefined,
                        }}
                    >
                        <CardActionArea onClick={() => onSelect(style.key)}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {style.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {style.desc}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Box>
);

// --- Step 3: Oratorical Style ---
const oratoricalStyles: {
    key: OratoricalStyle;
    title: string;
    example: string;
    desc: string;
}[] = [
    {
        key: "Persuader",
        title: "The Persuader",
        example: "e.g., Charles Spurgeon",
        desc: "Features rich, descriptive language with practical, everyday illustrations.",
    },
    {
        key: "Prophet",
        title: "The Prophet",
        example: "e.g., Dr. Martin Luther King, Jr.",
        desc: "Uses powerful rhetoric and repetition, building to a hopeful, prophetic vision.",
    },
    {
        key: "Evangelist",
        title: "The Evangelist",
        example: "e.g., Billy Graham",
        desc: "A simple, clear, and direct message with a strong call to action.",
    },
    {
        key: "Scholar",
        title: "The Scholar",
        example: "e.g., R.C. Sproul",
        desc: "A logical, theological, and systematic presentation focused on deep understanding.",
    },
];

const StepOratoricalStyle: React.FC<{
    selected: OratoricalStyle | null;
    onSelect: (val: OratoricalStyle) => void;
}> = ({ selected, onSelect }) => (
    <Box>
        <Typography variant="h5" fontWeight="bold" mb={1}>
            Choose an Oratorical Style
        </Typography>
        <Typography mb={3} color="text.secondary">
            This defines the tone and rhetorical flavor of the sermon.
        </Typography>
        <Grid container spacing={2}>
            {oratoricalStyles.map((style) => (
                <Grid size={{xs:12, sm:6}} key={style.key}>
                    <Card
                        variant={selected === style.key ? "elevation" : "outlined"}
                        sx={{
                            borderColor: selected === style.key ? "primary.main" : undefined,
                            boxShadow: selected === style.key ? 4 : undefined,
                        }}
                    >
                        <CardActionArea onClick={() => onSelect(style.key)}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {style.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {style.example}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {style.desc}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            ))}
        </Grid>
    </Box>
);

// --- Step 4: Sermon Details ---
const sermonLengths: {
    key: SermonLength;
    label: string;
}[] = [
    { key: "Short", label: "Short (15-20 minutes)" },
    { key: "Standard", label: "Standard (25-30 minutes)" },
    { key: "Long", label: "Long (35-45+ minutes)" },
];

const StepSermonDetails: React.FC<{
    selected: SermonLength | null;
    onSelect: (val: SermonLength) => void;
}> = ({ selected, onSelect }) => (
    <Box>
        <Typography variant="h5" fontWeight="bold" mb={1}>
            Final Details
        </Typography>
        <Typography mb={3} color="text.secondary">
            How long is your typical sermon?
        </Typography>
        <RadioGroup
            value={selected || ""}
            onChange={(e) => onSelect(e.target.value as SermonLength)}
        >
            {sermonLengths.map((len) => (
                <FormControlLabel
                    key={len.key}
                    value={len.key}
                    control={<Radio color="primary" />}
                    label={len.label}
                />
            ))}
        </RadioGroup>
    </Box>
);

// --- Step 5: Confirmation ---
const StepConfirmation: React.FC<{ form: OnboardingState }> = ({ form }) => (
    <Box>
        <Typography variant="h5" fontWeight="bold" mb={1}>
            Confirm Your Preferences
        </Typography>
        <Typography mb={3} color="text.secondary">
            Please review your selections before finishing setup.
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
            <li>
                <Typography>
                    <strong>Church Name:</strong>{" "}
                    {form.churchName || <span style={{ color: "#888" }}>Not provided</span>}
                </Typography>
            </li>
            <li>
                <Typography>
                    <strong>Denomination:</strong>{" "}
                    {form.denomination || <span style={{ color: "#888" }}>Not provided</span>}
                </Typography>
            </li>
            <li>
                <Typography>
                    <strong>Preaching Style:</strong>{" "}
                    {form.preachingStyle}
                </Typography>
            </li>
            <li>
                <Typography>
                    <strong>Oratorical Style:</strong>{" "}
                    {form.oratoricalStyle &&
                        oratoricalStyles.find((s) => s.key === form.oratoricalStyle)?.title}
                </Typography>
            </li>
            <li>
                <Typography>
                    <strong>Typical Sermon Length:</strong>{" "}
                    {form.sermonLength &&
                        sermonLengths.find((l) => l.key === form.sermonLength)?.label}
                </Typography>
            </li>
        </Box>
    </Box>
);

export default Onboarding;
