export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_playlist_tracks: {
        Row: {
          added_at: string | null
          ai_playlist_id: string
          episode_id: string | null
          id: string
          position: number
          track_id: string | null
        }
        Insert: {
          added_at?: string | null
          ai_playlist_id: string
          episode_id?: string | null
          id?: string
          position: number
          track_id?: string | null
        }
        Update: {
          added_at?: string | null
          ai_playlist_id?: string
          episode_id?: string | null
          id?: string
          position?: number
          track_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_playlist_tracks_ai_playlist_id_fkey"
            columns: ["ai_playlist_id"]
            isOneToOne: false
            referencedRelation: "ai_playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_playlist_tracks_episode_id_fkey"
            columns: ["episode_id"]
            isOneToOne: false
            referencedRelation: "episodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_playlists: {
        Row: {
          cover_art_url: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          last_updated: string | null
          playlist_type: string
          title: string
          user_id: string
        }
        Insert: {
          cover_art_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          playlist_type: string
          title: string
          user_id: string
        }
        Update: {
          cover_art_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_updated?: string | null
          playlist_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      albums: {
        Row: {
          artist_id: string
          cover_art_url: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          release_date: string | null
          release_type: string
          title: string
          total_duration: number | null
          total_tracks: number | null
          updated_at: string
        }
        Insert: {
          artist_id: string
          cover_art_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          release_date?: string | null
          release_type: string
          title: string
          total_duration?: number | null
          total_tracks?: number | null
          updated_at?: string
        }
        Update: {
          artist_id?: string
          cover_art_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          release_date?: string | null
          release_type?: string
          title?: string
          total_duration?: number | null
          total_tracks?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          created_at: string | null
          genre: string[] | null
          id: string
          monthly_listeners: number | null
          social_links: Json | null
          stage_name: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          genre?: string[] | null
          id: string
          monthly_listeners?: number | null
          social_links?: Json | null
          stage_name: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          genre?: string[] | null
          id?: string
          monthly_listeners?: number | null
          social_links?: Json | null
          stage_name?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_flagged: boolean | null
          parent_id: string | null
          track_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          parent_id?: string | null
          track_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_flagged?: boolean | null
          parent_id?: string | null
          track_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      episodes: {
        Row: {
          audio_url: string
          created_at: string
          description: string | null
          duration: number | null
          episode_number: number | null
          id: string
          is_published: boolean | null
          like_count: number | null
          play_count: number | null
          podcast_id: string
          published_at: string | null
          season_number: number | null
          title: string
        }
        Insert: {
          audio_url: string
          created_at?: string
          description?: string | null
          duration?: number | null
          episode_number?: number | null
          id?: string
          is_published?: boolean | null
          like_count?: number | null
          play_count?: number | null
          podcast_id: string
          published_at?: string | null
          season_number?: number | null
          title: string
        }
        Update: {
          audio_url?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          episode_number?: number | null
          id?: string
          is_published?: boolean | null
          like_count?: number | null
          play_count?: number | null
          podcast_id?: string
          published_at?: string | null
          season_number?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "episodes_podcast_id_fkey"
            columns: ["podcast_id"]
            isOneToOne: false
            referencedRelation: "podcasts"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          track_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          track_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "likes_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      play_history: {
        Row: {
          completed: boolean | null
          id: string
          play_duration: number | null
          played_at: string | null
          track_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          id?: string
          play_duration?: number | null
          played_at?: string | null
          track_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          id?: string
          play_duration?: number | null
          played_at?: string | null
          track_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "play_history_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_tracks: {
        Row: {
          added_at: string | null
          id: string
          playlist_id: string
          position: number
          track_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          playlist_id: string
          position: number
          track_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          playlist_id?: string
          position?: number
          track_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_tracks_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_tracks_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          cover_art_url: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cover_art_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cover_art_url?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      podcasts: {
        Row: {
          category: string | null
          cover_art_url: string | null
          created_at: string
          creator_id: string
          description: string | null
          host_name: string | null
          id: string
          is_active: boolean | null
          language: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          cover_art_url?: string | null
          created_at?: string
          creator_id: string
          description?: string | null
          host_name?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          cover_art_url?: string | null
          created_at?: string
          creator_id?: string
          description?: string | null
          host_name?: string | null
          id?: string
          is_active?: boolean | null
          language?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_artist: boolean | null
          is_verified: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_artist?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_artist?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      tracks: {
        Row: {
          album_id: string | null
          artist_id: string
          audio_url: string
          comment_count: number | null
          cover_art_url: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          genre: string | null
          id: string
          is_public: boolean | null
          like_count: number | null
          play_count: number | null
          release_date: string | null
          release_type: string | null
          title: string
          track_number: number | null
          updated_at: string | null
        }
        Insert: {
          album_id?: string | null
          artist_id: string
          audio_url: string
          comment_count?: number | null
          cover_art_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          genre?: string | null
          id?: string
          is_public?: boolean | null
          like_count?: number | null
          play_count?: number | null
          release_date?: string | null
          release_type?: string | null
          title: string
          track_number?: number | null
          updated_at?: string | null
        }
        Update: {
          album_id?: string | null
          artist_id?: string
          audio_url?: string
          comment_count?: number | null
          cover_art_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          genre?: string | null
          id?: string
          is_public?: boolean | null
          like_count?: number | null
          play_count?: number | null
          release_date?: string | null
          release_type?: string | null
          title?: string
          track_number?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracks_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "albums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracks_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          discovery_level: string | null
          id: string
          include_podcasts: boolean | null
          language_preference: string | null
          preferred_artists: string[] | null
          preferred_genres: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discovery_level?: string | null
          id?: string
          include_podcasts?: boolean | null
          language_preference?: string | null
          preferred_artists?: string[] | null
          preferred_genres?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discovery_level?: string | null
          id?: string
          include_podcasts?: boolean | null
          language_preference?: string | null
          preferred_artists?: string[] | null
          preferred_genres?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
