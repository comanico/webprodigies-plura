import { FileIcon, X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { UploadDropzone } from "@/lib/uploadthing";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded image"
              className="object-contain"
              fill
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener_noreferrer"
              className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
        <Button onClick={() => onChange("")} variant="ghost" type="button">
          <X className="h-4 w-4" /> Remove Logo
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url);
        }}
        onUploadError={(error: Error) => {
          console.log(error);
        }}
        appearance={{
          button: "hidden", // This removes the "Upload X files" button completely
          allowedContent: "hidden", // Optional: hide the file type hint too
        }}
        config={{
          mode: "auto", // This is the magic → uploads immediately on drop/select
        }}
        className="border-2 border-dashed border-primary/30 bg-card/50 
             hover:border-primary/50 hover:bg-card/80 
             rounded-2xl transition-all duration-300 
             ut-label:text-foreground/80 
             ut-allowed-content:text-muted-foreground text-sm"
      />
    </div>
  );
};

export default FileUpload;
