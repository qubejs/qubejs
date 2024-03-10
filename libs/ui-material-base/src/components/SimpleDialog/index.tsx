import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Progress from '../Progress';
import Icon from '../Icon';


const IconSets = {
  default: '',
  error: 'erroroutline',
  warning: 'warning',
  info: 'info'
};
const TitleClasses = {
  default: 'default',
  error: 'error',
  warning: 'warning',
  info: 'info'
};

const SQSimpleDialog = ({
  fullScreen = false,
  open = false,
  isLoading = false,
  title,
  content,
  onClose,
  severity = 'default',
  actions = [],
  onAction,
}: any) => {
  const handleClose = () => {
    onClose && onClose();
  };
  const handleAction = (action) => {
    onAction && onAction(action);
  };

  return (
    <div className="sq-simple-dialog">
      <div className="sq-simple-dialog__overlay"></div>
      <div className="sq-simple-dialog__outer-container">
        <div className="sq-simple-dialog__header">
          {IconSets[severity] && (
            <span className={`sq-dialog__d-icon`}>
              <Icon size={'large'} variant={TitleClasses[severity]} name={IconSets[severity]} />
            </span>
          )}
          <h4>{title}</h4>

          <div className="sq-simple-dialog__close">{<Icon name="close" onClick={handleClose} />}</div>
        </div>
        <div className="sq-simple-dialog__content">
          <div className="sq-simple-dialog__content-body">
            {isLoading && (
              <div className="sq-simple-dialog__loader">
                <Progress />
              </div>
            )}
            {content}
          </div>
        </div>
        <div className="sq-simple-dialog__actions">
          {actions &&
            actions.map((action, idx) => {
              const { actionType, buttonText, color = 'secondary', className = '', ...rest } = action;
              return (
                <Button key={idx} onClick={() => handleAction(action)} className={className} color={color}>
                  {buttonText}
                </Button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
SQSimpleDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  type: PropTypes.string,
  content: PropTypes.any,
  actions: PropTypes.array,
  onAction: PropTypes.func,
  onClose: PropTypes.func
};
export default SQSimpleDialog;
