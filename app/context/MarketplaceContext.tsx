import { createContext, useContext, useState, ReactNode } from 'react';
import { MarketplaceItem, CartItem } from '@/app/types/marketplace';

interface MarketplaceContextProps {
	items: MarketplaceItem[];
	setItems: React.Dispatch<React.SetStateAction<MarketplaceItem[]>>;
	favorites: Set<string>;
	setFavorites: React.Dispatch<React.SetStateAction<Set<string>>>;
	selectedItem: MarketplaceItem | null;
	setSelectedItem: React.Dispatch<React.SetStateAction<MarketplaceItem | null>>;
	cartItems: CartItem[];
	setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
	wishlistItems: MarketplaceItem[];
	setWishlistItems: React.Dispatch<React.SetStateAction<MarketplaceItem[]>>;
	wishlistCount: number;
	setWishlistCount: React.Dispatch<React.SetStateAction<number>>;
}

const MarketplaceContext = createContext<MarketplaceContextProps | undefined>(undefined);

export const useMarketplace = () => {
	const context = useContext(MarketplaceContext);
	if (!context) throw new Error('useMarketplace must be used within MarketplaceProvider');
	return context;
};

export const MarketplaceProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<MarketplaceItem[]>([]);
	const [favorites, setFavorites] = useState<Set<string>>(new Set());
	const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [wishlistItems, setWishlistItems] = useState<MarketplaceItem[]>([]);
	const [wishlistCount, setWishlistCount] = useState(0);

	return (
		<MarketplaceContext.Provider
			value={{
				items,
				setItems,
				favorites,
				setFavorites,
				selectedItem,
				setSelectedItem,
				cartItems,
				setCartItems,
				wishlistItems,
				setWishlistItems,
				wishlistCount,
				setWishlistCount,
			}}
		>
			{children}
		</MarketplaceContext.Provider>
	);
};
