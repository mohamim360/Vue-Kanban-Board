
const STORAGE_KEY = "vue-kanban-state"


function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);

      // Load title if it exists
      if (parsed.title) {
        boardTitle.value = parsed.title;
      }

      // Clear existing cards
      columnsOrder.forEach((k) => columns[k].cards.splice(0));

      // Load columns data
      const columnsData = parsed.columns || parsed; // Support both old and new format

      for (const k of columnsOrder) {
        if (columnsData[k] && Array.isArray(columnsData[k])) {
          columns[k].cards.push(...columnsData[k]);
        }
      }
    } else {
      // Default sample cards (your existing code)
      columns.todo.cards.push(
        {
          id: uid(),
          title: "Design landing page",
          description: "Create wireframes for homepage hero section",
          priority: "High",
          tags: ["design", "frontend"],
          createdAt: now(),
        },
        {
          id: uid(),
          title: "User authentication",
          description: "Set up login and registration flows",
          priority: "Medium",
          tags: ["backend", "security"],
          createdAt: now(),
        }
      );
      columns.inprogress.cards.push({
        id: uid(),
        title: "API endpoints",
        description: "Implement CRUD operations for main resources",
        priority: "Medium",
        tags: ["backend", "api"],
        createdAt: now(),
      });
      columns.done.cards.push({
        id: uid(),
        title: "Project setup",
        description: "Initialize repository and CI pipeline",
        priority: "Low",
        tags: ["devops"],
        createdAt: now(),
      });
      save();
    }
  } catch (e) {
    console.error("Failed to load state", e);

  }
}



function save() {
  try {
    const payload = {
      title: boardTitle.value, // Save the title
      columns: {}, // Save columns in a nested object
    };

    // Add columns data
    for (const k of columnsOrder) {
      payload.columns[k] = columns[k].cards;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error("Failed to save state", e);
    showToast("Failed to save data", "error");
  }
}


export { load, save };