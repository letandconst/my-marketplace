'use client';

import { Box, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Button, VStack, HStack, Text, Image, IconButton, Badge, Divider, useColorModeValue, NumberInput, NumberInputField, useToast } from '@chakra-ui/react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EmptyState } from '@/app/components/ui/empty-state';
import type { CartItem } from '@/app/types/marketplace';
import { formatCurrency } from '@/app/utils/currencyFormatter';

const MotionBox = motion(Box);

interface FloatingCartProps {
	isOpen: boolean;
	onClose: () => void;
	cartItems: CartItem[];
	onUpdateQuantity?: (id: string, quantity: number) => void;
	onRemoveFromCart?: (id: string) => void;
	onClearCart?: () => void;
	onCheckout?: () => void;
}

export function FloatingCart({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveFromCart, onClearCart, onCheckout }: FloatingCartProps) {
	const bg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');
	const textColor = useColorModeValue('gray.600', 'gray.300');
	const priceColor = useColorModeValue('brand.600', 'brand.300');
	const totalBg = useColorModeValue('gray.50', 'gray.700');
	const toast = useToast();

	const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
	const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

	const handleQuantityChange = (id: string, quantity: number) => {
		if (quantity <= 0) {
			onRemoveFromCart?.(id);
			return;
		}
		onUpdateQuantity?.(id, quantity);
	};

	const handleCheckout = () => {
		toast({
			title: 'Checkout initiated',
			description: `Processing ${totalItems} items worth &#8369; ${totalPrice.toFixed(2)}`,
			status: 'success',
			duration: 3000,
			isClosable: true,
		});
		onCheckout?.();
	};

	return (
		<Drawer
			isOpen={isOpen}
			placement='right'
			onClose={onClose}
			size='md'
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerHeader
					sx={{
						padding: '16px 48px 16px 24px',
					}}
				>
					<HStack justify='space-between'>
						<Text>Cart</Text>
						<Badge
							colorScheme='teal'
							variant='solid'
						>
							{totalItems > 1 ? `${totalItems} items` : `${totalItems} item`}
						</Badge>
					</HStack>
				</DrawerHeader>
				<DrawerCloseButton />
				<DrawerBody>
					{cartItems.length === 0 ? (
						<EmptyState
							type='cart'
							title='Your cart is empty'
							description='Choose items from the list to add to your cart.'
						/>
					) : (
						<VStack
							spacing={4}
							align='stretch'
						>
							<AnimatePresence>
								{cartItems.map((item, index) => (
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
														noOfLines={1}
													>
														by {item.seller}
													</Text>
													<HStack justify='space-between'>
														<Text
															fontSize='lg'
															fontWeight='bold'
															color={priceColor}
														>
															&#8369; {item.price}
														</Text>
													</HStack>
												</VStack>

												<VStack spacing={2}>
													<HStack>
														<IconButton
															aria-label='Decrease quantity'
															icon={<Minus size={12} />}
															size='xs'
															variant='outline'
															onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
														/>
														<NumberInput
															value={item.quantity}
															onChange={(_, value) => handleQuantityChange(item.id, value || 1)}
															size='sm'
															maxW='60px'
															min={1}
														>
															<NumberInputField textAlign='center' />
														</NumberInput>
														<IconButton
															aria-label='Increase quantity'
															icon={<Plus size={12} />}
															size='xs'
															variant='outline'
															onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
														/>
													</HStack>
													<IconButton
														aria-label='Remove from cart'
														icon={<Trash2 size={16} />}
														size='sm'
														colorScheme='red'
														variant='ghost'
														onClick={() => onRemoveFromCart?.(item.id)}
													/>
												</VStack>
											</HStack>
										</Box>
									</MotionBox>
								))}
							</AnimatePresence>

							{cartItems.length > 0 && (
								<MotionBox
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ duration: 0.3, delay: 0.2 }}
								>
									<Divider />
									<Box
										mt={4}
										p={4}
										bg={totalBg}
										borderRadius='lg'
									>
										<VStack spacing={2}>
											<HStack
												justify='space-between'
												w='100%'
											>
												<Text>Subtotal ( {totalItems > 1 ? `${totalItems} items` : `${totalItems} item`}):</Text>
												<Text fontWeight='bold'>{formatCurrency(totalPrice)}</Text>
											</HStack>
											<HStack
												justify='space-between'
												w='100%'
											>
												<Text>Shipping:</Text>
												<Text fontWeight='bold'>Free</Text>
											</HStack>
											<Divider />
											<HStack
												justify='space-between'
												w='100%'
											>
												<Text
													fontSize='lg'
													fontWeight='bold'
												>
													Total:
												</Text>
												<Text
													fontSize='xl'
													fontWeight='bold'
													color={priceColor}
												>
													{formatCurrency(totalPrice)}
												</Text>
											</HStack>
										</VStack>
									</Box>
								</MotionBox>
							)}
						</VStack>
					)}
				</DrawerBody>

				{cartItems.length > 0 && (
					<DrawerFooter>
						<VStack
							w='100%'
							spacing={3}
						>
							<Button
								colorScheme='teal'
								size='lg'
								w='100%'
								onClick={handleCheckout}
							>
								Proceed to Checkout
							</Button>
							<Button
								variant='ghost'
								size='lg'
								w='100%'
								onClick={onClearCart}
							>
								Clear Cart
							</Button>
						</VStack>
					</DrawerFooter>
				)}
			</DrawerContent>
		</Drawer>
	);
}
