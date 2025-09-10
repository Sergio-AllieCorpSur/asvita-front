import { useEffect, useRef, useState } from "react";

export default function InlineEdit({
  value,
  onSave,
  className = "",
  placeholder,
}: {
  value: string;
  onSave: (next: string) => void;
  className?: string;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setText(value), [value]);
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const save = () => {
    const trimmed = text.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    setEditing(false);
  };

  return editing ? (
    <input
      ref={inputRef}
      className={`input ${className}`}
      value={text}
      placeholder={placeholder}
      onChange={(e) => setText(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => (e.key === "Enter" ? save() : null)}
    />
  ) : (
    <button
      className={`text-left font-medium hover:underline ${className}`}
      onClick={() => setEditing(true)}
      title="Editar nombre"
    >
      {value}
    </button>
  );
}
