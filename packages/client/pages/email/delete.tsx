import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Box, Text, useToast } from '@chakra-ui/react'
import { deleteTimeCapsule } from '../../services/timeCapsule'

const Delete = () => {
  const router = useRouter()
  const toast = useToast()

  useEffect(() => {
    const handleEmailDeletion = async (email: string, code: string, guid: string) => {
      try {
        await deleteTimeCapsule({ email, code, guid })
        router.push('/')
        toast({
          status: 'success',
          description: `Time capsule deleted`,
          duration: 5000,
          isClosable: false,
        })
      } catch (err) {
        toast({
          status: 'error',
          description: `We could not delete the time capsule. Please refresh this page to try again.`,
          duration: 5000,
          isClosable: false,
        })
      }
    }

    const { email, code, guid } = router?.query || {}

    if (email && code && guid) {
      handleEmailDeletion(email as string, code as string, guid as string)
    }
  }, [router?.query])

  return (
    <Box background="gray.800" w="100%" h="100vh">
      <Text color="white" fontSize="lg">
        Deleting pre created time capsule
      </Text>
    </Box>
  )
}

export default Delete
