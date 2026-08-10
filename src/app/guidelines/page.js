'use client';

import React from 'react';
import Link from 'next/link';
import {
    FaHeart,
    FaShieldAlt,
    FaUserSecret,
    FaBan,
    FaFlag,
    FaComments,
} from 'react-icons/fa';
import Header from '@/components/Header';

const CommunityGuidelines = () => {
    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-200 via-gray-100 to-gray-200 text-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 dark:text-slate-200">
            <Header />
            <div className="mt-16 mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">

                <div className="mb-10">
                    <Link
                        href="/"
                        className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        ← Back to Helbeku
                    </Link>

                    <div className="mt-8">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                            Helbeku
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Community Guidelines
                        </h1>

                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            A simple guide to keeping conversations worth having.
                        </p>
                    </div>
                </div>

                <div className="space-y-10 text-sm leading-7 text-slate-600 dark:text-slate-400">

                    <section>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400">
                            <FaHeart />
                        </div>

                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Be a decent human
                        </h2>

                        <p>
                            Helbeku exists for spontaneous conversations. You do not need to
                            become best friends with everyone you meet, but basic respect goes
                            a long way.
                        </p>

                        <p className="mt-3">
                            Give people room to be themselves. If a conversation is not your
                            thing, you can always skip and meet someone else.
                        </p>
                    </section>

                    <section>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400">
                            <FaUserSecret />
                        </div>

                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Protect your privacy
                        </h2>

                        <p>
                            Remember that you are talking to someone you do not know.
                        </p>

                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>Do not share passwords or verification codes.</li>
                            <li>Do not share banking or payment information.</li>
                            <li>Be careful with your address and location.</li>
                            <li>Do not send identity documents to strangers.</li>
                            <li>Think before sharing personal photographs or information.</li>
                        </ul>
                    </section>

                    <section>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400">
                            <FaShieldAlt />
                        </div>

                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Keep it safe
                        </h2>

                        <p>
                            Do not use Helbeku to threaten, harass, stalk, exploit, blackmail,
                            deceive, or intentionally harm another person.
                        </p>

                        <p className="mt-3">
                            Content involving the sexual exploitation of minors, threats of
                            violence, or instructions intended to facilitate serious
                            wrongdoing is not welcome on Helbeku.
                        </p>
                    </section>

                    <section>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-400">
                            <FaBan />
                        </div>

                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            No spam or scams
                        </h2>

                        <p>
                            Helbeku is for conversations, not for turning strangers into a
                            marketing list.
                        </p>

                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>Do not flood conversations with repetitive messages.</li>
                            <li>Do not distribute phishing links or malicious software.</li>
                            <li>Do not impersonate another person or organization.</li>
                            <li>Do not use conversations to run scams or deceptive schemes.</li>
                            <li>Do not abuse automated tools to create or disrupt matches.</li>
                        </ul>
                    </section>

                    <section>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400">
                            <FaComments />
                        </div>

                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Use the Skip button
                        </h2>

                        <p>
                            Not every conversation will click. That is completely fine.
                        </p>

                        <p className="mt-3">
                            If someone makes you uncomfortable, pressures you, or simply is
                            not someone you want to talk to, leave the conversation. You do
                            not owe a stranger an explanation.
                        </p>
                    </section>

                    {/* <section>
                        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-400">
                            <FaFlag />
                        </div>

                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            Report serious problems
                        </h2>

                        <p>
                            If Helbeku provides a reporting or feedback channel, use it when
                            you encounter serious abuse, security problems, or behavior that
                            clearly violates these guidelines.
                        </p>

                        <p className="mt-3">
                            Because conversations are temporary and room data is cleared when
                            a conversation ends, provide relevant details as soon as possible
                            if you need to report something.
                        </p>
                    </section> */}

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            A final thought
                        </h2>

                        <p>
                            Helbeku works best when people can arrive without a profile,
                            without a follower count, and without knowing what the other
                            person is going to say.
                        </p>

                        <p className="mt-3">
                            Keep that space comfortable for the person on the other side of
                            the screen.
                        </p>

                        <p className="mt-4 font-medium text-slate-800 dark:text-slate-300">
                            Meet someone new. Start a conversation. Leave the rest to the
                            moment.
                        </p>
                    </section>

                    <section className="border-t border-slate-300 pt-8 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            These guidelines work alongside the Helbeku Terms of Service.
                            Serious violations may result in access restrictions or other
                            appropriate action.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default CommunityGuidelines;
