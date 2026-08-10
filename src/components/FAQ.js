'use client';

import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import {
  FaChevronDown,
  FaQuestionCircle,
} from 'react-icons/fa';
import './styles/FAQ.css';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'What is Helbeku?',
      answer:
        'Helbeku is a place to meet new people and have spontaneous conversations. Choose what interests you, pick how you want to connect, and let Helbeku find someone for you to talk to.',
    },
    {
      question: 'Is Helbeku free?',
      answer:
        'Yes. Helbeku is completely free to use. There are no subscription fees or hidden charges for meeting and talking with people.',
    },
    {
      question: 'Do I need to create an account?',
      answer:
        'No. You can start using Helbeku without creating an account. Just choose your interests, select a connection mode, and start looking for someone to talk to.',
    },
    {
      question: 'How does matching work?',
      answer:
        'You can add up to five interests before connecting. Helbeku uses them to find someone with similar interests, giving both of you something you might already have in common.',
    },
    {
      question: 'What can I use Helbeku for?',
      answer:
        'You can use Helbeku to have casual conversations, meet people with similar interests, discover different perspectives, or simply find someone to talk to when you feel like connecting.',
    },
    {
      question: 'Which connection modes are available?',
      answer:
        'You can choose between text, audio, and video before starting a conversation. Pick whichever feels most comfortable for you.',
    },
    {
      question: 'Can I switch between text, audio, and video?',
      answer:
        'Yes. Once you are connected, you can start an audio or video call from the chat when you feel comfortable. You can keep chatting through text whenever you prefer.',
    },
    {
      question: 'Can I skip someone?',
      answer:
        'Absolutely. If you would rather talk to someone else, use the Skip option to leave the current conversation and look for a new connection.',
    },
    {
      question: 'Do I get a permanent profile?',
      answer:
        'No. Helbeku is built around conversations rather than permanent profiles, follower counts, or social feeds. You can simply meet someone, have a conversation, and move on to the next one.',
    },
    {
      question: 'Is my identity visible to strangers?',
      answer:
        'Helbeku does not require you to create a public profile or share personal information just to start a conversation. You decide what you are comfortable sharing with the person you meet.',
    },
    {
      question: 'What if the other person leaves?',
      answer:
        'The conversation will end when the other person leaves. You can then choose New Chat to look for someone else.',
    },
    {
      question: 'What if audio or video does not work?',
      answer:
        'Audio and video may require permission to use your microphone or camera. If a call does not work, check that permission is enabled in your browser and try again. You can always continue with text chat.',
    },
    {
      question: 'How can I send feedback?',
      answer:
        'We love hearing from people who use Helbeku. You can send feedback, ideas, or bug reports through the feedback or community channels available on the platform.',
    },
    {
      question: 'When was Helbeku created?',
      answer:
        'Helbeku was originally created in 2024. It has continued to evolve since then, with new ideas, features, and improvements shaping the platform over time.',
    },
  ];


  return (
    <section
      id="faq"
      className="
        bg-gradient-to-b
        from-gray-300
        to-gray-200
        px-4
        py-20
        dark:from-slate-900
        dark:to-slate-950
      "
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <div
            className="
              mx-auto
              mb-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-slate-200
              bg-white/70
              text-blue-500
              shadow-sm
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-blue-400
            "
          >
            <FaQuestionCircle className="h-4 w-4" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-300 sm:text-4xl">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            A few things you might want to know before connecting.
          </p>
        </div>

        <div
          className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-200/80
            bg-white/60
            shadow-sm
            backdrop-blur-sm
            dark:border-slate-800
            dark:bg-slate-900/60
          "
        >
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={
                  index !== faqs.length - 1
                    ? 'border-b border-slate-200/80 dark:border-slate-800'
                    : ''
                }
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-4
                    px-5
                    py-5
                    text-left
                    transition-colors
                    hover:bg-slate-50/70
                    dark:hover:bg-slate-800/40
                    sm:px-6
                  "
                >
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-300">
                    {faq.question}
                  </span>

                  <span
                    className={`
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      border
                      transition-all
                      duration-200
                      ${isOpen
                        ? 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500'
                      }
                    `}
                  >
                    <FaChevronDown
                      className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </span>
                </button>

                <CSSTransition
                  in={isOpen}
                  timeout={250}
                  classNames="faq"
                  unmountOnExit
                >
                  <div className="px-5 pb-5 sm:px-6">
                    <p className="max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </div>
                </CSSTransition>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;