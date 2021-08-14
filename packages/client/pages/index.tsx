import {Box, Button, Fade, Input, Text, useToast} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {createTimeCapsule} from "../services/timeCapsule";
import Calendar from 'react-calendar'
import { addHours } from "date-fns";

const ReactQuill = typeof window === 'object' ? require('react-quill') : () => false;

const Index = () => {
  const toast = useToast()
  const [value, setValue] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [scheduledDate, setScheduledDate] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      await createTimeCapsule({ email, content: value, scheduledTo: scheduledDate })
      setSubmitted(true)
      toast({
        status: 'success',
        description: 'Time capsule created 🥳',
        isClosable: true,
        duration: 5000,
      })
    } catch (err) {
      toast({
        status: 'error',
        description: err?.response?.data?.errors?.join(', ') ||  'We failed to create your time capsule 😢 Please try again',
        isClosable: true,
        duration: 5000,
      })
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    let timeoutReference;
    if (submitted) {
      timeoutReference = setTimeout(() => {
        setSubmitted(false)
      }, 6000)
    }

    return () => {
      clearTimeout(timeoutReference)
    }
  }, [submitted])

  return (
      <Box w={"100%"} h={"100vh"} background={"gray.800"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <Box as={"form"} w={"100%"} maxWidth={"1024px"} display={"flex"} flexDirection={"column"} alignItems={"stretch"} onSubmit={handleSubmit}>

          <Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
            <Text color={"white"} fontSize={"md"} mb={"1rem"}>Name</Text>
            <Input
              background={"transparent"}
              maxWidth={"300px"}
              color={"white"}
              placeholder={"Your name (optional)"}
              borderWidth={"1px"}
              borderColor={"white"}
              borderRadius={"0.25rem"}
              mb={"1rem"}
              onChange={({ target: { value } }) => setName(value)}
            />
          </Box>

            <Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
              <Text color={"white"} fontSize={"md"} mb={"1rem"}>Email</Text>
              <Input
                background={"transparent"}
                maxWidth={"300px"}
                color={"white"}
                placeholder={"Your email (required)"}
                borderWidth={"1px"}
                borderColor={"white"}
                borderRadius={"0.25rem"}
                mb={"1rem"}
                required
                onChange={({ target: { value } }) => setEmail(value)}
              />
            </Box>

            <Box maxWidth={"720px"} my={"2.5rem"}>
              <Text color={"white"} fontSize={"md"} mb={"1rem"}>Your memo</Text>
              <ReactQuill theme="snow" value={value} onChange={setValue} style={{ color: "white" }} />
            </Box>

            <Box display={"flex"} flexDirection={"column"} alignItems={"flex-start"}>
              <Text color={"white"} fontSize={"md"} mb={"1rem"}>When should we send you your time capsule?</Text>
              <Calendar onChange={setScheduledDate} value={scheduledDate} activeStartDate={new Date()} minDate={addHours(new Date(), 24)} />
            </Box>

            <Fade in={submitted}>
              <Text mt={"2rem"} color={"white"} fontSize={"sm"} fontStyle={"italic"}>We sent a confirmation email. Make sure you confirm the email submission or the time capsule will be deleted within 24 hours</Text>
            </Fade>

            <Button isLoading={submitting} loadingText={"Creating time capsule"} type={"submit"} maxWidth={"300px"} alignSelf={"center"} px={"2rem"} mt={"1.5rem"} colorScheme={"blue"}>Submit</Button>
        </Box>
      </Box>
  )
}

export default Index
