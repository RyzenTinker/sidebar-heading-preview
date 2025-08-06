
const { Plugin, TFile } = require("obsidian");

module.exports = class SidebarHeadingPreview extends Plugin {
  tooltipEl = null;
  timeoutId = null;

  async onload() {
    console.log("Sidebar Heading Preview loaded");
    this.registerDomEvent(document, "mousemove", (evt) => this.onMouseMove(evt));
  }

  onunload() {
    this.removeTooltip();
  }

  async onMouseMove(evt) {
    const target = evt.target;
    const fileEl = target?.closest(".nav-file-title");
    if (!fileEl) {
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
    const headings = content.split("\n").filter(line => line.startsWith("# ")).map(line => line.replace(/^# /, "").trim());
    if (headings.length === 0) {
      this.removeTooltip();
      return;
    }

    if (!this.tooltipEl) {
      this.tooltipEl = document.createElement("div");
      this.tooltipEl.className = "sidebar-heading-preview-tooltip";
      document.body.appendChild(this.tooltipEl);
    }

    this.tooltipEl.innerHTML = "<strong>Headings:</strong><br>" + headings.map(h => "- " + h).join("<br>");

    const rect = el.getBoundingClientRect();
    Object.assign(this.tooltipEl.style, {
      position: "fixed",
      top: `${rect.bottom + 5}px`,
      left: `${rect.left}px`,
      zIndex: "9999",
      backgroundColor: "#222",
      color: "#eee",
      padding: "6px 10px",
      borderRadius: "6px",
      fontSize: "12px",
      maxWidth: "300px",
      pointerEvents: "none"
    });
  }

  removeTooltip() {
    if (this.tooltipEl) {
      this.tooltipEl.remove();
      this.tooltipEl = null;
    }
  }
};
