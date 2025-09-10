export type ID = string;

export interface Dataroom {
  id: ID;
  name: string;
  created_at?: string;
}

export interface Folder {
  id: ID;
  name: string;
  dataroom_id: ID;
  parent_id?: ID | null;
}

export interface FileItem {
  id: ID;
  name: string;
  size?: number;
  mime_type?: string; // "application/pdf"
  folder_id: ID;
  dataroom_id: ID;
}

export interface FolderContents {
  folders: Folder[];
  files: FileItem[];
}
