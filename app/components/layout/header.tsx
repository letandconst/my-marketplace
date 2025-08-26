'use client';

import type React from 'react';

import { Box, Flex, Heading, Spacer, IconButton, useColorMode, useColorModeValue, HStack, Badge } from '@chakra-ui/react';
import { Moon, Sun, Heart, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface HeaderProps {
	onOpenWishlist?: () => void;
	onOpenCart?: () => void;
	wishlistCount?: number;
	cartCount?: number;
}

export function Header({ onOpenWishlist, onOpenCart, wishlistCount = 0, cartCount = 0 }: HeaderProps) {
	const { colorMode, toggleColorMode } = useColorMode();
	const bg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');

	return (
		<>
			<MotionBox
				as='header'
				bg={bg}
				borderBottom='1px'
				borderColor={borderColor}
				px={6}
				py={4}
				position='sticky'
				top={0}
				zIndex={10}
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<Flex
					align='center'
					gap={4}
				>
					<Heading
						size='lg'
						color='brand.600'
					>
						MV Marketplace
					</Heading>

					<Spacer />

					<HStack spacing={2}>
						<Box position='relative'>
							<IconButton
								aria-label='Open wishlist'
								icon={<Heart size={20} />}
								variant='ghost'
								size='md'
								onClick={onOpenWishlist}
							/>
							{wishlistCount > 0 && (
								<Badge
									position='absolute'
									top='-1'
									right='-1'
									colorScheme='red'
									borderRadius='full'
									fontSize='xs'
									minW='20px'
									h='20px'
									display='flex'
									alignItems='center'
									justifyContent='center'
								>
									{wishlistCount}
								</Badge>
							)}
						</Box>
						<Box position='relative'>
							<IconButton
								aria-label='Open cart'
								icon={<ShoppingCart size={20} />}
								variant='ghost'
								size='md'
								onClick={onOpenCart}
							/>
							{cartCount > 0 && (
								<Badge
									position='absolute'
									top='-1'
									right='-1'
									colorScheme='teal'
									borderRadius='full'
									fontSize='xs'
									minW='20px'
									h='20px'
									display='flex'
									alignItems='center'
									justifyContent='center'
								>
									{cartCount}
								</Badge>
							)}
						</Box>

						<IconButton
							aria-label='Toggle color mode'
							icon={colorMode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
							onClick={toggleColorMode}
							variant='ghost'
							size='md'
						/>
					</HStack>
				</Flex>
			</MotionBox>
		</>
	);
}
