/**
 * qubejs forms pass their whole context (userData, onAction, pageState, ...) down to
 * field components. MUI swallowed unknown props; ReUI primitives forward everything to the
 * DOM, so field components keep only real DOM attributes.
 */
const DOM_ATTRS = new Set([
  'id', 'name', 'type', 'value', 'defaultValue', 'placeholder', 'disabled', 'readOnly',
  'required', 'autoComplete', 'autoFocus', 'min', 'max', 'step', 'minLength', 'maxLength',
  'pattern', 'inputMode', 'multiple', 'accept', 'rows', 'cols', 'wrap', 'spellCheck',
  'tabIndex', 'title', 'role', 'className', 'style', 'form', 'list', 'size', 'enterKeyHint',
  'autoCapitalize', 'autoCorrect', 'dir', 'lang', 'hidden',
]);
const DOM_EVENTS = new Set([
  'onChange', 'onInput', 'onBlur', 'onFocus', 'onKeyDown', 'onKeyUp', 'onKeyPress',
  'onClick', 'onDoubleClick', 'onMouseDown', 'onMouseUp', 'onMouseEnter', 'onMouseLeave',
  'onPaste', 'onCopy', 'onCut', 'onSelect', 'onInvalid', 'onPointerDown', 'onPointerUp',
  'onTouchStart', 'onTouchEnd', 'onCompositionStart', 'onCompositionEnd', 'onWheel',
]);

export function pickDomProps<T extends Record<string, any>>(props: T): Partial<T> {
  const out: Record<string, any> = {};
  Object.keys(props).forEach((key) => {
    if (DOM_ATTRS.has(key) || DOM_EVENTS.has(key) || /^(aria|data)-/.test(key)) {
      out[key] = props[key];
    }
  });
  return out as Partial<T>;
}
