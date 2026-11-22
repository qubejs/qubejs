import React from 'react';
import PropTypes from 'prop-types';
import { utils } from '@qubejs/web-react';

const { richText } = utils.storage;

function getText(html) {
  var divContainer = document.createElement('div');
  divContainer.innerHTML = html;
  return divContainer.textContent || divContainer.innerText || '';
}

richText.set({
  full: {
    plugins: 'code link lists table fullscreen image media',
    toolbar:
      'undo redo image media | styleselect | bold italic underline strikethrough |link superscript subscript | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | code fullscreen',
  },
  default: {
    plugins: 'lists code link table fullscreen',
    toolbar:
      'undo redo | styleselect | bold italic underline strikethrough | link superscript subscript | numlist bullist | alignleft aligncenter alignright alignjustify | outdent indent | table | code fullscreen',
  },
  compact: {
    menubar: false,
    plugins: 'lists code link fullscreen',
    toolbar:
      'undo redo | styleselect | bold italic underline strikethrough | link superscript subscript | numlist bullist | alignleft aligncenter alignright alignjustify | outdent indent | code fullscreen',
  },
  basic: {
    menubar: false,
    plugins: 'lists link fullscreen',
    toolbar:
      'bold italic underline | alignleft aligncenter alignright | numlist bullist | link fullscreen',
  },
});

class RichTextField extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      focused: false,
      hasChanged: false,
    };
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.editorRef = React.createRef();
  }

  handleOnChange(value) {
    const html = this.editor.getContent();
    const hasText = getText(html);
    this.setState({
      value: html,
      hasChanged: true,
    });
    const { onChange } = this.props;

    onChange &&
      onChange({
        value: hasText && html,
      });
  }

  componentWillUnmount() {
    this.editor && this.editor.remove();
  }

  componentDidMount() {
    const { onInit, onSetup } = this.props;
    if (this.props.value) {
      this.setState({
        value: this.props.value,
      });
    }
    if (!window.tinymce) {
      throw 'tinymce not found please load tinymce js from cdn or locally';
    }
    window.tinymce.init({
      target: this.editorRef.current,
      branding: false,
      promotion: false,
      ...(richText.get()[this.props.editorStyle] || {}),
      ...this.props.editorOptions,
      setup: (editor) => {
        this.editor = editor;
        editor.on('Change', this.handleOnChange);
        editor.setContent(this.props.value);
        editor.on('init', function (e) {
          onInit && onInit(editor);
        });
        onSetup && onSetup(editor);
        Object.keys(this.props.events || {}).forEach((eventName) => {
          editor.on(eventName, this.props.events[eventName]);
        });
      },
    });
  }
  componentDidUpdate(prevProps) {
    if (
      !this.state.focused &&
      prevProps.value !== this.props.value &&
      this.state.value !== this.props.value
    ) {
      this.setState({
        value: this.props.value,
      });
      this.editor.setContent(this.props.value || '');
    }
  }

  handleFocus() {
    this.setState({
      focused: true,
    });
  }

  handleBlur() {
    const { onBlur, onChange } = this.props;
    this.setState({
      focused: false,
    });
  }

  render() {
    const { focused } = this.state;
    const {
      label,
      className = '',
      formatter,
      value,
      error,
      errorMessage,
      ...rest
    } = this.props;

    return (
      <div
        className={`sq-richtext-field${
          focused ? ' sq-richtext-field--focused' : ''
        } ${className}`}
      >
        {label && <label htmlFor="">{label}</label>}
        <div>
          <textarea ref={this.editorRef}>{value}</textarea>
        </div>
        {!focused && error && (
          <div className="sq-textarea-field--error">{errorMessage}</div>
        )}
      </div>
    );
  }
}

RichTextField.propTypes = {
  errorMessage: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.any,
  editorStyle: PropTypes.string,
  formatter: PropTypes.object,
  onChange: PropTypes.func,
  onKeyPress: PropTypes.func,
  onBlur: PropTypes.func,
};

RichTextField.defaultProps = {
  editorStyle: 'default',
};
export default RichTextField;
