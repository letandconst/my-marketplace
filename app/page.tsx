'use client';

import { MarketplaceProvider } from '@/app/context/MarketplaceContext';
import Root from './views';

export default function HomePage() {
	return (
		<MarketplaceProvider>
			<Root />
		</MarketplaceProvider>
	);
}
