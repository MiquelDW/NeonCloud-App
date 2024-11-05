import DropZone, { type FileRejection } from "react-dropzone";
// the useToast hook returns a toast function that you can use to display the 'Toaster' component
import { Progress } from "@/components/ui/progress";
import { Image, Loader2, MousePointerSquareDashed } from "lucide-react";
import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { useToast } from "@/hooks/use-toast";

const DropZoneComponent = ({
  handleInputChange,
  allowPdf = false,
}: {
  handleInputChange: (input: string, deleteImg?: boolean) => void;
  allowPdf?: boolean;
}) => {
  const { toast } = useToast();
  // state var that keeps track if the user drags a file over the upload section
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  // state variable that keeps track of the current upload progress
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // function that handles unvalid file drops
  // the dropped and rejected files are automatically provided by react-dropzone
  const onDropRejected = (rejectedFiles: FileRejection[]) => {
    // destructure rejected file obj from the given array 'rejectedFiles'
    const [file] = rejectedFiles;

    // user is no longer dragging an img over the dropzone if img was rejected
    setIsDragOver(false);

    // display the 'Toaster' component with an error message to the user
    toast({
      title: `${file.file.type} type is not supported`,
      description: "Please choose a PNG, JPG, or JPEG image instead",
      variant: "destructive",
    });
  };

  // function that handles valid file drops
  // the dropped and accepted files are automatically provided by react-dropzone
  const onDropAccepted = (acceptedFiles: File[]) => {
    // upload the dropped file via the end point / route "image_file_Uploader"
    startUpload(acceptedFiles, { imageName: undefined });

    // user is no longer dragging an img over the dropzone if img was accepted
    setIsDragOver(false);
  };

  // variable 'isUploading' keeps track of whether an upload has finished or not
  const { isUploading, startUpload } = useUploadThing("image_file_Uploader", {
    // callback function activates if the dropped image by the user has uploaded
    onClientUploadComplete: ([data]) => {
      // retrieve uploaded image url from destructured 'data' that you get back from the route "image_file_Uploader" after the image has been uploaded
      handleInputChange(data.serverData.url);
    },
    // function that keeps track of the current image upload progress
    onUploadProgress(p) {
      // update state var 'uploadProgress' with current retrieved upload progress
      setUploadProgress(p);
    },
  });

  return (
    <DropZone
      // call function if user drops an unvalid file
      onDropRejected={onDropRejected}
      // call function if user drops an valid file
      onDropAccepted={onDropAccepted}
      // determine which files the 'DropZone' component accepts
      accept={{
        "image/png": [".png"],
        "image/jpeg": [".jpeg"],
        "image/jpg": [".jpg"],
        ...(allowPdf && { "application/pdf": [".pdf"] }),
      }}
      // update state var if user drags a file inside or outside the 'DropZone' component
      onDragEnter={() => setIsDragOver(true)}
      onDragLeave={() => setIsDragOver(false)}
    >
      {/* destructure the functions from the 'DropZone' component to make the drop functionality work */}
      {({ getRootProps, getInputProps }) => (
        <div
          className="flex flex-col items-center justify-center rounded-lg border p-3"
          // spread in the given root properties
          {...getRootProps()}
        >
          {/* <input> element to drag images into */}
          <input
            // spread in the given input properties
            {...getInputProps()}
          />

          {/* Show icon to user */}
          {isDragOver ? (
            // user is currently dragging an file on the 'DropZone' component
            <MousePointerSquareDashed className="mb-2 h-6 w-6 text-zinc-500" />
          ) : isUploading ? (
            // show loading state if droped img is currently being uploaded
            <Loader2 className="mb-2 h-6 w-6 animate-spin text-zinc-500" />
          ) : (
            // if nothing is happening, display default image icon
            <Image className="mb-2 h-6 w-6 text-zinc-500" />
          )}

          {/* Text to user */}
          <div className="mb-2 flex flex-col justify-center text-sm text-zinc-700">
            {isUploading ? (
              // user has dropped the img and it's currently being uploaded
              <div className="flex flex-col items-center">
                <p>Uploading...</p>
                <Progress
                  className="mt-2 h-2 w-40 bg-gray-300"
                  value={uploadProgress}
                />
              </div>
            ) : isDragOver ? (
              // user is currently dragging an file on the 'DropZone' component
              <p>
                <span className="font-semibold">Drop file</span> to upload
              </p>
            ) : (
              // if nothing is happening, display default message
              <p>
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
            )}
          </div>

          {/* Inform user which file formats are valid */}
          {isUploading ? null : (
            <>
              {allowPdf ? (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG, PDF</p>
              ) : (
                <p className="text-xs text-zinc-500">PNG, JPG, JPEG</p>
              )}
            </>
          )}
        </div>
      )}
    </DropZone>
  );
};

export default DropZoneComponent;
