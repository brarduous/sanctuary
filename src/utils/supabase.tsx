import { supabase } from "@/lib/supabaseClient";

export async function getProfile(){
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data;
}
export async function getSermons() {
  const { data, error } = await supabase
    .from("sermons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sermons:", error);
    return null;
  }

  return data;
}
export async function getSermonById(id: string) {
    const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .eq("sermon_id", id)
        .single();
    
    if (error) {
        console.error("Error fetching sermon by ID:", error);
        return null;
    }
    
    return data;
}   
export async function saveSermon(sermon: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated");
        return null;
    }   

  const { data, error } = await supabase
    .from("sermons")
    .insert([sermon])
    .select("*");

  if (error) {
    console.error("Error saving sermon:", error);
    return null;
  }

  return data;
}

export async function getBibleStudies(){
    const { data, error } = await supabase
        .from("bible_studies")
        .select("*")
        .order("created_at", { ascending: false });
    
    if (error) {
        console.error("Error fetching bible studies:", error);
        return null;
    }
    
    return data;
}
export async function getBibleStudyById(id: string) {
    const { data, error } = await supabase
        .from("bible_studies")
        .select("*")
        .eq("study_id", id)
        .single();
    
    if (error) {
        console.error("Error fetching bible study by ID:", error);
        return null;
    }
    
    return data;
}
export async function getBibleStudyLessons(studyId: string) {

    const { data, error } = await supabase
        .from("bible_study_lessons")
        .select("*")
        .eq("study_id", studyId)
        .order("lesson_number", { ascending: true });
    
    if (error) {
        console.error("Error fetching bible study lessons:", error);
        return null;
    }
    
    return data;
}
export async function saveBibleStudy(bibleStudy: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated");
        return null;
    }   

  const { data, error } = await supabase
    .from("bible_studies")
    .insert([bibleStudy])
    .select("*");

  if (error) {
    console.error("Error saving bible study:", error);
    return null;
  }

  return data[0];
}

export async function saveBibleStudyLesson(bibleStudyLesson: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        console.error("User not authenticated");
        return null;
    }   

  const { data, error } = await supabase
    .from("bible_study_lessons")
    .insert([bibleStudyLesson])
    .select("*");

  if (error) {
    console.error("Error saving bible study lesson:", error);
    return null;
  }

  return data;
}
