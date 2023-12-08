export function formatMoney(amount) {
    amount = amount / 100
    return new Intl.NumberFormat('en-IN', {
        maximumFractionDigits: 2,
        style: 'currency', currency: 'USD'
      }).format(amount);
}