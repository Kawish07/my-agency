export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '';
  // strip non-numeric chars (like $ or commas) then parse
  const num = Number(String(value).replace(/[^0-9.-]+/g, ''));
  if (Number.isNaN(num)) return String(value);
  return `$${Math.round(num).toLocaleString()}`;
}

export default formatPrice;
