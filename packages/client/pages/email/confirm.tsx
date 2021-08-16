import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Box, Text, useToast } from '@chakra-ui/react'
import { confirmTimeCapsule } from '../../services/timeCapsule'

const Confirm = () => {
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const handleEmailConfirmation = async (email: string, code: string, guid: string) => {
      try {
        await confirmTimeCapsule({ email, code, guid })
        router.push('/')
        toast({
          status: 'success',
          description: `Time capsule confirmed and safely guarded!`,
          duration: 5000,
          isClosable: false,
        })
      } catch (err) {
        toast({
          status: 'error',
          description: `We could not confirm your time capsule creation. Please refresh this page to try again.`,
          duration: 5000,
          isClosable: false,
        })
      }
    }

    const { email, code, guid } = router?.query || {}

    if (email && code && guid) {
      handleEmailConfirmation(email as string, code as string, guid as string)
    }
  }, [router?.query])

  return (
    <Box background="gray.800" w="100%" h="100vh">
      <Text color="white" fontSize="lg">
        Confirming time capsule creation
      </Text>
    </Box>
  )
}

export default Confirm
