export const VISIBILITY = {
  PUBLIC: 'public',
  UNLISTED: 'unlisted',
  PRIVATE: 'private',
  DIRECT: 'direct',
} as const;
export type VISIBILITY = (typeof VISIBILITY)[keyof typeof VISIBILITY];

export interface Status {
  id: string;
  created_at: string;
  in_reply_to_id?: null;
  in_reply_to_account_id?: null;
  sensitive: boolean;
  spoiler_text: string;
  visibility: VISIBILITY;
  language: string;
  uri: string;
  url: string;
  replies_count: number;
  reblogs_count: number;
  favourites_count: number;
  favourited: boolean;
  reblogged: boolean;
  muted: boolean;
  bookmarked: boolean;
  content: string;
  reblog?: this | null;
  application: Application;
  account: Account;
  media_attachments?: Attachment[] | null;
  mentions?: null[] | null;
  tags?: null[] | null;
  emojis?: null[] | null;
  card: Card;
  poll?: null;
}
export interface Attachment {
  blurhash: string;
  description: string;
  id: string;
  meta: {
    original: {aspect: number; height: number; width: number; size: string};
  };
  preivew_remote_url: string | null;
  preview_url: string;
  remote_url: string | null;
  text_url: string | null;
  type: 'image' | 'video';
  url: string;
}

export interface Application {
  name: string;
  website?: null;
}
export interface FieldsEntity {
  name: string;
  value: string;
  verified_at?: string | null;
}
export interface Card {
  url: string;
  title: string;
  description: string;
  type: string;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  html: string;
  width: number;
  height: number;
  image?: null;
  embed_url: string;
}

export interface Instance {
  domain: string;
  title: string;
  version: string;
  source_url: string;
  description: string;
  usage: Usage;
  thumbnail: Thumbnail;
  languages: string[];
  configuration: Configuration;
  registrations: Registrations;
  contact: Contact;
  rules: Rule[];
}

export interface Usage {
  users: Users;
}

export interface Users {
  active_month: number;
}

export interface Thumbnail {
  url: string;
  blurhash: string;
  versions: Versions;
}

export interface Versions {
  '@1x': string;
  '@2x': string;
}

export interface Configuration {
  urls: Urls;
  accounts: Accounts;
  statuses: Statuses;
  media_attachments: MediaAttachments;
  polls: Polls;
  translation: Translation;
}

export interface Urls {
  streaming: string;
}

export interface Accounts {
  max_featured_tags: number;
}

export interface Statuses {
  max_characters: number;
  max_media_attachments: number;
  characters_reserved_per_url: number;
}

export interface MediaAttachments {
  supported_mime_types: string[];
  image_size_limit: number;
  image_matrix_limit: number;
  video_size_limit: number;
  video_frame_rate_limit: number;
  video_matrix_limit: number;
}

export interface Polls {
  max_options: number;
  max_characters_per_option: number;
  min_expiration: number;
  max_expiration: number;
}

export interface Translation {
  enabled: boolean;
}

export interface Registrations {
  enabled: boolean;
  approval_required: boolean;
  message: any;
}

export interface Contact {
  email: string;
  account: Account;
}

export interface Account {
  id: string;
  username: string;
  acct: string;
  display_name: string;
  locked: boolean;
  bot: boolean;
  discoverable: boolean;
  group: boolean;
  created_at: string;
  note: string;
  url: string;
  avatar: string;
  avatar_static: string;
  header: string;
  header_static: string;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  last_status_at: string;
  noindex: boolean;
  emojis: any[];
  fields: Field[];
}

export interface Field {
  name: string;
  value: string;
  verified_at: any;
}

export interface Rule {
  id: string;
  text: string;
}

export type CredentialAccount = Account;

export interface Context {
  ancestors: Status[];
  descendants: Status[];
}

export interface Notification {
  id: string;
  type:
    | 'mention'
    | 'status'
    | 'reblog'
    | 'follow'
    | 'follow_request'
    | 'favourite'
    | 'poll'
    | 'update'
    | 'admin.sign_up'
    | 'admin.report';
  created_at: string;
  account: Account;
  status: Status | null;
  report: Report | null;
}

export interface Report {
  id: string;
  action_taken: boolean;
  action_taken_at: string | null;
  category: 'spam' | 'violation' | 'other';
  comment: string;
  forwarded: boolean;
  created_at: string;
  status_ids: string[] | null;
  rules_id: string[];
  target_account: Account;
}

interface Tag {
  name: string;
  url: string;
  history: {
    day: string;
    users: string[];
    accounts: string[];
  }[];
  following?: boolean;
}

export interface Search {
  accounts: Account[];
  statuses: Status[];
  hashtags: Tag[];
}
