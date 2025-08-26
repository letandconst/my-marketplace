import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
	initialColorMode: 'system',
	useSystemColorMode: true,
};

const theme = extendTheme({
	config,
	fonts: {
		heading: 'var(--font-sans)',
		body: 'var(--font-sans)',
	},

	components: {
		Card: {
			baseStyle: {
				container: {
					borderRadius: 'lg',
					overflow: 'hidden',
					transition: 'all 0.2s',
					_hover: {
						transform: 'translateY(-2px)',
						shadow: 'lg',
					},
				},
			},
		},
		Button: {
			defaultProps: {
				colorScheme: 'teal',
			},
		},
	},
});

export default theme;
