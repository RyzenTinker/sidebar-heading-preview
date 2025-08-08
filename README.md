# Sidebar Heading Preview

This Obsidian plugin adds a tooltip preview of the first-level headings (`#`) from a note when you hover over it in the sidebar.

### Features

- Instantly preview top-level headings (# Heading) on hover without opening the note  
- Clean and responsive tooltip design with smooth alignment  
- Adds bullet points to each heading for better visual clarity  
- Customizable appearance via styles.css (easy theming support)  
- Saves time when navigating large vaults with many files  

### How it works

When you hover over a file name in the Obsidian file explorer (sidebar), a small tooltip appears near your cursor after a short delay.  
This tooltip shows the top-level headings (# Heading) found in the file, styled with bullets and improved readability.

If a file doesn't contain any # Heading, no tooltip appears.

---

### Installation (Manual)

1. Download the latest release from the [Releases](https://github.com/RyzenTinker/sidebar-heading-preview/releases) tab  
2. Copy `main.js`, `manifest.json`, and `styles.css` (if available) into a folder under `.obsidian/plugins/`  
3. Enable the plugin in Obsidian's settings  

---

### Planned Improvements

- Option to customize tooltip delay  
- Support for more heading levels (`##`, `###`, etc.)
- as soon as obsidian recognises the plugin, an improved code is on the way 

---

### Styling

The tooltip's appearance is controlled via `styles.css`, allowing for easy customization.  
You can adjust font sizes, colors, shadows, or other visual elements to better match your Obsidian theme.

If you're using this plugin manually, make sure `styles.css` is placed alongside `main.js` and `manifest.json` in the plugin folder.

---

### Acknowledgements

Developed by Shijin

---

### 🛡 License

MIT
