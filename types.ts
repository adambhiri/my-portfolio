
export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  live_link?: string;
  github_link?: string;
  created_at?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  photo_url: string;
  email: string;
  location: string;
  resume_url?: string;
  github_url?: string;
  linkedin_url?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'automation' | 'bi' | 'dev';
  icon?: string;
}
