'use client';

import { Box, Card, CardBody, Image, Text, Badge, Button, HStack, VStack, IconButton, useColorModeValue } from '@chakra-ui/react';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MarketplaceItem } from '@/app/types/marketplace';
import { formatCurrency } from '@/app/utils/currencyFormatter';

const MotionCard = motion(Card);

interface ItemCardProps {
	item: MarketplaceItem;
	onFavorite?: (id: string) => void;
	onAddToCart?: (item: MarketplaceItem) => void;
	onQuickView?: (item: MarketplaceItem) => void;
}

export function ItemCard({ item, onFavorite, onAddToCart, onQuickView }: ItemCardProps) {
	const cardBg = useColorModeValue('white', 'gray.800');
	const textColor = useColorModeValue('gray.600', 'gray.300');
	const priceColor = useColorModeValue('brand.600', 'brand.300');

	return (
		<MotionCard
			bg={cardBg}
			cursor='pointer'
			onClick={() => onQuickView?.(item)}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.2 }}
		>
			<CardBody p={0}>
				<Box position='relative'>
					<Image
						src={item.image || '/placeholder-image.jpg'}
						alt={item.title}
						borderTopRadius='lg'
						objectFit='cover'
						w='100%'
						h='200px'
						loading='lazy'
					/>

					<Box
						pos='absolute'
						top='0'
						left='0'
						w='100%'
						h='100%'
						bg='rgba(0,0,0,0.4)'
						zIndex='1'
						borderTopRadius='lg'
					/>

					<IconButton
						aria-label='Add to favorites'
						icon={<Heart size={16} />}
						position='absolute'
						top={2}
						right={2}
						size='sm'
						variant='solid'
						bg='white'
						color={item.isFavorited ? 'red.500' : 'gray.400'}
						_hover={{ color: 'red.500' }}
						onClick={(e) => {
							e.stopPropagation();
							onFavorite?.(item.id);
						}}
						zIndex={2}
					/>
					<Badge
						position='absolute'
						top={2}
						left={2}
						colorScheme='brand'
						variant='solid'
						fontSize='xs'
						zIndex={2}
					>
						{item.category}
					</Badge>
				</Box>

				<VStack
					align='stretch'
					p={4}
					spacing={3}
				>
					<Text
						fontWeight='bold'
						fontSize='lg'
						noOfLines={1}
					>
						{item.title}
					</Text>

					<Text
						color={textColor}
						fontSize='sm'
						noOfLines={2}
						minH='40px'
					>
						{item.description}
					</Text>

					<HStack
						justify='space-between'
						align='center'
					>
						<Text
							fontSize='xl'
							fontWeight='bold'
							color={priceColor}
						>
							{formatCurrency(item.price)}
						</Text>
						<Text
							fontSize='xs'
							color={textColor}
						>
							by {item.seller}
						</Text>
					</HStack>

					<Button
						colorScheme='teal'
						size='sm'
						onClick={(e) => {
							e.stopPropagation();
							onAddToCart?.(item);
						}}
					>
						Add to Cart
					</Button>
				</VStack>
			</CardBody>
		</MotionCard>
	);
}
