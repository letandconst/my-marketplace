export function formatCurrency(value: number, currency: string = 'PHP'): string {
	return new Intl.NumberFormat('en-PH', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(value);
}
