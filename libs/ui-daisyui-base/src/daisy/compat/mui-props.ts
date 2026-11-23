/**
 * Maps the MUI-style props used by qubejs content (variant="contained", color="primary",
 * size="small", severity="error", ...) onto daisyUI component variants, so pages written for
 * @qubejs/ui-material-base render unchanged with @qubejs/ui-daisyui-base.
 */
export type ButtonVariant =
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'link';

export const toButtonVariant = (
  variant = 'contained',
  color = 'primary'
): ButtonVariant => {
  if (color === 'error') return variant === 'contained' ? 'destructive' : 'outline';
  if (variant === 'outlined') return 'outline';
  if (variant === 'text') return color === 'primary' ? 'link' : 'ghost';
  if (color === 'secondary' || color === 'inherit' || color === 'default') return 'secondary';
  return 'default';
};

export const toButtonSize = (size = 'medium') =>
  (({ small: 'sm', medium: 'default', large: 'lg' }) as any)[size] || 'default';

export const toIconButtonSize = (size = 'medium') =>
  (({ small: 'icon-sm', medium: 'icon', large: 'icon-lg' }) as any)[size] || 'icon';

/** MUI Alert severity -> alert variant */
export const toAlertVariant = (severity = 'info') =>
  (({
    error: 'destructive',
    success: 'success',
    warning: 'warning',
    info: 'info',
  }) as any)[severity] || 'info';
