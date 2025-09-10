import axios from "axios";
import type { Dataroom, Folder, FolderContents, FileItem, ID } from "../types";

const api = axios.create({
  baseURL: (import.meta as any).env.VITE_API_URL?.replace(/\/$/, "") || "",
});

// --- PING (opcional)
export const ping = async () => (await api.get("/api/v1/storage/ping")).data;

// --- Datarooms ---
export const listDatarooms = async (): Promise<Dataroom[]> => {
  const { data } = await api.get("/api/v1/storage/datarooms");
  return data;
};

export const createDataroom = async (name: string): Promise<Dataroom> => {
  const { data } = await api.post("/api/v1/storage/datarooms", { name });
  return data;
};

// --- Folders ---
export const createFolder = async (
  dataroomId: ID,
  name: string,
  parentId?: ID | null
): Promise<Folder> => {
  const { data } = await api.post(`/api/v1/storage/datarooms/${dataroomId}/folders`, {
    name,
    parent_id: parentId ?? null,
  });
  return data;
};

export const getFolderContents = async (
  dataroomId: ID,
  folderId: ID
): Promise<FolderContents> => {
  const { data } = await api.get(
    `/api/v1/storage/datarooms/${dataroomId}/folders/${folderId}/contents`
  );
  return data;
};

export const renameFolder = async (folderId: ID, name: string): Promise<Folder> => {
  const { data } = await api.patch(`/api/v1/storage/folders/${folderId}`, { name });
  return data;
};

export const deleteFolder = async (folderId: ID): Promise<void> => {
  await api.delete(`/api/v1/storage/folders/${folderId}`);
};

// --- Files ---
export const uploadPdf = async (
  dataroomId: ID,
  folderId: ID,
  file: File
): Promise<FileItem> => {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post(
    `/api/v1/storage/datarooms/${dataroomId}/folders/${folderId}/files`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
};

export const renameFile = async (fileId: ID, name: string): Promise<FileItem> => {
  const { data } = await api.patch(`/api/v1/storage/files/${fileId}`, { name });
  return data;
};

export const deleteFile = async (fileId: ID): Promise<void> => {
  await api.delete(`/api/v1/storage/files/${fileId}`);
};

export const fileStreamUrl = (fileId: ID) =>
  `${api.defaults.baseURL}/api/v1/storage/files/${fileId}`;
