import React from 'react';
import {
  FaCogs,
  FaBullhorn,
  FaUsers,
  FaShareAlt,
} from 'react-icons/fa';

const AboutSection = () => {
  return (
    <section
  id="about"
  className="
    relative overflow-hidden
    py-24 px-4 sm:px-6
    bg-gradient-to-t
    from-gray-50 via-gray-100 to-gray-200
    dark:from-slate-900 dark:via-slate-900 dark:to-slate-950
  "
>
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Intro */}
        <div className="max-w-3xl">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-blue-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500 dark:text-blue-400">
              About Helbeku
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-300 sm:text-5xl">
            A place to{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
              simply talk.
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Helbeku was created with a simple idea: sometimes you just want to
            talk to someone new. No profiles to build, no follower counts,
            no complicated social rules. Just people, conversations, and a
            little curiosity.
          </p>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400 sm:text-base">
            Whether you are bored, looking for a fresh perspective, curious
            about people from different places, or simply want a random
            conversation, Helbeku gives you a simple way to connect.
          </p>
        </div>

        {/* Story / principles */}
        <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Since 2024
            </p>

            <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-300 sm:text-3xl">
              Built for conversations,
              <br />
              not profiles.
            </h3>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-600 dark:text-slate-400">
              Helbeku first appeared in 2024 with the goal of making meeting
              someone new feel effortless. It has continued to evolve while
              keeping that original idea at its center.
            </p>
          </div>

          <div className="border-l border-slate-200 pl-6 dark:border-slate-800 sm:pl-10">
            <div className="space-y-9">
              <div className="group flex gap-5">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-300 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-950/40 dark:group-hover:text-blue-400">
                  <FaBullhorn className="text-sm" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    The idea
                  </h4>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Create a place where starting a conversation is easier
                    than creating an account.
                  </p>
                </div>
              </div>

              <div className="group flex gap-5">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-300 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-950/40 dark:group-hover:text-blue-400">
                  <FaUsers className="text-sm" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    The connection
                  </h4>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Match through shared interests and discover conversations
                    that you probably would not have had otherwise.
                  </p>
                </div>
              </div>

              <div className="group flex gap-5">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-300 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-950/40 dark:group-hover:text-blue-400">
                  <FaCogs className="text-sm" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Always evolving
                  </h4>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Helbeku is still growing. New ideas, improvements, and
                    features are part of the journey.
                  </p>
                </div>
              </div>

              <div className="group flex gap-5">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-300 text-slate-500 transition-colors group-hover:bg-blue-50 group-hover:text-blue-500 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-blue-950/40 dark:group-hover:text-blue-400">
                  <FaShareAlt className="text-sm" />
                </div>

                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                    Built with people
                  </h4>
                  <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                    Feedback and ideas from the community help shape where
                    Helbeku goes next.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing statement */}
        <div className="mt-24 border-t border-slate-200 pt-10 dark:border-slate-800">
          <p className="max-w-3xl text-lg font-medium leading-8 text-slate-700 dark:text-slate-300 sm:text-xl">
            No sign-up. No pressure. Just a chance to meet someone you would
            probably never have met otherwise.
          </p>

          <p className="mt-4 text-sm text-slate-400 dark:text-slate-500">
            Helbeku · Connecting people since 2024
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;