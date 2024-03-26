export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      access_roles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      cast_information: {
        Row: {
          biography: string | null;
          birth_date: string | null;
          created_at: string;
          first_name: string;
          id: string;
          last_name: string;
          profile_picture: string | null;
          updated_at: string;
        };
        Insert: {
          biography?: string | null;
          birth_date?: string | null;
          created_at?: string;
          first_name: string;
          id?: string;
          last_name: string;
          profile_picture?: string | null;
          updated_at?: string;
        };
        Update: {
          biography?: string | null;
          birth_date?: string | null;
          created_at?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          profile_picture?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      certificates: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      episodes: {
        Row: {
          created_at: string;
          episode_number: number;
          id: string;
          season_number: number;
          title: string;
          tv_show_id: string | null;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          created_at?: string;
          episode_number: number;
          id?: string;
          season_number: number;
          title: string;
          tv_show_id?: string | null;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          created_at?: string;
          episode_number?: number;
          id?: string;
          season_number?: number;
          title?: string;
          tv_show_id?: string | null;
          updated_at?: string;
          video_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "episodes_tv_show_id_fkey";
            columns: ["tv_show_id"];
            isOneToOne: false;
            referencedRelation: "tv_shows";
            referencedColumns: ["id"];
          }
        ];
      };
      genres: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      languages: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          name: string;
          native_name: string;
          updated_at: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          name: string;
          native_name: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          name?: string;
          native_name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      movie_cast: {
        Row: {
          cast_id: string | null;
          created_at: string;
          id: string;
          movie_id: string | null;
          role_id: string | null;
          updated_at: string;
        };
        Insert: {
          cast_id?: string | null;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          role_id?: string | null;
          updated_at?: string;
        };
        Update: {
          cast_id?: string | null;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          role_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_cast_cast_id_fkey";
            columns: ["cast_id"];
            isOneToOne: false;
            referencedRelation: "cast_information";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_cast_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_cast_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_certificates: {
        Row: {
          certificate_id: string | null;
          created_at: string;
          id: string;
          movie_id: string | null;
          updated_at: string;
        };
        Insert: {
          certificate_id?: string | null;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          updated_at?: string;
        };
        Update: {
          certificate_id?: string | null;
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_certificates_certificate_id_fkey";
            columns: ["certificate_id"];
            isOneToOne: false;
            referencedRelation: "certificates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_certificates_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_genres: {
        Row: {
          created_at: string;
          genre_id: string | null;
          id: string;
          movie_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          genre_id?: string | null;
          id?: string;
          movie_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          genre_id?: string | null;
          id?: string;
          movie_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_genres_genre_id_fkey";
            columns: ["genre_id"];
            isOneToOne: false;
            referencedRelation: "genres";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_genres_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_languages: {
        Row: {
          created_at: string;
          id: string;
          language_id: string | null;
          movie_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          language_id?: string | null;
          movie_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          language_id?: string | null;
          movie_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_languages_language_id_fkey";
            columns: ["language_id"];
            isOneToOne: false;
            referencedRelation: "languages";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_languages_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_posters: {
        Row: {
          created_at: string;
          id: string;
          movie_id: string | null;
          type: string | null;
          updated_at: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          type?: string | null;
          updated_at?: string;
          url: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          type?: string | null;
          updated_at?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_posters_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_rentals: {
        Row: {
          created_at: string;
          id: string;
          movie_id: string | null;
          price: number;
          profile_id: string | null;
          rental_expiry_date: string | null;
          rental_start_date: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          price: number;
          profile_id?: string | null;
          rental_expiry_date?: string | null;
          rental_start_date?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          price?: number;
          profile_id?: string | null;
          rental_expiry_date?: string | null;
          rental_start_date?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_rentals_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movie_rentals_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
      movie_videos: {
        Row: {
          created_at: string;
          id: string;
          movie_id: string | null;
          type: string | null;
          updated_at: string;
          url: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          type?: string | null;
          updated_at?: string;
          url: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          type?: string | null;
          updated_at?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "movie_videos_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          }
        ];
      };
      movies: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_released: boolean | null;
          release_year: number | null;
          scheduled_release: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_released?: boolean | null;
          release_year?: number | null;
          scheduled_release?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_released?: boolean | null;
          release_year?: number | null;
          scheduled_release?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar: string | null;
          created_at: string;
          id: string;
          profile_name: string;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          avatar?: string | null;
          created_at?: string;
          id?: string;
          profile_name: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          avatar?: string | null;
          created_at?: string;
          id?: string;
          profile_name?: string;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      reviewers: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          reviewer_url: string | null;
          source: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          reviewer_url?: string | null;
          source?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          reviewer_url?: string | null;
          source?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          created_at: string;
          id: string;
          movie_id: string | null;
          rating: number | null;
          review_text: string | null;
          review_url: string | null;
          reviewer_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          rating?: number | null;
          review_text?: string | null;
          review_url?: string | null;
          reviewer_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          movie_id?: string | null;
          rating?: number | null;
          review_text?: string | null;
          review_url?: string | null;
          reviewer_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey";
            columns: ["reviewer_id"];
            isOneToOne: false;
            referencedRelation: "reviewers";
            referencedColumns: ["id"];
          }
        ];
      };
      role_permissions: {
        Row: {
          created_at: string;
          id: string;
          permission_type: string | null;
          role_id: string | null;
          table_name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          permission_type?: string | null;
          role_id?: string | null;
          table_name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          permission_type?: string | null;
          role_id?: string | null;
          table_name?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "role_permissions_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "access_roles";
            referencedColumns: ["id"];
          }
        ];
      };
      roles: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tv_shows: {
        Row: {
          created_at: string;
          description: string | null;
          genre: string | null;
          id: string;
          poster_url: string | null;
          seasons: number | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          genre?: string | null;
          id?: string;
          poster_url?: string | null;
          seasons?: number | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          genre?: string | null;
          id?: string;
          poster_url?: string | null;
          seasons?: number | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role_id: string | null;
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          role_id?: string | null;
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "access_roles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      viewing_history: {
        Row: {
          created_at: string;
          id: string;
          last_watched_timestamp: string | null;
          movie_id: string | null;
          profile_id: string | null;
          seconds_watched: number | null;
          tv_show_episode_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_watched_timestamp?: string | null;
          movie_id?: string | null;
          profile_id?: string | null;
          seconds_watched?: number | null;
          tv_show_episode_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_watched_timestamp?: string | null;
          movie_id?: string | null;
          profile_id?: string | null;
          seconds_watched?: number | null;
          tv_show_episode_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "viewing_history_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "viewing_history_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "viewing_history_tv_show_episode_id_fkey";
            columns: ["tv_show_episode_id"];
            isOneToOne: false;
            referencedRelation: "episodes";
            referencedColumns: ["id"];
          }
        ];
      };
      watchlists: {
        Row: {
          created_at: string;
          id: string;
          item_type: string | null;
          movie_id: string | null;
          profile_id: string | null;
          tv_show_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          item_type?: string | null;
          movie_id?: string | null;
          profile_id?: string | null;
          tv_show_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          item_type?: string | null;
          movie_id?: string | null;
          profile_id?: string | null;
          tv_show_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "watchlists_movie_id_fkey";
            columns: ["movie_id"];
            isOneToOne: false;
            referencedRelation: "movies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "watchlists_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "watchlists_tv_show_id_fkey";
            columns: ["tv_show_id"];
            isOneToOne: false;
            referencedRelation: "tv_shows";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null;
          avif_autodetection: boolean | null;
          created_at: string | null;
          file_size_limit: number | null;
          id: string;
          name: string;
          owner: string | null;
          owner_id: string | null;
          public: boolean | null;
          updated_at: string | null;
        };
        Insert: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id: string;
          name: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Update: {
          allowed_mime_types?: string[] | null;
          avif_autodetection?: boolean | null;
          created_at?: string | null;
          file_size_limit?: number | null;
          id?: string;
          name?: string;
          owner?: string | null;
          owner_id?: string | null;
          public?: boolean | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      migrations: {
        Row: {
          executed_at: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Insert: {
          executed_at?: string | null;
          hash: string;
          id: number;
          name: string;
        };
        Update: {
          executed_at?: string | null;
          hash?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      objects: {
        Row: {
          bucket_id: string | null;
          created_at: string | null;
          id: string;
          last_accessed_at: string | null;
          metadata: Json | null;
          name: string | null;
          owner: string | null;
          owner_id: string | null;
          path_tokens: string[] | null;
          updated_at: string | null;
          version: string | null;
        };
        Insert: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Update: {
          bucket_id?: string | null;
          created_at?: string | null;
          id?: string;
          last_accessed_at?: string | null;
          metadata?: Json | null;
          name?: string | null;
          owner?: string | null;
          owner_id?: string | null;
          path_tokens?: string[] | null;
          updated_at?: string | null;
          version?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey";
            columns: ["bucket_id"];
            isOneToOne: false;
            referencedRelation: "buckets";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string;
          name: string;
          owner: string;
          metadata: Json;
        };
        Returns: undefined;
      };
      extension: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      filename: {
        Args: {
          name: string;
        };
        Returns: string;
      };
      foldername: {
        Args: {
          name: string;
        };
        Returns: string[];
      };
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>;
        Returns: {
          size: number;
          bucket_id: string;
        }[];
      };
      search: {
        Args: {
          prefix: string;
          bucketname: string;
          limits?: number;
          levels?: number;
          offsets?: number;
          search?: string;
          sortcolumn?: string;
          sortorder?: string;
        };
        Returns: {
          name: string;
          id: string;
          updated_at: string;
          created_at: string;
          last_accessed_at: string;
          metadata: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
