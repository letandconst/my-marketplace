'use client';

import { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Image, Text, VStack, HStack, Badge, Divider, SimpleGrid, Box, IconButton, useColorModeValue, Tag, TagLabel, Wrap, WrapItem } from '@chakra-ui/react';
import { Heart, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MarketplaceItem } from '@/app/types/marketplace';
import { formatCurrency } from '@/app/utils/currencyFormatter';

const MotionModalContent = motion(ModalContent);
const MotionBox = motion(Box);

interface QuickViewModalProps {
	item: MarketplaceItem | null;
	isOpen: boolean;
	onClose: () => void;
	onFavorite?: (id: string) => void;
	onAddToCart?: (item: MarketplaceItem) => void;
	relatedItems?: MarketplaceItem[];
	onItemChange?: (item: MarketplaceItem) => void;
}

export function QuickViewModal({ item, isOpen, onClose, onFavorite, onAddToCart, relatedItems = [], onItemChange }: QuickViewModalProps) {
	const cardBg = useColorModeValue('white', 'gray.800');
	const textColor = useColorModeValue('gray.600', 'gray.300');
	const priceColor = useColorModeValue('brand.600', 'brand.300');

	const [transitioning, setTransitioning] = useState(false);
	const [nextItem, setNextItem] = useState<MarketplaceItem | null>(null);

	if (!item) return null;

	const handleRelatedClick = (relatedItem: MarketplaceItem) => {
		setNextItem(relatedItem);
		setTransitioning(true);
		setTimeout(() => {
			onItemChange?.(relatedItem);
			setTransitioning(false);
			setNextItem(null);
		}, 400);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size='4xl'
		>
			<ModalOverlay />
			<MotionModalContent
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				transition={{ duration: 0.3 }}
			>
				<ModalHeader>Quick View</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<AnimatePresence mode='wait'>
						<motion.div
							key={item.id}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.4 }}
						>
							<SimpleGrid
								columns={{ base: 1, md: 2 }}
								spacing={8}
							>
								{/* Image Section */}
								<MotionBox
									initial={{ x: -20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.4 }}
								>
									<Image
										src={item.image || '/placeholder-image.jpg'}
										alt={item.title}
										borderRadius='lg'
										objectFit='cover'
										w='100%'
										h='300px'
									/>
								</MotionBox>

								{/* Details Section */}
								<MotionBox
									initial={{ x: 20, opacity: 0 }}
									animate={{ x: 0, opacity: 1 }}
									transition={{ duration: 0.4, delay: 0.1 }}
								>
									<VStack
										align='stretch'
										spacing={4}
									>
										<HStack
											justify='space-between'
											align='start'
										>
											<VStack
												align='stretch'
												spacing={2}
												flex='1'
											>
												<Text
													fontSize='2xl'
													fontWeight='bold'
												>
													{item.title}
												</Text>
												<Badge
													colorScheme='brand'
													variant='subtle'
													w='fit-content'
												>
													{item.category}
												</Badge>
											</VStack>
											<IconButton
												aria-label='Add to favorites'
												icon={<Heart size={20} />}
												size='lg'
												variant='ghost'
												color={item.isFavorited ? 'red.500' : 'gray.400'}
												_hover={{ color: 'red.500' }}
												onClick={() => onFavorite?.(item.id)}
											/>
										</HStack>

										<Text
											fontSize='3xl'
											fontWeight='bold'
											color={priceColor}
										>
											{formatCurrency(item.price)}
										</Text>

										<Text
											color={textColor}
											lineHeight='1.6'
										>
											{item.description}
										</Text>

										<Divider />

										<VStack
											align='stretch'
											spacing={2}
										>
											<Text
												fontSize='sm'
												fontWeight='medium'
											>
												Seller: {item.seller}
											</Text>
											<Text
												fontSize='sm'
												color={textColor}
											>
												Listed: {new Date(item.createdAt).toLocaleDateString()}
											</Text>
										</VStack>

										{item.tags.length > 0 && (
											<VStack
												align='stretch'
												spacing={2}
											>
												<Text
													fontSize='sm'
													fontWeight='medium'
												>
													Tags:
												</Text>
												<Wrap>
													{item.tags.map((tag) => (
														<WrapItem key={tag}>
															<Tag
																size='sm'
																colorScheme='gray'
																variant='subtle'
															>
																<TagLabel>{tag}</TagLabel>
															</Tag>
														</WrapItem>
													))}
												</Wrap>
											</VStack>
										)}

										<Button
											leftIcon={<ShoppingCart size={20} />}
											bg='teal.400'
											color='white'
											size='lg'
											onClick={() => onAddToCart?.(item)}
											sx={{
												_hover: {
													backgroundColor: 'teal.500',
												},
											}}
										>
											Add to Cart
										</Button>
									</VStack>
								</MotionBox>
							</SimpleGrid>
						</motion.div>
					</AnimatePresence>
					{/* Related Items Section */}
					{!transitioning && relatedItems.length > 0 && (
						<MotionBox
							mt={8}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.4, delay: 0.3 }}
						>
							<Divider mb={6} />
							<Text
								fontSize='lg'
								fontWeight='bold'
								mb={4}
							>
								You might also like
							</Text>
							<SimpleGrid
								columns={{ base: 2, md: 3 }}
								spacing={4}
							>
								{relatedItems.slice(0, 3).map((relatedItem, index) => (
									<motion.div
										key={relatedItem.id}
										initial={{ y: 20, opacity: 0 }}
										animate={{ y: 0, opacity: 1 }}
										transition={{ duration: 0.3, delay: index * 0.1 }}
									>
										<Box
											bg={cardBg}
											borderRadius='md'
											overflow='hidden'
											cursor='pointer'
											_hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
											transition='all 0.2s'
											onClick={() => handleRelatedClick(relatedItem)}
										>
											<Image
												src={relatedItem.image || '/placeholder-image.jpg'}
												alt={relatedItem.title}
												objectFit='cover'
												w='100%'
												h='100px'
											/>
											<Box p={3}>
												<Text
													fontSize='sm'
													fontWeight='medium'
													noOfLines={1}
												>
													{relatedItem.title}
												</Text>
												<Text
													fontSize='sm'
													color={priceColor}
													fontWeight='bold'
												>
													{formatCurrency(relatedItem.price)}
												</Text>
											</Box>
										</Box>
									</motion.div>
								))}
							</SimpleGrid>
						</MotionBox>
					)}
				</ModalBody>

				<ModalFooter>
					<Button
						variant='ghost'
						onClick={onClose}
					>
						Close
					</Button>
				</ModalFooter>
			</MotionModalContent>
		</Modal>
	);
}
