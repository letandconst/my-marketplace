'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Container, SimpleGrid, Text, useColorModeValue, useToast, VStack, useDisclosure, Button, Flex } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

import { SearchFilters } from './search-filters';
import { QuickViewModal } from './quick-view-modal';

import { ShimmerSkeleton } from '@/app/components/ui/shimmer-skeleton';
import { EmptyState } from '@/app/components/ui/empty-state';
import { mockItems } from '@/app/data/mock-items';
import type { MarketplaceItem } from '@/app/types/marketplace';
import { ItemCard } from './item-card';
import { useMarketplace } from '@/app/context/MarketplaceContext';

const MotionBox = motion(Box);
const MotionSimpleGrid = motion(SimpleGrid);

interface MarketplaceGridProps {
	searchQuery?: string;
	onAddListing?: (listing: Omit<MarketplaceItem, 'id' | 'createdAt'>) => void;
	onSearch?: (query: string) => void;
}

export function MarketplaceGrid({ searchQuery = '', onSearch }: MarketplaceGridProps) {
	const { items, setItems, favorites, setFavorites, cartItems, setCartItems, setWishlistItems, setWishlistCount } = useMarketplace();

	const { isOpen: isQuickViewOpen, onOpen: onQuickViewOpen, onClose: onQuickViewClose } = useDisclosure();

	const [loading, setLoading] = useState<boolean>(true);
	const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
	const [sortBy, setSortBy] = useState('newest');
	const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

	const toast = useToast();
	const bg = useColorModeValue('gray.50', 'gray.900');

	const ITEMS_PER_PAGE = 8;
	const [currentPage, setCurrentPage] = useState(1);

	const handleFavorite = (id: string) => {
		const item = items.find((i) => i.id === id);
		if (!item) return;

		const newFavorites = new Set(favorites);

		if (newFavorites.has(id)) {
			newFavorites.delete(id);
			toast({ title: 'Removed from wishlist', status: 'info', duration: 2000, isClosable: true });
		} else {
			newFavorites.add(id);
			toast({ title: 'Added to wishlist', status: 'success', duration: 2000, isClosable: true });
		}

		setFavorites(newFavorites);

		// Update items with isFavorited flag
		setItems((prev) =>
			prev.map((i) => ({
				...i,
				isFavorited: newFavorites.has(i.id),
			}))
		);

		const updatedWishlist = items.filter((i) => newFavorites.has(i.id));
		setWishlistItems(updatedWishlist);

		setWishlistCount(updatedWishlist.length);
	};

	const handleAddToCart = (item: MarketplaceItem) => {
		const updated = (() => {
			const existing = cartItems.find((i) => i.id === item.id);
			if (existing) return cartItems.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
			return [...cartItems, { ...item, quantity: 1 }];
		})();

		toast({
			title: 'Added to cart',
			description: `${item.title} has been added to your cart`,
			status: 'success',
			duration: 3000,
			isClosable: true,
		});

		setCartItems(updated);
	};

	const handleQuickView = (item: MarketplaceItem) => {
		setSelectedItem(item);
		onQuickViewOpen();
	};

	const filteredAndSortedItems = useMemo(() => {
		let filtered = items;

		if (searchQuery) {
			filtered = filtered.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase()) || item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
		}

		if (selectedCategory !== 'All Categories') {
			filtered = filtered.filter((item) => item.category === selectedCategory);
		}

		return [...filtered].sort((a, b) => {
			switch (sortBy) {
				case 'newest':
					return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
				case 'oldest':
					return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
				case 'price-low':
					return a.price - b.price;
				case 'price-high':
					return b.price - a.price;
				case 'title':
					return a.title.localeCompare(b.title);
				default:
					return 0;
			}
		});
	}, [items, searchQuery, selectedCategory, sortBy]);

	// --- Derived pagination values ---
	const totalPages = Math.ceil(filteredAndSortedItems.length / ITEMS_PER_PAGE);
	const paginatedItems = filteredAndSortedItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	useEffect(() => {
		const timer = setTimeout(() => {
			setItems(mockItems.map((item) => ({ ...item, isFavorited: favorites.has(item.id) })));
			setLoading(false);
		}, 2000);

		return () => clearTimeout(timer);
	}, [favorites, setItems]);

	if (loading) {
		return (
			<MotionBox
				bg={bg}
				minH='calc(100vh - 80px)'
				py={8}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
			>
				<Container maxW='7xl'>
					<VStack spacing={8}>
						<Text
							fontSize='2xl'
							fontWeight='bold'
							textAlign='center'
						>
							Loading Marketplace...
						</Text>
						<SimpleGrid
							columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
							spacing={6}
							w='100%'
						>
							<ShimmerSkeleton count={8} />
						</SimpleGrid>
					</VStack>
				</Container>
			</MotionBox>
		);
	}

	return (
		<>
			<MotionBox
				bg={bg}
				minH='calc(100vh - 80px)'
				py={8}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.6 }}
			>
				<Container maxW='7xl'>
					<VStack spacing={8}>
						<Text
							fontSize='2xl'
							fontWeight='bold'
							textAlign='center'
						>
							Today&apos;s picks
						</Text>

						<SearchFilters
							selectedCategory={selectedCategory}
							sortBy={sortBy}
							onCategoryChange={setSelectedCategory}
							onSortChange={setSortBy}
							itemCount={filteredAndSortedItems.length}
							onSearch={onSearch}
						/>

						{filteredAndSortedItems.length === 0 ? (
							<EmptyState
								type='search'
								title={searchQuery ? 'No items found' : 'No items available'}
								description={searchQuery ? `We couldn't find any items matching "${searchQuery}". Try adjusting your search or filters.` : 'There are no items available in this category. Check back later for new listings.'}
								actionLabel='Clear Filters'
								onAction={() => {
									setSelectedCategory('All Categories');
									setSortBy('newest');
								}}
							/>
						) : (
							<>
								<AnimatePresence>
									<MotionSimpleGrid
										columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
										spacing={6}
										w='100%'
									>
										{paginatedItems.map((item) => (
											<motion.div
												key={item.id}
												layout
											>
												<ItemCard
													item={item}
													onFavorite={() => handleFavorite(item.id)}
													onAddToCart={() => handleAddToCart(item)}
													onQuickView={() => handleQuickView(item)}
												/>
											</motion.div>
										))}
									</MotionSimpleGrid>
									<Flex
										justify='center'
										align='center'
										mt={6}
										gap={2}
									>
										<Button
											onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
											isDisabled={currentPage === 1}
										>
											Prev
										</Button>

										<Text>
											{currentPage} of {totalPages}
										</Text>

										<Button
											onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
											isDisabled={currentPage === totalPages}
										>
											Next
										</Button>
									</Flex>
								</AnimatePresence>
							</>
						)}
					</VStack>
				</Container>
			</MotionBox>

			<QuickViewModal
				item={selectedItem}
				isOpen={isQuickViewOpen}
				onClose={onQuickViewClose}
				onFavorite={(id) => handleFavorite(id)}
				onAddToCart={(item) => handleAddToCart(item)}
				relatedItems={items.filter((i) => i.category === selectedItem?.category && i.id !== selectedItem?.id)}
				onItemChange={(newItem) => setSelectedItem(newItem)}
			/>
		</>
	);
}
