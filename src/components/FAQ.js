'use client'
import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import './styles/FAQ.css'; // Import the CSS file for transitions

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        {
            question: "What is Helbeku?",
            answer: "Helbeku is a platform designed to connect people from various backgrounds for meaningful conversations and interactions."
        },
        {
            question: "How does Helbeku work?",
            answer: "Helbeku connects users based on shared interests, allowing them to chat or video call, fostering genuine interactions. You can start chatting without signing up."
        },
        {
            question: "Do I need to create an account?",
            answer: "No, you don’t need to create an account. Just start chatting and connecting with others immediately. Your privacy and ease of use are our priorities."
        },
        {
            question: "What features does Helbeku offer?",
            answer: "Currently, Helbeku offers text chat functionality with plans to include video calling in the future. We are also working on additional features to enhance user experience."
        },
        {
            question: "Is Helbeku really free?",
            answer: "Yes! Helbeku is completely free to use. Enjoy chatting and meeting new people without any costs or hidden fees."
        },
        {
            question: "How can I provide feedback or suggestions?",
            answer: "We welcome feedback and suggestions from our users. Please reach out through our Discord channel or use the feedback button on our site."
        },
    ];

    return (
        <section id="faq" className='bg-gray-50 dark:bg-slate-900 md:px-28 px-3 py-12'>
            <div className="bg-gray-100 dark:bg-slate-800 md:p-8 p-6 rounded-lg shadow-sm shadow-gray-300 dark:shadow-gray-900">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Frequently Asked Questions</h2>
                {faqs.map((faq, index) => (
                    <div key={index} className="mb-6">
                        <button
                            className="text-left w-ful text-gray-800 dark:text-gray-100 font-semibold focus:outline-none flex justify-between items-center"
                            onClick={() => toggleFAQ(index)}
                        >
                            <span className="text-lg">{faq.question}</span>
                            <span className="ml-2 text-xl">{openIndex === index ? '-' : '+'}</span>
                        </button>
                        <CSSTransition
                            in={openIndex === index}
                            timeout={300}
                            classNames="faq"
                            unmountOnExit
                        >
                            <div className="faq-answer text-gray-800 dark:text-gray-300 leading-6 text-sm mt-2">
                                <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                            </div>
                        </CSSTransition>
                        {index < faqs.length - 1 && <hr className="border-gray-600 mt-4" />}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;

