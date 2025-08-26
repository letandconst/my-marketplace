"use client"

import { Box, Skeleton, VStack, HStack, useColorModeValue } from "@chakra-ui/react"
import { motion } from "framer-motion"

const MotionBox = motion(Box)

interface ShimmerSkeletonProps {
  count?: number
}

export function ShimmerSkeleton({ count = 8 }: ShimmerSkeletonProps) {
  const shimmerBg = useColorModeValue("gray.100", "gray.700")
  const shimmerHighlight = useColorModeValue("gray.200", "gray.600")

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <MotionBox
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Box
            bg={shimmerBg}
            borderRadius="lg"
            overflow="hidden"
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, transparent, ${shimmerHighlight}, transparent)`,
              animation: "shimmer 1.5s infinite",
            }}
          >
            <VStack spacing={4} p={0}>
              <Skeleton height="200px" width="100%" borderTopRadius="lg" />
              <VStack spacing={3} p={4} align="stretch" width="100%">
                <Skeleton height="20px" width="80%" />
                <Skeleton height="16px" width="100%" />
                <Skeleton height="16px" width="60%" />
                <HStack justify="space-between">
                  <Skeleton height="24px" width="60px" />
                  <Skeleton height="16px" width="80px" />
                </HStack>
                <Skeleton height="32px" width="100%" borderRadius="md" />
              </VStack>
            </VStack>
          </Box>
        </MotionBox>
      ))}
    </>
  )
}
