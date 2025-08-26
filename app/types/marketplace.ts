export interface MarketplaceItem {
	id: string;
	title: string;
	description: string;
	price: number;
	category: string;
	image: string;
	seller: string;
	tags: string[];
	createdAt: string;
	isFavorited?: boolean;
}

export interface CartItem extends MarketplaceItem {
	quantity: number;
}
