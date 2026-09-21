/** @format */

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import ImageIcon from "@mui/icons-material/Image";
import FileUploadIcon from "@mui/icons-material/FileUpload";

interface AdminImageNameFormProps { title: string; imageLabel: string; nameLabel: string; namePlaceholder: string; 
    onSave?: (data: { name: string; file: File | null }) => void;
}

const AdminImageNameForm = ({ title, imageLabel, nameLabel, namePlaceholder, onSave}: AdminImageNameFormProps) => {
  const nameId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");

  // يحرر الذاكرة عند تغيير الصورة أو مغادرة الصفحة
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = () => {
    onSave?.({ name: name.trim(), file });
  };

  return (
    <div className="w-full">
      <h2 className="mb-4! text-lg! font-bold! text-gray-900">{title}</h2>

      <div className="w-full rounded-2xl bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.08)]">
        <div className="mb-5 flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-700"> {imageLabel}</span>

          <button type="button" onClick={handleImageClick}
            aria-label={
              preview ? `Change ${imageLabel}` : `Upload ${imageLabel}`
            }
            className="relative flex h-[100px] w-[120px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-slate-50 transition-colors 
            hover:border-sky-400 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400/40">
            {preview ? (
              <img  src={preview} alt="Preview"
                className="h-full w-full rounded-xl object-contain p-2"
              />
            ) : (
              <>
                <ImageIcon sx={{ fontSize: 28 }} className="text-gray-400" />
                <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-500">
                  <FileUploadIcon sx={{ fontSize: 14 }}  className="animate-pulse-scale text-white"/>
                </span>
              </>
            )}
          </button>

          <input ref={fileInputRef} type="file"  accept="image/*" onChange={handleFileChange} className="hidden"/>
        </div>

        <div className="mb-6 flex flex-col gap-2">
          <label htmlFor={nameId} className="text-sm font-medium text-gray-700"> {nameLabel}</label>
          <input id={nameId} type="text" placeholder={namePlaceholder} value={name} onChange={(e) => setName(e.target.value)}
            className="h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-400 
            focus:outline-none focus:ring-2 focus:ring-sky-400/40"/>
        </div>

        <div className="flex justify-end">
          <button type="button" onClick={handleSave} disabled={!name.trim()}
            className="h-10 rounded-lg bg-sky-500 px-6 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed 
            disabled:opacity-50 disabled:hover:bg-sky-500"> Save changes
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminImageNameForm;
