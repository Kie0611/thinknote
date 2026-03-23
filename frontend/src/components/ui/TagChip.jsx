const colorMap = {
  biology:   { bg: '#dbeafe', text: '#1d4ed8' },
  exam:      { bg: '#d1fae5', text: '#065f46' },
  meeting:   { bg: '#fce7f3', text: '#9d174d' },
  important: { bg: '#ede9fe', text: '#6d28d9' },
  research:  { bg: '#fef3c7', text: '#92400e' },
  cs:        { bg: '#cffafe', text: '#0e7490' },
  work:      { bg: '#d1fae5', text: '#065f46' },
  blue:      { bg: '#dbeafe', text: '#1d4ed8' },
  emerald:   { bg: '#d1fae5', text: '#065f46' },
  violet:    { bg: '#ede9fe', text: '#6d28d9' },
  amber:     { bg: '#fef3c7', text: '#92400e' },
  pink:      { bg: '#fce7f3', text: '#9d174d' },
  cyan:      { bg: '#cffafe', text: '#0e7490' },
}

export default function TagChip({ tag, size = 'sm', onClick }) {
  const colors = colorMap[tag] || { bg: '#f4f4f5', text: '#71717a' }
  const fontSize = size === 'xs' ? 'text-[10px]' : size === 'sm' ? 'text-xs' : 'text-sm'
  const padding = size === 'xs' ? 'px-2 py-0.5' : 'px-2.5 py-1'

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center font-semibold rounded-full cursor-pointer transition-opacity hover:opacity-80 ${fontSize} ${padding}`}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      #{tag}
    </span>
  )
}
