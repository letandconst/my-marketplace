"use client"

import { VStack, Text, Box, Button, useColorModeValue } from "@chakra-ui/react"
import { Search, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

const MotionVStack = motion(VStack)

interface EmptyStateProps {
  type: "search" | "wishlist" | "cart" | "compare"
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ type, title, description, actionLabel, onAction }: EmptyStateProps) {
  const textColor = useColorModeValue("gray.600", "gray.400")
  const iconColor = useColorModeValue("gray.400", "gray.500")

  const getIcon = () => {
    switch (type) {
      case "search":
        return <Search size={48} color={iconColor} />
      case "wishlist":
      case "cart":
      case "compare":
        return <ShoppingBag size={48} color={iconColor} />
      default:
        return <Search size={48} color={iconColor} />
    }
  }

  return (
    <MotionVStack
      spacing={6}
      py={16}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box>{getIcon()}</Box>
      <VStack spacing={2}>
        <Text fontSize="xl" fontWeight="bold" textAlign="center">
          {title}
        </Text>
        <Text fontSize="md" color={textColor} textAlign="center" maxW="400px">
          {description}
        </Text>
      </VStack>
      {actionLabel && onAction && (
        <Button colorScheme="brand" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </MotionVStack>
  )
}
