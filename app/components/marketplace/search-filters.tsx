'use client';

import { Box, HStack, Select, useColorModeValue, Text, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface SearchFiltersProps {
	onSearch?: (query: string) => void;
	selectedCategory: string;
	sortBy: string;
	onCategoryChange: (category: string) => void;
	onSortChange: (sort: string) => void;
	itemCount: number;
}

const categories = ['All Categories', 'Electronics', 'Fashion', 'Home', 'Food & Beverage', 'Books & Media', 'Sports & Outdoors', 'Toys & Games', 'Others'];

const sortOptions = [
	{ value: 'newest', label: 'Newest First' },
	{ value: 'oldest', label: 'Oldest First' },
	{ value: 'price-low', label: 'Price: Low to High' },
	{ value: 'price-high', label: 'Price: High to Low' },
	{ value: 'title', label: 'Title A-Z' },
];

export function SearchFilters({ selectedCategory, sortBy, onCategoryChange, onSortChange, onSearch }: SearchFiltersProps) {
	const bg = useColorModeValue('white', 'gray.800');
	const borderColor = useColorModeValue('gray.200', 'gray.700');

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSearch?.(e.target.value);
	};

	return (
		<MotionBox
			bg={bg}
			p={4}
			borderRadius='lg'
			border='1px'
			borderColor={borderColor}
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.3 }}
			w='100%'
		>
			<Box>
				<Box
					flex='1'
					w='100%'
				>
					<InputGroup>
						<InputLeftElement pointerEvents='none'>
							<Search size={16} />
						</InputLeftElement>
						<Input
							placeholder='Search Marketplace'
							onChange={handleSearchChange}
							bg={useColorModeValue('gray.50', 'gray.700')}
							border='none'
						/>
					</InputGroup>
				</Box>
				<HStack
					w='100%'
					my={4}
					justifyContent='flex-start'
					sx={{
						'@media screen and (max-width:480px)': {
							flexDirection: 'column',

							'> div': {
								width: '100%',

								'.chakra-text ': {
									whiteSpace: 'nowrap',
								},

								'.chakra-select__wrapper': {
									width: '100%',
								},
							},
						},
					}}
				>
					<HStack>
						<Text
							fontSize='sm'
							fontWeight='medium'
						>
							Filter by:
						</Text>
						<Select
							value={selectedCategory}
							onChange={(e) => onCategoryChange(e.target.value)}
							size='sm'
							w='max-content'
						>
							{categories.map((category) => (
								<option
									key={category}
									value={category}
								>
									{category}
								</option>
							))}
						</Select>
					</HStack>

					<HStack>
						<Text
							fontSize='sm'
							fontWeight='medium'
						>
							Sort:
						</Text>
						<Select
							value={sortBy}
							onChange={(e) => onSortChange(e.target.value)}
							size='sm'
							w='max-content'
						>
							{sortOptions.map((option) => (
								<option
									key={option.value}
									value={option.value}
								>
									{option.label}
								</option>
							))}
						</Select>
					</HStack>
				</HStack>
			</Box>
		</MotionBox>
	);
}
