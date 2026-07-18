export interface Project {
  id: string
  title: string
  slug: string
  description: string | null
  image_url: string | null
  tags: string[]
  project_url: string | null
  github_url: string | null
  created_at: string
  updated_at: string
  in_development?: boolean
  development_status?: 'active' | 'paused'
  development_progress?: number
  is_completed?: boolean
  is_archived?: boolean
  is_featured?: boolean
  changelog?: ChangelogEntry[]
}

export interface Admin {
  id: string
  email: string
  created_at: string
}

export interface ChangelogEntry {
  id: string
  version: string
  date: string
  changes: string[]
}
