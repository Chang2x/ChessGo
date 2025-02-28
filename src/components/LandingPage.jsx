import { Box, VStack, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

const LandingPage = ({ onStartGame }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} py={20}>
      <VStack spacing={10} maxW="container.sm" mx="auto" px={4}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading 
            size="2xl" 
            textAlign="center"
            bgGradient="linear(to-r, blue.400, teal.400)"
            bgClip="text"
          >
            ChessGo
          </Heading>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Text 
            fontSize="xl" 
            color="gray.600" 
            textAlign="center"
            maxW="md"
          >
            A minimalist chess trainer to enhance your game offline
          </Text>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          w="full"
          maxW="sm"
        >
          <VStack 
            spacing={4} 
            bg={cardBg} 
            p={8} 
            borderRadius="xl" 
            boxShadow="xl"
            w="full"
          >
            <Button
              size="lg"
              w="full"
              colorScheme="blue"
              onClick={onStartGame}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              transition="all 0.2s"
            >
              Start Playing
            </Button>
            
            <Button
              size="lg"
              w="full"
              variant="ghost"
              colorScheme="blue"
              _hover={{ transform: 'translateY(-2px)' }}
              transition="all 0.2s"
            >
              How to Play
            </Button>
          </VStack>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Text color="gray.500" fontSize="sm" textAlign="center">
            No account needed • Play offline • Free forever
          </Text>
        </MotionBox>
      </VStack>
    </Box>
  );
};

export default LandingPage;
