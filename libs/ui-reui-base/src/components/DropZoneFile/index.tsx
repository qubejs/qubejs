import PropTypes from 'prop-types';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { useFileUpload, formatBytes } from '../../reui/hooks/use-file-upload';
import { Button } from '../../reui/ui/button';
import { cn } from '../../reui/lib/utils';

/** Drag & drop file area, built on ReUI's useFileUpload hook (replaces react-mui-dropzone). */
const DropZoneFile = ({
  className = '',
  fileTypes = ['JPG', 'PNG', 'GIF', 'PDF', 'JPEG', 'DOC', 'DOCX', 'PPT', 'PPTX', 'RTF'],
  multiple = true,
  onAction,
  onChange,
  uploadButtonText = 'Upload',
  dropzoneText = 'Drag and drop a file here or click',
  ...rest
}: any) => {
  const accept = fileTypes.map((t) => `.${String(t).toLowerCase()}`).join(',');
  const [{ files, isDragging, errors }, actions] = useFileUpload({
    multiple,
    accept,
    onFilesChange: (list) => onChange && onChange({ value: list.map((f) => f.file) }),
  });

  return (
    <div className={`sq-drop-zone-file ${className}`}>
      <div
        role="button"
        tabIndex={0}
        data-dragging={isDragging || undefined}
        className={cn(
          'flex min-h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-input p-6 text-center text-sm transition-colors hover:bg-muted/50',
          isDragging && 'border-primary bg-primary/5'
        )}
        onClick={actions.openFileDialog}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && actions.openFileDialog()}
        onDragEnter={actions.handleDragEnter}
        onDragLeave={actions.handleDragLeave}
        onDragOver={actions.handleDragOver}
        onDrop={actions.handleDrop}
      >
        <input {...actions.getInputProps()} className="sr-only" aria-label="Upload files" />
        <div className="flex size-10 items-center justify-center rounded-full border bg-background">
          <UploadIcon className="size-4 opacity-70" />
        </div>
        <p className="font-medium">{dropzoneText}</p>
        <p className="text-xs text-muted-foreground">{fileTypes.join(', ')}</p>
      </div>
      {errors.length > 0 && (
        <div className="sq-error mt-2 text-xs text-destructive" role="alert">
          {errors[0]}
        </div>
      )}
      {files.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-2 rounded-lg border p-2 text-sm">
              <FileIcon className="size-4 opacity-60" />
              <span className="flex-1 truncate">{f.file.name}</span>
              <span className="text-xs text-muted-foreground">{formatBytes(f.file.size)}</span>
              <Button variant="ghost" size="icon-xs" aria-label={`Remove ${f.file.name}`} onClick={() => actions.removeFile(f.id)}>
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
DropZoneFile.propTypes = {
  className: PropTypes.string,
};

export default DropZoneFile;
