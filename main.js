const { Plugin, TFile, MarkdownRenderer } = require("obsidian");


module.exports = class SidebarHeadingPreview extends Plugin {
  tooltipEl = null;
  timeoutId = null;

  async onload() {
    console.log("Sidebar Heading Preview loaded");
    this.injectStyles();
    this.registerDomEvent(document, "mousemove", (evt) => this.onMouseMove(evt));
  }

  onunload() {
    this.removeTooltip();
  }

  injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
  .sidebar-heading-preview-tooltip {
    position: fixed;
    z-index: 9999;
    background-color: var(--background-secondary, #2a2a2a);
    color: var(--text-normal, #eeeeee);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 12px; /* Smaller font size */
    line-height: 1.3;
    max-width: 280px;
    max-height: 300px;
    overflow-y: auto;
    pointer-events:auto;
    white-space: normal;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    border: 1px solid var(--background-modifier-border, #444);
    font-family: var(--font-ui, "Inter", sans-serif);
  }

  .sidebar-heading-preview-tooltip h1, 
  .sidebar-heading-preview-tooltip h2,
  .sidebar-heading-preview-tooltip h3,
  .sidebar-heading-preview-tooltip h4,
  .sidebar-heading-preview-tooltip h5,
  .sidebar-heading-preview-tooltip h6 {
    font-size: 1em !important; /* Prevent oversized headings */
    margin: 0;
    padding: 0;
  }

  .sidebar-heading-preview-tooltip ul {
    list-style-type: disc;
    padding-left: 1.2em;
    margin-top: 6px;
    margin-bottom: 0;
  }

  .sidebar-heading-preview-tooltip li {
    margin-bottom: 4px;
    line-height: 1.4;
    color: lightgreen;
    font-style: italic;

  }

  .sidebar-heading-preview-tooltip strong {
    display: block;
    margin-bottom: 4px;
    font-weight: 600;
  }
`;

  document.head.appendChild(style);
}

  async onMouseMove(evt) {
    const target = evt.target;
    const fileEl = target?.closest(".nav-file-title");

// ✅ If hovering over the tooltip, do nothing (let it stay visible)
if (!fileEl && !target?.closest(".sidebar-heading-preview-tooltip")) {
  this.removeTooltip();
  return;
}


    const path = fileEl.getAttribute("data-path");
    if (!path) {
      this.removeTooltip();
      return;
    }

    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.timeoutId = window.setTimeout(async () => {
      await this.showTooltip(fileEl, path);
    }, 300);
  }

 async showTooltip(el, path) {
  const file = this.app.vault.getAbstractFileByPath(path);
  if (!(file instanceof TFile)) {
    this.removeTooltip();
    return;
  }

  const content = await this.app.vault.read(file);
  const headings = content
    .split("\n")
    .filter(line => line.startsWith("# "))
    .map(line => line.replace(/^# /, "").trim());

  if (!headings.length) {
    this.removeTooltip();
    return;
  }

  // Create tooltip container
  if (!this.tooltipEl) {
    this.tooltipEl = document.createElement("div");
    this.tooltipEl.className = "sidebar-heading-preview-tooltip";
    document.body.appendChild(this.tooltipEl);
  } else {
    this.tooltipEl.innerHTML = "";
  }

  // Add a title
  const title = document.createElement("div");
  title.innerHTML = "<strong>Headings:</strong>";
  this.tooltipEl.appendChild(title);

  // Create the bullet list
  const ul = document.createElement("ul");
  ul.style.marginTop = "6px";
  ul.style.paddingLeft = "18px";
  ul.style.marginBottom = "0";

  for (const heading of headings) {
    const li = document.createElement("li");
    li.style.marginBottom = "4px";
    
    // Render markdown into the <li> (e.g., *italic* or **bold**)
    await MarkdownRenderer.renderMarkdown(
      heading,
      li,
      path,
      this.app.workspace.activeLeaf
    );

    ul.appendChild(li);
  }

  this.tooltipEl.appendChild(ul);

  const rect = el.getBoundingClientRect();
  Object.assign(this.tooltipEl.style, {
    top: `${rect.bottom + 5}px`,
    left: `${rect.left}px`
  });
}



  removeTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }
};
