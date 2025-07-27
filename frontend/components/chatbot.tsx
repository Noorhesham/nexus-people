import { LanguageDirectionContext } from '@/helpers/langDirection';
import React, { useState, useEffect, useRef, useContext } from 'react';
import {FormattedMessage, useIntl} from "react-intl"
import Typography from '@mui/material/Typography';
import Image from 'next/image'
import { motion } from 'framer-motion';
import CrudComponent from "@/helpers/CRUD";
import Tooltip from '@mui/material/Tooltip';

interface QAPair {
  question: {
    ar: string,
    en: string
  }
  answer: {
    ar: string,
    en: string
  }
}

const Chatbot: React.FC = () => {
  const {formatMessage} = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isRTL } = useContext(LanguageDirectionContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ content: string; isUser: boolean }[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const [qaPairs, setQAPairs] = useState<QAPair[]>([]);
  const apiEndpoint = `${process.env.BACKEND}chatbot`;

  const {
    data,
    fetchData,
  } = CrudComponent({apiEndpoint: `${process.env.BACKEND}`});

  useEffect(() => {
    fetchData(apiEndpoint, "Chatbot")
      .then(() => {
        setIsLoading(false);
      });
  }, [apiEndpoint, isLoading, isOpen]);
  
  useEffect(() => {
    setQAPairs(data as QAPair[])
  }, [data]);

  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = formatMessage({ id: 'bot.welcome' });
      setMessages([{ content: welcomeMessage, isUser: false }]);
    } else {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }
  }, [messages]);

  const handleToggleChatbot = () => {
    setIsOpen(!isOpen);
  }

  const handleUserMessage = (message: string) => {
    if(message != '') {
      const response = getBotResponse(message);

      setMessages(prevMessages => [...prevMessages, { content: message, isUser: true }]);
      setIsBotTyping(true);
  
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { content: response, isUser: false }]);
        setIsBotTyping(false);
      }, 1000);
    }
  };

  const getBotResponse = (userInput: string): string  => {
    if(isRTL) {
      const matchedQAPair = qaPairs.find(qaPair =>
        userInput.toLowerCase().includes(qaPair.question.ar.toLowerCase())
      );
  
      return matchedQAPair ? matchedQAPair.answer.ar : "";
    } else {
      const matchedQAPair = qaPairs.find(qaPair =>
        userInput.toLowerCase().includes(qaPair.question.en.toLowerCase())
      );

      return matchedQAPair ? matchedQAPair.answer.en : "";
    }
  };

  return (
    <div dir={isRTL? 'rtl' : 'ltr'} className={`fixed bottom-6 ${isRTL? 'left-4': 'right-4' } z-20 scale-75 sm:scale-100`}>
      <Tooltip title={<FormattedMessage id='home.bot' />} arrow placement='left'>
        <motion.button
          initial={isRTL? {x: -100} : { x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className={`flex justify-center items-center ${
            !isOpen ? 'bg-white w-16 h-16 rounded-full shadow-md shadow-black/50' : 'w-full bg-primary text-white h-10 rounded-t-lg max-w-md mx-auto'
          }`}
          onClick={handleToggleChatbot}
        >
          {isOpen ? <Typography variant='h6'> <FormattedMessage id='bot.head' /></Typography> : <Image className='' alt='Chatbot' src='/chatbot.svg' width={100} height={50}/>}
        </motion.button>
      </Tooltip>

      {isOpen &&    
        <div className="bg-white rounded-b-lg shadow-md p-4 max-w-md w-96 mx-auto">
          <div id="chat-window" ref={chatWindowRef} className="overflow-y-auto w-full max-h-60">
            {messages.map((message, index) => (
              <div key={index} className={`flex mb-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                {!message.isUser && (
                  <Image
                    src="/chatbot.svg"
                    alt="Bot Avatar"
                    width={60}
                    height={60}
                    className="w-10 h-10 bg-white rounded-full mr-2 fill-primary"
                  />
                )}
                <Typography variant='body2' className={`rounded-lg p-2 ${message.isUser ? 'ml-2 bg-secondary text-white' : 'mr-2 bg-primary text-white'}`}>
                  {message.content}
                </Typography>
                
                {message.isUser && (
                  <Image
                    src="/avatar.svg"
                    alt="User Avatar"
                    width={60}
                    height={60}
                    className="w-10 h-10 bg-pgrey rounded-full ml-2"
                  />
                )}
              </div>
            ))}
            {isBotTyping && (
              <div className="flex mb-2 justify-start">
                <div className="w-8 h-8 rounded-full mr-2 bg-gray-200 animate-pulse" />
                <div className="bg-gray-200 rounded-lg p-2 animate-pulse w-1/2" />
              </div>
            )}
          </div>
          <div className="border border-gray-300 rounded px-2 py-1 w-full mt-2 text-black relative">
            <select
              className="w-full h-full appearance-none bg-transparent focus:outline-none"
              placeholder="Type your message..."
              onFocus={(e)=>{e.target.size = 4}}
              onChange={e => {
                handleUserMessage(e.currentTarget.value);
                e.currentTarget.value = '';
              }}
            >
              <option value="" className="text-black">
                <FormattedMessage id="bot.select" />
              </option>
              {qaPairs.map((qaPair, index) => (
                <option key={index} value={isRTL? qaPair.question?.ar :qaPair.question?.en} className="text-black">
                  {isRTL? qaPair.question?.ar : qaPair.question?.en}
                </option>
              ))}
            </select>
          </div>
        </div>
      }
    </div>
  );
};

export default Chatbot;