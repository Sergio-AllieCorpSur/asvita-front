import { useRef, useState, useEffect } from "react";
import axios from "axios";

type Props = {
  dataroomId: string;
  folderId: string;
  baseStorageUrl: string;
  onUploaded: () => void;
};

export default function DropZoneUpload({ dataroomId, folderId, baseStorageUrl, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(null), 3000);
    return () => clearTimeout(t);
  }, [success]);

  const uploadFiles = async (files: FileList | File[]) => {
    setError(null);
    if (!files || (Array.isArray(files) && files.length === 0)) return;

    const file = Array.isArray(files) ? files[0] : files[0];

    const form = new FormData();
    form.append("file", file);
    form.append("name", file.name);

    const url = new URL(
      `datarooms/${dataroomId}/folders/${folderId}/files`,
      baseStorageUrl + "/"
    ).toString();

    try {
      setProgress(0);
      await axios.post(url, form, {
        onUploadProgress: (e) => {
          if (!e.total) return;
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setProgress(null);
      setSuccess(`"${file.name}" uploaded successfully ✅`); 
      onUploaded(); 

      
      if (inputRef.current) inputRef.current.value = "";
    } catch (e: any) {
      setProgress(null);
      setError(e?.response ? `HTTP ${e.response.status}` : e?.message || "Upload error");
    }
  };

  const onDrop = (ev: React.DragEvent) => {
    ev.preventDefault();
    ev.stopPropagation();
    setDragOver(false);
    if (ev.dataTransfer.files && ev.dataTransfer.files.length > 0) {
      uploadFiles(ev.dataTransfer.files);
      ev.dataTransfer.clearData();
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={[
        "mt-2 rounded border border-dashed p-3 text-xs",
        dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-gray-50"
      ].join(" ")}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      title="Haz clic o suelta un archivo aquí"
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="application/pdf,*/*"
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
      />
      <div className="flex items-center justify-between">
        <span>Drag and drop a file here, or click to select.</span>
        {progress !== null && <span>{progress}%</span>}
      </div>

      
      {success && (
        <div className="mt-2 text-green-600" role="status" aria-live="polite">
          {success}
        </div>
      )}
      {error && <div className="mt-2 text-red-600">{error}</div>}
    </div>
  );
}
