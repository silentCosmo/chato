'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  VideoCameraIcon,
  XMarkIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const ConnectSection = () => {
  const [interests, setInterests] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [matchType, setMatchType] = useState('text');
  const router = useRouter();

  useEffect(() => {
    const storedInterests =
      JSON.parse(localStorage.getItem('userInterests')) || [];

    setInterests(storedInterests);

    const storedType = localStorage.getItem('matchType') || 'text';
    setMatchType(storedType);
  }, []);

  const addInterest = (interest) => {
    const cleanInterest = interest.trim();

    if (!cleanInterest || interests.length >= 5) return;
    if (interests.some((item) => item.toLowerCase() === cleanInterest.toLowerCase())) {
      return;
    }

    const updatedInterests = [...interests, cleanInterest];

    setInterests(updatedInterests);
    localStorage.setItem(
      'userInterests',
      JSON.stringify(updatedInterests)
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      event.preventDefault();
      addInterest(inputValue);
      setInputValue('');
    }
  };

  const removeInterest = (index) => {
    const updatedInterests = interests.filter((_, i) => i !== index);

    setInterests(updatedInterests);
    localStorage.setItem(
      'userInterests',
      JSON.stringify(updatedInterests)
    );
  };

  const clearInterests = () => {
    setInterests([]);
    localStorage.removeItem('userInterests');
  };

  const handleSelectMode = (mode) => {
    setMatchType(mode);
    localStorage.setItem('matchType', mode);
  };

  const handleConnect = () => {
    if (inputValue.trim() !== '') {
      addInterest(inputValue);
      setInputValue('');
    }

    localStorage.setItem('matchType', matchType);
    router.push('/chat');
  };

  const modes = [
    {
      id: 'text',
      label: 'Text',
      icon: ChatBubbleLeftRightIcon,
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: PhoneIcon,
    },
    {
      id: 'video',
      label: 'Video',
      icon: VideoCameraIcon,
    },
  ];

  return (
    <section
      id="connect"
      className="
        min-h-screen
        flex
        items-center
        justify-center
        px-4
        sm:px-6
        pt-28
        pb-20
        bg-gradient-to-b
        from-gray-50
        via-gray-100
        to-gray-200
        dark:from-slate-900
        dark:via-slate-900
        dark:to-slate-950
        text-slate-900
        dark:text-slate-100
      "
    >
      <div className="w-full max-w-2xl text-center">

        {/* Intro */}
        <div className="mb-10">
          <div
            className="
              inline-flex
              items-center
              justify-center
              w-11
              h-11
              mb-5
              rounded-2xl
              bg-white
              dark:bg-slate-800
              border
              border-slate-200
              dark:border-slate-700
              shadow-sm
            "
          >
            <ChatBubbleLeftRightIcon
              className="w-5 h-5 text-blue-500"
            />
          </div>

          <h1
            className="
              text-4xl
              sm:text-5xl
              font-extrabold
              tracking-tight
              text-transparent
              bg-gradient-to-r
              from-blue-500
              to-indigo-600
              dark:from-blue-400
              dark:to-indigo-500
              bg-clip-text
            "
          >
            Connect with People
          </h1>

          <p
            className="
              mt-4
              text-sm
              sm:text-base
              text-slate-600
              dark:text-slate-400
              max-w-lg
              mx-auto
              leading-relaxed
            "
          >
            Find someone who shares your interests and start a conversation.
            No account. No profile. Just connect.
          </p>
        </div>

        {/* Interest Input */}
        <div className="w-full max-w-md mx-auto">
          <div
            className="
              flex
              items-center
              bg-white
              dark:bg-slate-800
              border
              border-slate-200
              dark:border-slate-700
              rounded-2xl
              px-4
              shadow-sm
              focus-within:border-blue-500
              focus-within:ring-4
              focus-within:ring-blue-500/10
              transition-all
            "
          >
            <input
              type="text"
              placeholder={
                interests.length >= 5
                  ? 'Maximum 5 interests'
                  : 'Enter an interest...'
              }
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              maxLength={25}
              disabled={interests.length >= 5}
              className="
                w-full
                py-3.5
                bg-transparent
                outline-none
                text-sm
                text-slate-900
                dark:text-slate-100
                placeholder-slate-400
                dark:placeholder-slate-500
                disabled:cursor-not-allowed
              "
            />

            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="
                  p-1.5
                  rounded-lg
                  text-slate-400
                  hover:text-slate-600
                  dark:hover:text-slate-200
                  transition-colors
                "
                aria-label="Clear input"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Interests */}
        {interests.length > 0 && (
          <div className="mt-5 max-w-xl mx-auto">
            <div className="flex flex-wrap justify-center gap-2">
              {interests.map((interest, index) => (
                <span
                  key={`${interest}-${index}`}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    px-3
                    py-1.5
                    rounded-xl
                    text-xs
                    font-medium
                    bg-blue-50
                    text-blue-700
                    border
                    border-blue-100
                    dark:bg-blue-950/40
                    dark:text-blue-300
                    dark:border-blue-900/60
                  "
                >
                  {interest}

                  <button
                    type="button"
                    onClick={() => removeInterest(index)}
                    className="
                      text-blue-400
                      hover:text-blue-700
                      dark:hover:text-blue-200
                      transition-colors
                    "
                    aria-label={`Remove ${interest}`}
                  >
                    <XMarkIcon className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}

              <button
                type="button"
                onClick={clearInterests}
                className="
                  px-3
                  py-1.5
                  rounded-xl
                  text-xs
                  font-medium
                  text-slate-500
                  hover:text-rose-500
                  dark:text-slate-400
                  dark:hover:text-rose-400
                  transition-colors
                "
              >
                Clear
              </button>
            </div>

            <p className="mt-3 text-[11px] text-slate-400 dark:text-slate-500">
              {interests.length}/5 interests
            </p>
          </div>
        )}

        {/* Connection Mode */}
        <div className="mt-9">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">
            Connection mode
          </p>

          <div className="inline-flex p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {modes.map(({ id, label, icon: Icon }) => {
              const active = matchType === id;

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelectMode(id)}
                  className={`
                    flex
                    items-center
                    gap-2
                    px-4
                    sm:px-5
                    py-2.5
                    rounded-xl
                    text-xs
                    sm:text-sm
                    font-medium
                    transition-all
                    duration-200
                    ${
                      active
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Connect */}
        <button
          type="button"
          onClick={handleConnect}
          className="
            mt-8
            inline-flex
            items-center
            justify-center
            gap-2
            px-7
            py-3.5
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            hover:from-blue-500
            hover:to-indigo-500
            text-white
            text-sm
            font-semibold
            shadow-lg
            shadow-blue-600/20
            transition-all
            duration-200
            active:scale-[0.98]
          "
        >
          Connect
          <ArrowRightIcon className="w-4 h-4" />
        </button>

        <p className="mt-5 text-[11px] text-slate-400 dark:text-slate-500">
          No sign-up required
        </p>
      </div>
    </section>
  );
};

export default ConnectSection;