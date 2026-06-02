type MetaKind = "name" | "property";

const upsertMeta = (kind: MetaKind, key: string, content: string) => {
  const selector = `meta[${kind}="${CSS.escape(key)}"]`;
  const head = document.head;
  const existing = head.querySelector<HTMLMetaElement>(selector);
  const el = existing ?? document.createElement("meta");

  el.setAttribute(kind, key);
  el.setAttribute("content", content);

  if (!existing) {
    head.appendChild(el);
  }
};

export const setTitle = (title: string) => {
  document.title = title;
};

export const setMetaName = (name: string, content: string) => {
  upsertMeta("name", name, content);
};

export const setMetaProperty = (property: string, content: string) => {
  upsertMeta("property", property, content);
};

export const setCanonical = (absoluteUrl: string) => {
  const head = document.head;
  const existing = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const el = existing ?? document.createElement("link");

  el.setAttribute("rel", "canonical");
  el.setAttribute("href", absoluteUrl);

  if (!existing) {
    head.appendChild(el);
  }
};

export const absoluteUrlForPath = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${window.location.origin}${normalizedPath}`;
};

export const canonicalForCurrentRoute = () => {
  return `${window.location.origin}${window.location.pathname}`;
};
