'use client';

import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, VStack, HStack, Text, Image, Box, IconButton, Badge, Divider, useColorModeValue, useToast } from '@chakra-ui/react';
import { Trash2, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '@/app/components/ui/empty-state';
import { useMarketplace } from '@/app/context/MarketplaceContext';
import { MarketplaceItem } from '@/app/types/marketplace';
import { formatCurrency } from '@/app/utils/currencyFormatter';

const MotionBox = motion(Box);

export function WishlistDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
	const bg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const textColor = useColorModeValue('gray.600', 'gray.300');
	const priceColor = useColorModeValue('brand.600', 'brand.300');
	const totalValueBg = useColorModeValue('gray.50', 'gray.700');

	const toast = useToast();

	const { setCartItems, wishlistItems, setWishlistItems, setWishlistCount, setFavorites, setItems } = useMarketplace();

	const handleAddToCart = (item?: MarketplaceItem, all = false) => {
		if (all && item === undefined) {
			// Add all wishlist items to cart
			setCartItems((prev) => {
				const updated = [...prev];
				wishlistItems.forEach((wItem) => {
					const existing = updated.find((i) => i.id === wItem.id);
					if (existing) {
						existing.quantity += 1;
					} else {
						updated.push({ ...wItem, quantity: 1 });
					}
				});
				return updated;
			});

			// Clear wishlist
			setWishlistItems([]);
			setWishlistCount(0);
			setFavorites(new Set());

			toast({
				title: 'Wishlist items added to cart',
				description: 'All items from your wishlist have been moved to the cart.',
				status: 'success',
				duration: 3000,
				isClosable: true,
			});
			return;
		}

		if (!item) return;

		// Add single item to cart
		setCartItems((prev) => {
			const existing = prev.find((i) => i.id === item.id);
			if (existing) return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
			return [...prev, { ...item, quantity: 1 }];
		});

		setWishlistItems((prev) => {
			const updated = prev.filter((i) => i.id !== item.id);
			setWishlistCount(updated.length);
			return updated;
		});

		setFavorites((prev) => {
			const newFavorites = new Set(prev);
			newFavorites.delete(item.id);
			return newFavorites;
		});

		setItems((prev) =>
			prev.map((i) => ({
				...i,
				isFavorited: i.id !== item.id && i.isFavorited,
			}))
		);

		toast({
			title: 'Item added to cart',
			description: 'This item has been moved from your wishlist to the cart.',
			status: 'success',
			duration: 3000,
			isClosable: true,
		});
	};

	const handleRemoveFromWishlist = (id: string) => {
		setWishlistItems((prev) => {
			const updated = prev.filter((item) => item.id !== id);
			setWishlistCount(updated.length);
			return updated;
		});

		setFavorites((prev) => {
			const newFavorites = new Set(prev);
			newFavorites.delete(id);
			return newFavorites;
		});

		setItems((prev) =>
			prev.map((item) => ({
				...item,
				isFavorited: item.id !== id && item.isFavorited,
			}))
		);
	};

	const handleClearWishlist = () => {
		setWishlistItems([]);
		setWishlistCount(0);
		setFavorites(new Set());
		setItems((prev) => prev.map((item) => ({ ...item, isFavorited: false })));
	};

	const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0);

	return (
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size='md'
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader
					sx={{
						padding: '16px 48px 16px 24px',
					}}
				>
					<HStack justify='space-between'>
						<Text>My Wishlist</Text>
						<Badge
							colorScheme='teal'
							variant='subtle'
						>
							{wishlistItems.length} {wishlistItems.length <= 1 ? 'item' : 'items'}
						</Badge>
					</HStack>
				</DrawerHeader>

				<DrawerBody>
					{wishlistItems.length === 0 ? (
						<EmptyState
							type='wishlist'
							title='Your wishlist is empty'
							description='Add items to your wishlist by clicking the heart icon on any product card.'
						/>
					) : (
						<VStack
							spacing={4}
							align='stretch'
						>
							<AnimatePresence>
								{wishlistItems.map((item, index) => (
									<MotionBox
										key={item.id}
										initial={{ x: 20, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										exit={{ x: -20, opacity: 0 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
									>
										<Box
											bg={bg}
											border='1px'
											borderColor={borderColor}
											borderRadius='lg'
											p={4}
											_hover={{ shadow: 'md' }}
											transition='all 0.2s'
										>
											<HStack spacing={4}>
												<Image
													src={item.image || '/placeholder-image.jpg'}
													alt={item.title}
													borderRadius='md'
													objectFit='cover'
													w='80px'
													h='80px'
													boxShadow='lg'
												/>

												<VStack
													align='stretch'
													flex='1'
													spacing={2}
												>
													<Text
														fontWeight='bold'
														fontSize='md'
														noOfLines={1}
													>
														{item.title}
													</Text>
													<Text
														fontSize='sm'
														color={textColor}
														noOfLines={2}
													>
														{item.description}
													</Text>
													<HStack justify='space-between'>
														<Text
															fontSize='lg'
															fontWeight='bold'
															color={priceColor}
														>
															{formatCurrency(item.price)}
														</Text>
													</HStack>
												</VStack>

												<VStack spacing={2}>
													<IconButton
														aria-label='Add to cart'
														icon={<ShoppingCart size={16} />}
														size='sm'
														colorScheme='green'
														variant='ghost'
														onClick={() => handleAddToCart(item)}
													/>
													<IconButton
														aria-label='Remove from wishlist'
														icon={<Trash2 size={16} />}
														size='sm'
														colorScheme='red'
														variant='ghost'
														onClick={() => handleRemoveFromWishlist(item.id)}
													/>
												</VStack>
											</HStack>
										</Box>
									</MotionBox>
								))}
							</AnimatePresence>

							{wishlistItems.length > 0 && (
								<MotionBox
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.2 }}
								>
									<Divider />
									<Box
										mt={4}
										p={4}
										bg={totalValueBg}
										borderRadius='lg'
									>
										<HStack justify='space-between'>
											<Text fontWeight='bold'>Total:</Text>
											<Text
												fontSize='xl'
												fontWeight='bold'
												color={priceColor}
											>
												{formatCurrency(totalValue)}
											</Text>
										</HStack>
									</Box>
								</MotionBox>
							)}
						</VStack>
					)}
				</DrawerBody>

				{wishlistItems.length > 0 && (
					<DrawerFooter>
						<VStack
							w='100%'
							spacing={3}
						>
							<Button
								colorScheme='teal'
								size='lg'
								w='100%'
								onClick={() => handleAddToCart(undefined, true)}
							>
								Add All to Cart
							</Button>
							<Button
								variant='ghost'
								size='lg'
								w='100%'
								onClick={handleClearWishlist}
							>
								Clear Wishlist
							</Button>
						</VStack>
					</DrawerFooter>
				)}
			</DrawerContent>
		</Drawer>
	);
}
