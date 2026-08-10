'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';

const TermsOfService = () => {
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
                            Terms of Service
                        </h1>

                        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                            Effective date: August 10, 2026
                        </p>
                    </div>
                </div>

                <div className="space-y-10 text-sm leading-7 text-slate-600 dark:text-slate-400">

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            1. Welcome to Helbeku
                        </h2>

                        <p>
                            These Terms of Service govern your use of Helbeku. By accessing
                            or using the service, you agree to follow these terms.
                        </p>

                        <p className="mt-3">
                            If you do not agree with these terms, please do not use Helbeku.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            2. What Helbeku Provides
                        </h2>

                        <p>
                            Helbeku is a platform for spontaneous conversations between
                            people. Users may choose interests and use available connection
                            options such as text chat, audio calls, or video calls.
                        </p>

                        <p className="mt-3">
                            Helbeku does not guarantee that you will always find a match,
                            that a conversation will be enjoyable, or that another user will
                            behave appropriately.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            3. No Traditional Account Required
                        </h2>

                        <p>
                            Helbeku is designed to allow people to connect without creating
                            a traditional account.
                        </p>

                        <p className="mt-3">
                            This does not remove your responsibility for how you use the
                            service. You are responsible for your own actions and
                            communications while using Helbeku.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            4. Appropriate Use
                        </h2>

                        <p>
                            You agree not to use Helbeku to:
                        </p>

                        <ul className="mt-3 list-disc space-y-2 pl-5">
                            <li>Harass, threaten, intimidate, or target another person.</li>
                            <li>Share sexual or exploitative content involving minors.</li>
                            <li>Attempt to obtain another person&apos;s private information.</li>
                            <li>Impersonate another person or organization.</li>
                            <li>Send spam, scams, malicious links, or deceptive content.</li>
                            <li>Promote or coordinate illegal activities.</li>
                            <li>Attempt to disrupt, damage, or abuse the service.</li>
                            <li>Use automated systems to abuse or overload Helbeku.</li>
                            <li>Attempt to bypass technical or safety protections.</li>
                            <li>Use the service in violation of applicable law.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            5. Conversations With Strangers
                        </h2>

                        <p>
                            Helbeku connects you with people you may not know. You should
                            treat every conversation accordingly.
                        </p>

                        <p className="mt-3">
                            Do not share passwords, banking information, verification codes,
                            private addresses, identity documents, or other sensitive
                            information with strangers.
                        </p>

                        <p className="mt-3">
                            Be especially careful if another person asks you to send money,
                            purchase something, move the conversation to another service,
                            install software, or reveal private information.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            6. Skipping and Ending Conversations
                        </h2>

                        <p>
                            You can leave a conversation using the Skip option. Conversations
                            are intended to be temporary, and chat-room information is
                            cleared when the room ends.
                        </p>

                        <p className="mt-3">
                            Helbeku may also end or restrict a conversation when necessary
                            for safety, technical, moderation, or service-related reasons.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            7. User Content
                        </h2>

                        <p>
                            You are responsible for the messages and other content you
                            communicate through Helbeku.
                        </p>

                        <p className="mt-3">
                            You must have the necessary rights to share content that you
                            provide through the service and must not use Helbeku to distribute
                            content that violates another person&apos;s rights or applicable law.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            8. Moderation and Enforcement
                        </h2>

                        <p>
                            Helbeku may take reasonable action when users abuse the service
                            or violate these terms. Depending on the circumstances, this may
                            include ending a conversation, restricting access, blocking
                            activity, or reporting serious illegal conduct to appropriate
                            authorities where required or appropriate.
                        </p>

                        <p className="mt-3">
                            Because Helbeku is designed around temporary conversations, our
                            ability to investigate events may be limited once a conversation
                            has ended and temporary room data has been cleared.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            9. Availability
                        </h2>

                        <p>
                            Helbeku is provided on an availability basis. We may modify,
                            suspend, maintain, or discontinue features at any time.
                        </p>

                        <p className="mt-3">
                            We do not guarantee uninterrupted operation, permanent
                            availability, or that every feature will work on every device,
                            browser, network, or connection.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            10. Third-Party Services
                        </h2>

                        <p>
                            Helbeku may depend on third-party services and infrastructure.
                            Their availability and operation may affect features of Helbeku.
                            Third-party services may have their own terms and policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            11. No Guarantee of User Behavior
                        </h2>

                        <p>
                            Helbeku cannot guarantee that every person using the platform
                            will behave honestly, respectfully, safely, or lawfully.
                        </p>

                        <p className="mt-3">
                            You are responsible for deciding what information to share,
                            whether to continue a conversation, and whether to report or
                            leave an interaction.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            12. Limitation of Responsibility
                        </h2>

                        <p>
                            To the extent permitted by applicable law, Helbeku and its
                            operators are not responsible for the independent actions,
                            statements, content, or behavior of other users.
                        </p>

                        <p className="mt-3">
                            You use Helbeku at your own discretion and should take reasonable
                            precautions when communicating with people you do not know.
                        </p>
                    </section>

                    <section>
                        <h2 className="mb-3 text-xl font-semibold text-slate-800 dark:text-slate-200">
                            13. Changes to These Terms
                        </h2>

                        <p>
                            These terms may be updated as Helbeku develops. Updated terms
                            will be published on this page with a revised effective date.
                        </p>
                    </section>

                    <section className="border-t border-slate-300 pt-8 dark:border-slate-800">
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                            If you have questions about these Terms of Service, please
                            contact Helbeku through the support or community channel
                            available on the website.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
};

export default TermsOfService;
