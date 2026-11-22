import PropTypes from 'prop-types';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { useFileUpload, formatBytes } from '../../daisy/hooks/use-file-upload';
import { Button } from '../../daisy/ui/button';
import { cn } from '../../daisy/lib/utils';

/** Drag & drop file area, built on the useFileUpload hook (from ReUI, MIT) (replaces react-mui-dropzone). */
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
          'dy-card dy-card-dash min-h-40 cursor-pointer items-center justify-center gap-2 p-6 text-center text-sm transition-colors hover:bg-base-200',
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
        <div className="flex size-10 items-center justify-center rounded-full border border-base-300 bg-base-100">
          <UploadIcon className="size-4 opacity-70" />
        </div>
        <p className="font-medium">{dropzoneText}</p>
        <p className="text-xs opacity-60">{fileTypes.join(', ')}</p>
      </div>
      {errors.length > 0 && (
        <div className="sq-error mt-2 text-xs text-error" role="alert">
          {errors[0]}
        </div>
      )}
      {files.length > 0 && (
        <ul className="dy-list mt-3 rounded-box border border-base-300">
          {files.map((f) => (
            <li key={f.id} className="dy-list-row items-center text-sm">
              <FileIcon className="size-4 opacity-60" />
              <span className="flex-1 truncate">{f.file.name}</span>
              <span className="text-xs opacity-60">{formatBytes(f.file.size)}</span>
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
