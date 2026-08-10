'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

const PrivacyPolicy = () => {
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
                            Privacy Policy
                        </h1>

                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            Effective date: August 10, 2026
                        </p>
                    </div>
                </div>

                <div className="space-y-10 text-sm leading-7 text-slate-600 dark:text-slate-400">

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            1. Introduction
                        </h2>

                        <p>
                            Welcome to Helbeku. Helbeku is a service designed to make it easy
                            to meet someone new and start a conversation without requiring a
                            traditional account or public profile.
                        </p>

                        <p className="mt-3">
                            This Privacy Policy explains what information may be processed
                            when you use Helbeku, how that information is used, and the
                            choices available to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            2. Information You Provide
                        </h2>

                        <p>
                            Helbeku does not require you to create a traditional user account.
                            Depending on how you use the service, you may provide information
                            such as:
                        </p>

                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>Interests you choose for matching.</li>
                            <li>Messages you send during a conversation.</li>
                            <li>Information voluntarily provided through feedback or support.</li>
                        </ul>

                        <p className="mt-3">
                            You should avoid sharing passwords, financial information,
                            government identification numbers, private addresses, or other
                            sensitive personal information with strangers through Helbeku.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            3. Temporary Conversations
                        </h2>

                        <p>
                            Helbeku is built around temporary conversations rather than
                            permanent social profiles or message histories.
                        </p>

                        <p className="mt-3">
                            Chat-room information is associated with the temporary room in
                            which the conversation takes place. When the conversation ends
                            and the room is cleared, the associated room conversation data is
                            removed as part of that cleanup process.
                        </p>

                        <p className="mt-3">
                            This does not mean that every piece of technical information
                            involved in operating the service disappears immediately. Service
                            providers, infrastructure, security systems, or technical logs
                            may retain limited information where reasonably necessary for
                            security, reliability, debugging, fraud prevention, or legal
                            obligations.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            4. Audio and Video Calls
                        </h2>

                        <p>
                            Helbeku may allow users to communicate through audio and video
                            calls. These calls are intended to facilitate communication
                            between participants and are not intended to create a permanent
                            media library or public profile.
                        </p>

                        <p className="mt-3">
                            Do not assume that another participant will keep a conversation
                            private. A person you communicate with may independently record,
                            screenshot, photograph, or otherwise reproduce their side of an
                            interaction.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            5. How Information Is Used
                        </h2>

                        <p>
                            Information processed through Helbeku may be used to:
                        </p>

                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>Match users based on selected interests.</li>
                            <li>Provide text, audio, and video communication features.</li>
                            <li>Maintain and operate the service.</li>
                            <li>Detect abuse, spam, fraud, or attempts to misuse the platform.</li>
                            <li>Diagnose technical problems and improve reliability.</li>
                            <li>Respond to feedback, support requests, or reports.</li>
                            <li>Meet applicable legal or security requirements.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            6. Cookies and Local Storage
                        </h2>

                        <p>
                            Helbeku may use browser storage technologies such as local
                            storage to remember temporary preferences, including selected
                            interests or connection preferences.
                        </p>

                        <p className="mt-3">
                            Your browser may also store technical information required for
                            the service to function correctly. You can manage or remove
                            browser-stored information through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            7. Third-Party Services
                        </h2>

                        <p>
                            Helbeku may rely on third-party infrastructure and services to
                            operate features such as real-time communication, hosting,
                            analytics, security, or other technical functionality.
                        </p>

                        <p className="mt-3">
                            These providers may process limited information on behalf of
                            Helbeku according to their own terms and privacy practices.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            8. Information Security
                        </h2>

                        <p>
                            We take reasonable measures to protect the information processed
                            through Helbeku. However, no internet service can guarantee
                            absolute security.
                        </p>

                        <p className="mt-3">
                            Please use good judgment when communicating with strangers and
                            never share information that could put your personal safety,
                            finances, accounts, or identity at risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            9. Children
                        </h2>

                        <p>
                            Helbeku is not intended for children who are below the minimum
                            age required to use the service under applicable law.
                        </p>

                        <p className="mt-3">
                            If you believe a child is using Helbeku inappropriately or
                            providing personal information, please report the situation
                            through the available support channels.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            10. Your Choices
                        </h2>

                        <p>
                            Because Helbeku does not require a traditional account, there may
                            be limited account-management information to modify or delete.
                            You can clear locally stored preferences through your browser and
                            stop using the service at any time.
                        </p>

                        <p className="mt-3">
                            If you have a privacy-related question or request, contact us
                            through the support channel provided on Helbeku.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            11. Changes to This Policy
                        </h2>

                        <p>
                            We may update this Privacy Policy as Helbeku evolves. When
                            meaningful changes are made, the updated version will be
                            published on this page with a revised effective date.
                        </p>
                    </section>

                    <section className="border-t border-slate-300 pt-8 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            If you have questions about this Privacy Policy, please contact
                            Helbeku through the support or community channel available on the
                            website.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default PrivacyPolicy;
