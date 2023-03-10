export interface Status {
  id: string;
  created_at: string;
  in_reply_to_id?: null;
  in_reply_to_account_id?: null;
  sensitive: boolean;
  spoiler_text: string;
  visibility: string;
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
  reblog?: null;
  application: Application;
  account: Account;
  media_attachments?: (null)[] | null;
  mentions?: (null)[] | null;
  tags?: (null)[] | null;
  emojis?: (null)[] | null;
  card: Card;
  poll?: null;
}
export interface Application {
  name: string;
  website?: null;
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
  emojis?: (null)[] | null;
  fields?: (FieldsEntity)[] | null;
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

