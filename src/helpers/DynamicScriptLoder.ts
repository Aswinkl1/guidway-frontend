export function loadDynamicScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    // This prevents injecting duplicate <script> tags if the user clicks "Book" twice
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
