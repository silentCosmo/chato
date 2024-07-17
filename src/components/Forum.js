import Head from 'next/head';
import { ChatBubbleOvalLeftIcon, UsersIcon, HeartIcon } from '@heroicons/react/24/outline';

export default function Forum() {
  return (
    <>
      <Head>
        <title>Chato Community Forum</title>
        <meta name="description" content="Join the Chato community forum to discuss, share, and connect with others!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <section className="text-center py-16 px-4 md:px-8 bg-gradient-to-r from-blue-200 to-purple-200">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-6">Welcome to the Chato Community Forum!</h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect, share, and explore with fellow Chato users. Join the conversation today!
          </p>
          <a href="/forum/create-post" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300">
            Create a New Post
          </a>
        </section>

        {/* Forum Categories Section */}
        <section className="py-16 px-4 md:px-8">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-10">Forum Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ChatBubbleOvalLeftIcon className="w-14 h-14 mx-auto text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">General Discussion</h3>
              <p className="text-gray-600 mb-4 text-center">Talk about anything and everything related to Chato!</p>
              <a href="/forum/general" className="text-blue-500 hover:underline text-center block">Join Discussion</a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <UsersIcon className="w-14 h-14 mx-auto text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Feature Requests</h3>
              <p className="text-gray-600 mb-4 text-center">Share your ideas for new features and improvements.</p>
              <a href="/forum/feature-requests" className="text-blue-500 hover:underline text-center block">Share Your Ideas</a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <HeartIcon className="w-14 h-14 mx-auto text-red-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Feedback & Support</h3>
              <p className="text-gray-600 mb-4 text-center">Get help or give feedback about your Chato experience.</p>
              <a href="/forum/feedback-support" className="text-blue-500 hover:underline text-center block">Get Help</a>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-10">Featured Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">How to Get Started on Chato</h3>
              <p className="text-gray-600 mb-4">A beginner's guide to help you make the most of Chato’s features.</p>
              <a href="/forum/post/how-to-get-started" className="text-blue-500 hover:underline">Read More</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Features on Chato</h3>
              <p className="text-gray-600 mb-4">Get a sneak peek at what’s coming to Chato!</p>
              <a href="/forum/post/upcoming-features" className="text-blue-500 hover:underline">Read More</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">How to Make New Friends on Chato</h3>
              <p className="text-gray-600 mb-4">Tips and tricks for meeting new people on Chato.</p>
              <a href="/forum/post/how-to-make-friends" className="text-blue-500 hover:underline">Read More</a>
            </div>
          </div>
        </section>

        {/* Popular Threads Section */}
        <section className="py-16 px-4 md:px-8">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-10">Popular Threads</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Thread Title 1</h3>
              <p className="text-gray-600 mb-4">Brief description of the thread. Interesting discussion happening here.</p>
              <a href="/forum/thread/1" className="text-blue-500 hover:underline">View Thread</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Thread Title 2</h3>
              <p className="text-gray-600 mb-4">Brief description of the thread. Engaging conversation with lots of replies.</p>
              <a href="/forum/thread/2" className="text-blue-500 hover:underline">View Thread</a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Thread Title 3</h3>
              <p className="text-gray-600 mb-4">Brief description of the thread. Join the discussion and share your thoughts.</p>
              <a href="/forum/thread/3" className="text-blue-500 hover:underline">View Thread</a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto text-center">
            <p className="text-gray-400 mb-4">© 2024 Chato. All rights reserved.</p>
            <div className="flex justify-center gap-6 mb-4">
              <a href="https://twitter.com/chato" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg className="w-6 h-6 text-white hover:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6.03c-.77.35-1.6.59-2.48.7a4.5 4.5 0 0 0 1.97-2.48 9.02 9.02 0 0 1-2.86 1.1 4.47 4.47 0 0 0-7.61 4.08A12.74 12.74 0 0 1 1.7 4.15a4.47 4.47 0 0 0 1.39 5.97 4.45 4.45 0 0 1-2.03-.56v.06a4.48 4.48 0 0 0 3.58 4.39 4.43 4.43 0 0 1-2.01.08 4.48 4.48 0 0 0 4.19 3.11A9.01 9.01 0 0 1 1.1 20.3a12.72 12.72 0 0 0 6.89 2.02c8.27 0 12.77-6.85 12.77-12.77 0-.2-.01-.39-.03-.59a9.05 9.05 0 0 0 2.22-2.31z"/>
                </svg>
              </a>
              <a href="https://instagram.com/chato" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="w-6 h-6 text-white hover:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.98 3H7.02C4.27 3 2 5.27 2 8.02v9.96C2 18.73 4.27 21 7.02 21h9.96c2.75 0 5.02-2.27 5.02-5.02V8.02c0-2.75-2.27-5.02-5.02-5.02zM12 17.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm3.5-9.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
