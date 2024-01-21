import { useState } from 'react';
import PropTypes from 'prop-types';
import { DropzoneArea } from 'react-mui-dropzone';


const DropZoneFile = ({
  className = '',
  fileTypes = [
    'JPG',
    'PNG',
    'GIF',
    'PDF',
    'JPEG',
    'DOC',
    'DOCX',
    'PPT',
    'PPTX',
    'RTF',
  ],
  multiple = true,
  onAction,
  uploadButtonText = 'Upload',
  ...rest
}:any) => {
  const [file, setFile] = useState([]);
  const handleChange = (filenew) => {
    setFile(filenew);
  };

  return (
    <div className={`sq-drop-zone-file ${className}`}>
      <DropzoneArea onChange={handleChange} />
    </div>
  );
};
DropZoneFile.propTypes = {
  className: PropTypes.string,
};

export default DropZoneFile;
