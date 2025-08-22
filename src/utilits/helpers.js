export const uid = () => Math.random().toString(36).slice(2, 10)
export const now = () => new Date().toISOString()

export function formatDate(iso) {
	try {
		const date = new Date(iso)
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	} catch {
		return iso
	}
}