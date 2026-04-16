export const cx = (...classes) => classes.filter(Boolean).join(' ')

export function formatNumber(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Deterministic color from a string
const AVATAR_COLORS = [
  '#5E6AD2', '#2F7A4B', '#B5540A', '#7B3F9E', '#1A6E8E', '#8A3030',
]
export function getAvatarColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}
