import { Lesson, LessonType, LessonContent } from '../../src/types/types';

class LessonService {
  // Simulando dados enquanto ainda não tem banco
  private lessons: Lesson[] = [
    {
      id: '1',
      title: 'Cumprimentos Básicos',
      description: 'Aprenda os cumprimentos essenciais',
      level: 'beginner',
      category: 'conversação',
      duration: 15,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '2',
      title: 'No Restaurante',
      description: 'Vocabulário e frases para restaurantes',
      level: 'intermediate',
      category: 'situações',
      duration: 20,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: '3',
      title: 'Negócios Internacionais',
      description: 'Inglês para reuniões e apresentações',
      level: 'advanced',
      category: 'profissional',
      duration: 30,
      created_at: new Date(),
      updated_at: new Date()
    }
  ];

  private lessonTypes: LessonType[] = [
    {
      id: 'podcast',
      name: 'Podcast',
      description: 'Áudio educativo com explicações',
      icon: '🎧',
      available: true
    },
    {
      id: 'dialogue',
      name: 'Diálogo',
      description: 'Conversação entre duas pessoas',
      icon: '💬',
      available: true
    },
    {
      id: 'pronunciation',
      name: 'Pronúncia',
      description: 'Exercícios de pronúncia',
      icon: '🗣️',
      available: true
    },
    {
      id: 'story',
      name: 'História',
      description: 'Narrativas em áudio',
      icon: '📚',
      available: true
    }
  ];

  private lessonContents: LessonContent[] = [
    {
      id: '1',
      lesson_id: '1',
      type: 'dialogue',
      title: 'Encontro Casual',
      audio_url: '/audio/lesson1-dialogue.mp3',
      text_content: 'Hello! How are you?',
      transcript: 'Person A: Hello! How are you?\nPerson B: I\'m fine, thank you!',
      duration: 120,
      order: 1,
      lang_native: 'pt',
      lang_learn: 'en'
    },
    {
      id: '2',
      lesson_id: '1',
      type: 'podcast',
      title: 'Explicação dos Cumprimentos',
      audio_url: '/audio/lesson1-podcast.mp3',
      text_content: 'Nesta lição, vamos aprender...',
      duration: 300,
      order: 2,
      lang_native: 'pt',
      lang_learn: 'en'
    }
  ];

  async getAllLessons(langNative: string): Promise<Lesson[]> {
    return this.lessons.map(lesson => ({
      ...lesson,
      title: this.translateTitle(lesson.title, langNative),
      description: this.translateDescription(lesson.description, langNative)
    }));
  }

  async getLessonTypes(lessonId: string, langNative: string, langLearn: string): Promise<LessonType[]> {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      throw new Error('Lição não encontrada');
    }

    return this.lessonTypes.filter(type => 
      this.isTypeAvailableForLanguages(type.id, langNative, langLearn)
    );
  }

  async getLessonContent(
    lessonId: string, 
    lessonType: string, 
    langNative: string, 
    langLearn: string
  ): Promise<LessonContent[]> {
    const lesson = this.lessons.find(l => l.id === lessonId);
    if (!lesson) {
      throw new Error('Lição não encontrada');
    }

    return this.lessonContents.filter(content => 
      content.lesson_id === lessonId &&
      content.type === lessonType &&
      content.lang_native === langNative &&
      content.lang_learn === langLearn
    ).sort((a, b) => a.order - b.order);
  }

  private translateTitle(title: string, langNative: string): string {
    const translations: { [key: string]: { [key: string]: string } } = {
      'Cumprimentos Básicos': {
        'en': 'Basic Greetings',
        'es': 'Saludos Básicos',
        'fr': 'Salutations de Base'
      }
    };
    
    return translations[title]?.[langNative] || title;
  }

  private translateDescription(description: string, langNative: string): string {
    return description;
  }

  private isTypeAvailableForLanguages(typeId: string, langNative: string, langLearn: string): boolean {
    return true;
  }
}

export default new LessonService();