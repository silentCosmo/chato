import Head from 'next/head';
import { ChatBubbleOvalLeftIcon, VideoCameraIcon, ShieldCheckIcon, CalendarDaysIcon, StarIcon } from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <>
      <Head>
        <title>Chato - Connect with New People</title>
        <meta name="description" content="Chato - Start chatting with new people. Text messaging now, video calls coming soon!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 min-h-screen">
        {/* Hero Section */}
        <section className="text-center py-16 px-4 md:px-8">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-6 animate-fade-in text-shadow">Connect with New People, One Chat at a Time!</h1>
          <p className="text-xl text-gray-600 mb-8">Start with text messaging now. Video calls coming soon!</p>
          <a href="/chat" className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-full font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300">Start Chatting</a>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 md:px-8">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-10">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {/* Text Chat Feature */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ChatBubbleOvalLeftIcon className="w-14 h-14 mx-auto text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Text Chat</h3>
              <p className="text-gray-600 mb-4">Meet new people through simple text conversations. It’s easy and fun!</p>
            </div>
            {/* Video Calls Coming Soon */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <VideoCameraIcon className="w-14 h-14 mx-auto text-gray-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Coming Soon: Video Calls</h3>
              <p className="text-gray-600 mb-4">Get ready for face-to-face conversations with video calls, coming soon!</p>
            </div>
            {/* Safe Environment */}
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <ShieldCheckIcon className="w-14 h-14 mx-auto text-blue-500 mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Safe Environment</h3>
              <p className="text-gray-600 mb-4">Enjoy a safe and secure chatting experience with easy moderation tools.</p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 py-16 px-4 md:px-8 rounded-lg mb-16">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <ChatBubbleOvalLeftIcon className="w-14 h-14 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Connect</h3>
              <p className="text-gray-600">Start a chat with someone new. It's that easy!</p>
            </div>
            <div className="text-center">
              <ChatBubbleOvalLeftIcon className="w-14 h-14 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Chat</h3>
              <p className="text-gray-600">Enjoy a text conversation with new friends.</p>
            </div>
            <div className="text-center">
              <CalendarDaysIcon className="w-14 h-14 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Video Calls Coming Soon</h3>
              <p className="text-gray-600">Stay tuned for our upcoming video call feature!</p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 md:px-8">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-10">Why Choose Chato?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <StarIcon className="w-14 h-14 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Instant Connections</h3>
              <p className="text-gray-600">Connect with new people instantly, no sign-up required.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <StarIcon className="w-14 h-14 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Safe and Fun</h3>
              <p className="text-gray-600">Enjoy a secure and fun chatting experience with robust moderation tools.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <StarIcon className="w-14 h-14 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">New Features Ahead</h3>
              <p className="text-gray-600">Exciting new features, like video calls, are on the way!</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-50 py-16 px-4 md:px-8 rounded-lg mb-16">
          <h2 className="text-4xl font-semibold text-gray-800 text-center mb-10">What Users Are Saying</h2>
          <div className="flex flex-col space-y-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"Chato is amazing! I love how easy it is to start chatting with new people. The text chat feature is super fun!"</p>
              <p className="font-semibold text-gray-800">Alex M.</p>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"I’m excited for the video call feature! The text chat has been great so far, and I can’t wait to try the new features!"</p>
              <p className="font-semibold text-gray-800">Jamie L.</p>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-gray-600 mb-4">"Chato makes it so easy to meet new people. I feel safe and enjoy every chat session!"</p>
              <p className="font-semibold text-gray-800">Morgan P.</p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center py-16 px-4 md:px-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white mb-16">
          <h2 className="text-3xl font-semibold mb-4">Ready to Make New Connections?</h2>
          <p className="text-lg mb-6">Join Chato today and start chatting with people from around the world!</p>
          <a href="/chat" className="inline-block bg-white text-blue-600 py-3 px-6 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-100 transition duration-300">Start Chatting</a>
        </section>

        {/* Footer */}
        <footer className="bg-gray-800 py-8">
          <div className="container mx-auto text-center text-white">
            <p className="mb-4">© 2024 Chato. All rights reserved.</p>
            <div className="flex justify-center space-x-6">
              <a href="https://twitter.com/chato" target="_blank" rel="noopener noreferrer">
                <svg className="w-6 h-6 text-white hover:text-blue-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.95 4.57c-.8.36-1.66.61-2.56.71.92-.55 1.62-1.43 1.95-2.48-.86.51-1.81.89-2.82 1.1a4.89 4.89 0 00-8.31 4.48c-4.07-.2-7.68-2.15-10.08-5.12a4.85 4.85 0 00-.66 2.47c0 1.7.87 3.21 2.19 4.09a4.85 4.85 0 01-2.21-.61v.06c0 2.38 1.69 4.37 3.93 4.82-.41.11-.84.17-1.28.17-.31 0-.62-.03-.92-.09.62 1.95 2.43 3.38 4.57 3.42a9.79 9.79 0 01-6.07 2.1c-.39 0-.78-.02-1.17-.07a13.84 13.84 0 007.48 2.19c8.97 0 13.89-7.44 13.89-13.89 0-.21-.01-.42-.02-.63a9.89 9.89 0 002.43-2.54z"/>
                </svg>
              </a>
              <a href="https://instagram.com/chato" target="_blank" rel="noopener noreferrer">
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
