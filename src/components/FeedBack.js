'use client';

import React, { useState } from 'react';
import {
    FaPaperPlane,
    FaRegCommentDots,
    FaCheck,
} from 'react-icons/fa';

const FeedbackSection = () => {
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const email = formData.get('email')?.trim() || '';
        const message = formData.get('message')?.trim() || '';

        if (!message) return;

        setSending(true);
        setError('');

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    message,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Unable to send feedback.');
            }

            setSubmitted(true);
            form.reset();
        } catch (err) {
            console.error(err);
            setError(
                'Something went wrong while sending your feedback. Please try again.'
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <section
            id="feedback"
            className="
        bg-gradient-to-b
        from-gray-200
        to-gray-300
        px-4
        py-20
        dark:from-slate-950
        dark:via-slate-900
        dark:to-slate-950
      "
        >
            <div className="mx-auto max-w-2xl text-center">

                <div
                    className="
            mx-auto mb-4
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            border border-slate-200
            bg-white/70
            text-blue-500
            shadow-sm
            dark:border-slate-700
            dark:bg-slate-800
            dark:text-blue-400
          "
                >
                    <FaRegCommentDots className="h-4 w-4" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-300 sm:text-4xl">
                    Got something to say?
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 dark:text-slate-400">
                    Found something that could be better, have an idea, or just want
                    to tell us what you think? We&apos;d love to hear it.
                </p>

                {submitted ? (
                    <div
                        className="
              mx-auto mt-8
              rounded-2xl
              border border-emerald-200/80
              bg-white/60
              px-6 py-8
              shadow-sm
              backdrop-blur-sm
              dark:border-emerald-900/50
              dark:bg-slate-900/60
            "
                    >
                        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <FaCheck className="h-4 w-4" />
                        </div>

                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Thanks for the feedback.
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Your message has been sent to the Helbeku team.
                        </p>
                    </div>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="
              mt-8
              rounded-2xl
              border border-slate-200/80
              bg-white/60
              p-5
              text-left
              shadow-sm
              backdrop-blur-sm
              dark:border-slate-800
              dark:bg-slate-900/60
              sm:p-6
            "
                    >
                        <div>
                            <label
                                htmlFor="feedback-email"
                                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                            >
                                Email{' '}
                                <span className="font-normal text-slate-400">
                                    (optional)
                                </span>
                            </label>

                            <input
                                id="feedback-email"
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                disabled={sending}
                                className="
                  w-full rounded-xl
                  border border-slate-200
                  bg-white/80
                  px-3.5 py-2.5
                  text-sm text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-400
                  focus:ring-2 focus:ring-blue-500/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-slate-700
                  dark:bg-slate-800/70
                  dark:text-slate-200
                  dark:placeholder:text-slate-500
                  dark:focus:border-blue-500
                "
                            />
                        </div>

                        <div className="mt-4">
                            <label
                                htmlFor="feedback-message"
                                className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300"
                            >
                                Feedback
                            </label>

                            <textarea
                                id="feedback-message"
                                name="message"
                                required
                                rows={5}
                                maxLength={2000}
                                placeholder="Tell us what you think..."
                                disabled={sending}
                                className="
                  w-full resize-none rounded-xl
                  border border-slate-200
                  bg-white/80
                  px-3.5 py-3
                  text-sm leading-6 text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-blue-400
                  focus:ring-2 focus:ring-blue-500/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-slate-700
                  dark:bg-slate-800/70
                  dark:text-slate-200
                  dark:placeholder:text-slate-500
                  dark:focus:border-blue-500
                "
                            />
                        </div>

                        {error && (
                            <p className="mt-3 text-xs text-rose-500 dark:text-rose-400">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={sending}
                            className="
                mt-4 flex w-full
                items-center justify-center gap-2
                rounded-xl
                bg-blue-600
                px-4 py-2.5
                text-sm font-semibold text-white
                shadow-sm
                transition-all duration-150
                hover:bg-blue-700
                active:scale-[0.99]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
                        >
                            <FaPaperPlane
                                className={`h-3.5 w-3.5 ${sending ? 'animate-pulse' : ''
                                    }`}
                            />

                            {sending ? 'Sending...' : 'Send'}
                        </button>

                        <p className="mt-3 text-center text-[11px] text-slate-400 dark:text-slate-600">
                            No account needed. Just leave your thoughts.
                        </p>
                    </form>
                )}
            </div>
        </section>
    );
};

export default FeedbackSection;