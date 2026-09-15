export const CARD_COLORS = {
  blue: { label: 'Default', top: '#f1f8fd', bottom: '#dfeef8', edge: '#d4e7f3' },
  cream: { label: 'Cream', top: '#fdfbf5', bottom: '#f3ebd9', edge: '#efe6d2' },
  pink: { label: 'Pink', top: '#fff3f5', bottom: '#f6e0e6', edge: '#efd3dc' },
  green: { label: 'Green', top: '#f3faef', bottom: '#e3efdb', edge: '#d8e8cf' },
  lavender: { label: 'Lavender', top: '#f8f3fc', bottom: '#ebe2f4', edge: '#e2d7ef' },
  yellow: { label: 'Yellow', top: '#fffbdf', bottom: '#f6eec3', edge: '#eee4b1' },
} as const;

export type CardColor = keyof typeof CARD_COLORS;
