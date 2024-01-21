import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';
import { FileUploader } from 'react-drag-drop-files';
import Button from '../Button';
import Icon from '../Icon';
import Alert from '../Alert';
import Progress from '../Progress';
import Input from '../Input';

const SQFileUploader = ({
  className = '',
  disabled,
  fileTypes = ['JPG', 'PNG', 'GIF', 'PDF', 'JPEG', 'DOC', 'DOCX', 'PPT', 'PPTX', 'RTF'],
  multiple = true,
  clearAll = false,
  onAction,
  errorMessage,
  label,
  uploadButtonText = 'Upload',
  clearButtonText = 'Clear',
  uploadOnChange = false,
  allowRename = true,
  onChange,
  uploadSuccessMessage,
  uploadFailedMessage,
  successMessageType = 'info',
  enableLoader = false,
  errorMessageType = 'warning',
  value,
  ...rest
}: any) => {
  const [file, setFile] = useState([]);
  const [fileNames, setFileNames] = useState([]);
  const [sucessCalled, setSuccessCalled] = useState(false);
  const [progress, setProgress] = useState(false);
  const [failedCalled, setFailedCalled] = useState(false);
  const handleChange = async (filenew) => {
    const takeOne = multiple ? filenew : [filenew];
    const listToBeAdded: any[] = [].filter.call(takeOne, (i:any) => file.filter((d) => d.name === i.name).length === 0);
    if (listToBeAdded.length > 0) {
      const newFiles = [...(multiple ? file : []), ...listToBeAdded];
      await setFile(newFiles);
      const newFileNames = [
        ...fileNames,
        ...listToBeAdded.map((i) => ({
          name: i.name,
        })),
      ];
      await setFileNames(newFileNames);
      uploadOnChange && handleAction({ files: newFiles });
    }
  };
  const handleDelete = (filenew) => {
    const idx = file.indexOf(filenew);
    file.splice(idx, 1);
    fileNames.splice(idx, 1);
    setFile([...file]);
    setFileNames([...fileNames]);
  };

  const success = (data) => {
    onChange &&
      onChange({
        value: data,
        checkForAction: false,
      });
    setSuccessCalled(true);
    setProgress(false);
    setFailedCalled(false);
  };
  const failed = () => {
    onChange &&
      onChange({
        value: null,
        checkForAction: false,
      });
    setSuccessCalled(false);
    setFailedCalled(true);
    setProgress(false);
  };

  const handleFileChange = (data, file, idx) => {
    const newFileNames = [...fileNames];
    newFileNames[idx] = { name: data.value };
    setFileNames(newFileNames);
  };

  const handleAction = (obj) => {
    setProgress(true);
    onAction &&
      onAction(
        {},
        {
          ...rest,
          success,
          failed,
          data: {
            files: (obj && obj.files) || file,
            fileNames,
          },
        }
      );
    setFile([]);
  };
  const handleClear = () => {
    setFile([]);
  };

  return (
    <div className={`sq-file-uploader ${className}`}>
      {label && <label className="sq-file-uploader__label">{label}</label>}
      {
        <Tooltip title={fileTypes.join(', ').toLowerCase()}>
          <span>
            <FileUploader
              disabled={disabled}
              multiple={multiple}
              fileOrFiles={file.length ? null : file}
              className="sq-file-uploader__file"
              handleChange={handleChange}
              name="file"
              types={fileTypes}
            />
          </span>
        </Tooltip>
      }
      {enableLoader && progress && (
        <Progress
          className="tp-progress--active"
          style="default"
        />
      )}
      {file && (
        <div className="sq-file-uploader__list">
          {file.map((file, idx) => {
            return (
              <div
                key={file.name}
                title={file.name}
                className="sq-file-uploader__file-item"
              >
                <div className="sq-file-uploader__file-icon">
                  <Icon
                    name="file"
                    size="small"
                  />
                </div>
                <div className="sq-file-uploader__file-name pt-2">
                  {allowRename && <Input
                    helperText={file.name}
                    label="Name"
                    type="text"
                    value={fileNames[idx]?.name}
                    onKeyPress={(data) => handleFileChange(data, file, idx)}
                  />}
                  {!allowRename && file.name}
                </div>
                <div
                  className="sq-file-uploader__file-delete"
                  onClick={() => handleDelete(file)}
                >
                  <Icon
                    name="close"
                    size="small"
                    variant="error"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
      {errorMessage && <div className="sq-error">{errorMessage}</div>}
      {!uploadOnChange && (
        <Button
          disabled={file.length === 0}
          variant="outlined"
          onClick={handleAction}
          buttonText={uploadButtonText}
        />
      )}
      {clearAll && (
        <Button
          disabled={file.length === 0}
          variant="outlined"
          onClick={handleClear}
          buttonText={clearButtonText}
        />
      )}
      {uploadSuccessMessage && !progress && sucessCalled && (
        <Alert
          type={successMessageType}
          message={uploadSuccessMessage}
        />
      )}
      {uploadFailedMessage && !progress && failedCalled && (
        <Alert
          type={errorMessageType}
          message={uploadFailedMessage}
        />
      )}
    </div>
  );
};
SQFileUploader.propTypes = {
  className: PropTypes.string,
  uploadButtonText: PropTypes.string,
  clearButtonText: PropTypes.string,
  errorMessage: PropTypes.string,
  onChange: PropTypes.func,
  actionOnSelect: PropTypes.bool,
  clearAll: PropTypes.bool,
};

export default SQFileUploader;