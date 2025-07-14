export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number;
  created_at: Date;
  updated_at: Date;
}

export interface LessonType {
  id: string;
  name: string;
  description: string;
  icon: string;
  available: boolean;
}

export interface LessonContent {
  id: string;
  lesson_id: string;
  type: string;
  title: string;
  audio_url?: string;
  text_content?: string;
  transcript?: string;
  duration?: number;
  order: number;
  lang_native: string;
  lang_learn: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}