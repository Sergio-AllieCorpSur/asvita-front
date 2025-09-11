
export type PdfModalProps = {
  open: boolean;
  url?: string;        
  onClose: () => void;
};

export default function PdfModal({ open, url, onClose }: PdfModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="card w-full max-w-5xl h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between border-b p-2">
          <div className="text-sm font-medium">Vista previa PDF</div>
          <button className="btn-ghost" onClick={onClose}>Cerrar</button>
        </div>
        <iframe src={url} className="h-full w-full" />
      </div>
    </div>
  );
}
