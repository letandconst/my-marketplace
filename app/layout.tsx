import type React from 'react';
import type { Metadata } from 'next';

import { ChakraProvider } from '@chakra-ui/react';

import './globals.css';

export const metadata: Metadata = {
	title: 'MV Marketplace',
	description: 'A modern marketplace built with Next.js and Chakra UI',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang='en'
			suppressHydrationWarning
		>
			<body>
				<ChakraProvider>{children}</ChakraProvider>
			</body>
		</html>
	);
}
