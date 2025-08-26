"use client"

import { Spinner, VStack, Text, useColorModeValue } from "@chakra-ui/react"
import { motion } from "framer-motion"

const MotionVStack = motion(VStack)

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg" | "xl"
}

export function LoadingSpinner({ message = "Loading...", size = "lg" }: LoadingSpinnerProps) {
  const textColor = useColorModeValue("gray.600", "gray.400")

  return (
    <MotionVStack spacing={4} py={8} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Spinner size={size} color="brand.500" thickness="3px" />
      <Text fontSize="md" color={textColor}>
        {message}
      </Text>
    </MotionVStack>
  )
}
