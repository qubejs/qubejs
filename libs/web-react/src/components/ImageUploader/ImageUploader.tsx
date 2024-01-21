import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FileUploader } from 'react-drag-drop-files';
import Button from '../Button';
import Tooltip from '@mui/material/Tooltip';
import Icon from '../Icon';
import IconButton from '../IconButton';
import Alert from '../Alert';
import Progress from '../Progress';
import './image-uploader.scss';

const SQFileUploader = ({
  className = '',
  disabled,
  fileTypes = ['JPG', 'PNG', 'GIF', 'PDF', 'JPEG', 'DOC', 'DOCX', 'PPT', 'PPTX', 'RTF'],
  multiple = false,
  clearAll = false,
  onAction,
  errorMessage,
  label,
  uploadButtonText = 'Upload',
  clearButtonText = 'Clear',
  uploadOnChange = false,
  pathField = 'url',
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
  const [sucessCalled, setSuccessCalled] = useState(false);
  const [progress, setProgress] = useState(false);
  const [failedCalled, setFailedCalled] = useState(false);
  const handleChange = async (filenew) => {
    const takeOne = multiple ? filenew : [filenew];
    const listToBeAdded: any[] = [].filter.call(takeOne, (i:any) => file.filter((d:any) => d.name === i.name).length === 0);
    if (listToBeAdded.length > 0) {
      const newFiles = [...(multiple ? file : []), ...listToBeAdded];
      await setFile(newFiles);
      uploadOnChange && handleAction({ files: newFiles });
    }
  };
  const handleDelete = (filenew) => {
    const idx = file.indexOf(filenew);
    file.splice(idx, 1);
    setFile([...file]);
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
          },
        }
      );
    setFile([]);
  };
  const handleClear = () => {
    setFile([]);
  };
  const removeImage = () => {
    onChange &&
      onChange({
        value: null,
        checkForAction: false,
      });
  };
  return (
    <div className={`sq-image-uploader ${className}`}>
      {label && <label className="sq-image-uploader__label">{label}</label>}
      <div className="sq-image-uploader__container">
        {value && value[pathField] && (
          <div className="sq-image-uploader__image-preview">
            <img src={value[pathField]} />
            <IconButton
              title={'Remove'}
              className="sq-image-uploader__image-preview-close"
              iconName={'close'}
              onClick={removeImage}
            />
          </div>
        )}
        <div className="sq-image-uploader__image-placeholder">
          <Tooltip title={fileTypes.join(', ').toLowerCase()}>
            <span>
              <FileUploader
                disabled={disabled}
                multiple={multiple}
                fileOrFiles={file.length ? null : file}
                className="sq-image-uploader__file"
                handleChange={handleChange}
                name="file"
                types={fileTypes}
              />
            </span>
          </Tooltip>
        </div>

        {enableLoader && progress && (
          <Progress
            className="tp-progress--active"
            style="default"
          />
        )}
        {file && (
          <div className="sq-image-uploader__list">
            {file.map((file) => {
              return (
                <div
                  key={file.name}
                  title={file.name}
                  className="sq-image-uploader__file-item"
                >
                  <div className="sq-image-uploader__file-icon">
                    <Icon
                      name="file"
                      size="small"
                    />
                  </div>
                  <div className="sq-image-uploader__file-name">{file.name}</div>
                  <div
                    className="sq-image-uploader__file-delete"
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
      </div>

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
