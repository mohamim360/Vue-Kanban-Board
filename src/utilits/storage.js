const STORAGE_KEY = "vue-kanban-state"

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.error("Failed to load state", e)
    return null
  }
}

export function saveState(columns) {
  try {
    const payload = {}
    const columnsOrder = ["todo", "inprogress", "done"]
    for (const k of columnsOrder) payload[k] = columns[k].cards
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (e) {
    console.error("Failed to save state", e)
    throw new Error("Failed to save data")
  }
}