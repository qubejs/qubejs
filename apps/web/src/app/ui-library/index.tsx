/**
 * UI libraries the sample app can render with. Pick one with `?ui=reui` / `?ui=daisyui` / `?ui=material`
 * (remembered in localStorage) or with the floating switcher. Only the selected library
 * (and its styles) is loaded.
 */
export const UI_LIBRARIES = {
  material: {
    label: 'Material UI',
    load: async () => {
      const [plugin, { default: GitHub }] = await Promise.all([
        import('@qubejs/ui-material-base'),
        import('@mui/icons-material/GitHub'),
      ]);
      return { ...plugin, icons: { GitHub } };
    },
  },
  daisyui: {
    label: 'daisyUI',
    load: async () => {
      const [plugin] = await Promise.all([
        import('@qubejs/ui-daisyui-base'),
        import('@qubejs/ui-daisyui-base/styles.css'),
      ]);
      return plugin;
    },
  },
  reui: {
    label: 'ReUI',
    load: async () => {
      const [plugin] = await Promise.all([
        import('@qubejs/ui-reui-base'),
        import('@qubejs/ui-reui-base/styles.css'),
      ]);
      return plugin;
    },
  },
};
export type UiLibraryName = keyof typeof UI_LIBRARIES;

const STORAGE_KEY = 'qubejs-ui-library';
const DEFAULT_LIBRARY: UiLibraryName = 'material';

const isLibrary = (name: any): name is UiLibraryName =>
  Object.prototype.hasOwnProperty.call(UI_LIBRARIES, name);

export function getUiLibrary(): UiLibraryName {
  const fromQuery = new URLSearchParams(window.location.search).get('ui');
  if (isLibrary(fromQuery)) {
    try {
      localStorage.setItem(STORAGE_KEY, fromQuery);
    } catch (e) {
      /* storage unavailable */
    }
    return fromQuery;
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isLibrary(saved)) return saved;
  } catch (e) {
    /* storage unavailable */
  }
  return DEFAULT_LIBRARY;
}

/** Loads the selected UI library (with its styles) and returns its plugin. */
export async function loadUiLibrary(name: UiLibraryName) {
  document.documentElement.dataset.uiLibrary = name;
  return UI_LIBRARIES[name].load();
}

export function switchUiLibrary(name: UiLibraryName) {
  const url = new URL(window.location.href);
  url.searchParams.set('ui', name);
  window.location.assign(url.toString());
}

/** Small fixed switcher, styled inline so it looks the same under either library. */
export function UiLibrarySwitcher({ current }: { current: UiLibraryName }) {
  return (
    <div
      role="group"
      aria-label="UI library"
      data-testid="ui-library-switcher"
      style={{
        position: 'fixed',
        left: 16,
        bottom: 16,
        zIndex: 2000,
        display: 'flex',
        gap: 4,
        padding: 4,
        borderRadius: 999,
        background: 'rgba(17,17,17,0.85)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        font: '12px/1 system-ui, sans-serif',
      }}
    >
      {(Object.keys(UI_LIBRARIES) as UiLibraryName[]).map((name) => {
        const active = name === current;
        return (
          <button
            key={name}
            type="button"
            aria-pressed={active}
            onClick={() => !active && switchUiLibrary(name)}
            style={{
              border: 0,
              borderRadius: 999,
              padding: '8px 12px',
              cursor: active ? 'default' : 'pointer',
              color: active ? '#111' : '#eee',
              background: active ? '#fff' : 'transparent',
              fontWeight: 600,
            }}
          >
            {UI_LIBRARIES[name].label}
          </button>
        );
      })}
    </div>
  );
}
