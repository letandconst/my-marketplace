import React from 'react';
import { useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';
import { Header } from '@/app/components/layout/header';
import { MarketplaceGrid } from '@/app/components/marketplace/marketplace-grid';
import { WishlistDrawer } from '@/app/components/marketplace/wishlist-drawer';
import { FloatingCart } from '@/app/components/cart/floating-cart';
import { useMarketplace } from '../context/MarketplaceContext';

const Root = () => {
	const { cartItems, setCartItems, wishlistCount } = useMarketplace();
	const { isOpen: isWishlistOpen, onOpen: onWishlistOpen, onClose: onWishlistClose } = useDisclosure();
	const { isOpen: isCartOpen, onOpen: onCartOpen, onClose: onCartClose } = useDisclosure();

	const [searchQuery, setSearchQuery] = useState<string>('');

	const handleSearch = (query: string) => setSearchQuery(query);

	const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

	const handleUpdateQuantity = (id: string, quantity: number) => setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)).filter((item) => item.quantity > 0));

	const handleRemoveFromCart = (id: string) => setCartItems((prev) => prev.filter((item) => item.id !== id));

	const handleClearCart = () => setCartItems([]);

	const handleCheckout = () =>
		setTimeout(() => {
			setCartItems([]);
			onCartClose();
		}, 2000);

	return (
		<>
			<Header
				onOpenWishlist={onWishlistOpen}
				onOpenCart={onCartOpen}
				wishlistCount={wishlistCount}
				cartCount={totalCartItems}
			/>
			<MarketplaceGrid
				searchQuery={searchQuery}
				onSearch={handleSearch}
			/>

			<WishlistDrawer
				isOpen={isWishlistOpen}
				onClose={onWishlistClose}
			/>

			<FloatingCart
				isOpen={isCartOpen}
				onClose={onCartClose}
				cartItems={cartItems}
				onUpdateQuantity={handleUpdateQuantity}
				onRemoveFromCart={handleRemoveFromCart}
				onClearCart={handleClearCart}
				onCheckout={handleCheckout}
			/>
		</>
	);
};

export default Root;
