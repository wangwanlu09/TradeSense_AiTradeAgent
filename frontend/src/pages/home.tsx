import React from 'react'
import { motion } from 'framer-motion'
import { NewsSentimentOverview } from '../widgets/layout/news_sentiment'
import { MarketTrendCard } from '../widgets/layout/market_trend'
import Footer from '../widgets/layout/footer'
type StatItem = {
  name: string
  value: string
}

const stats: StatItem[] = [
  { name: 'Analyzed News Articles', value: '120K+' },
  { name: 'Market Symbols Tracked', value: '8,500+' },
  { name: 'AI Recommendations Made', value: '25K+' },
  { name: 'Avg. Daily API Calls', value: '10,000+' },
]

export function Home() {
  return (
    <div className="relative bg-black">
      {/* Banner Section - Limited to one screen height */}
      <div className="relative isolate overflow-hidden h-screen flex items-center">
        {/* Background Image */}
        <motion.img
          alt=""
          src="https://images.unsplash.com/photo-1549421263-6064833b071b?q=80&w=3165&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 20, ease: 'easeOut' }}
          className="absolute inset-0 -z-10 w-full h-full object-cover object-center"
        />

        {/* Decorative Blur Shapes */}
        <div
          aria-hidden="true"
          className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="aspect-1097/845 w-[68.5625rem] bg-gradient-to-tr from-[#00ffcc] to-[#0099ff] opacity-20"
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="aspect-1097/845 w-[68.5625rem] bg-gradient-to-tr from-[#00ffcc] to-[#0099ff] opacity-20"
          />
        </div>

        {/* Main Banner Content */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-5xl font-bold tracking-tight text-white sm:text-7xl text-center lg:text-left mt-10">
              TradeSense
            </h2>
            <p className="mt-8 text-sm sm:text-base md:text-lg font-medium text-pretty text-gray-300 text-center lg:text-left">
              Empower your trading decisions with AI-driven insights from real-time news and market analysis.
              TradeSense helps you understand the market before it moves.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
            <dl className="mt-16 grid grid-cols-2 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4 text-center lg:text-left">
              {stats.map((stat) => (
                <div key={stat.name} className="flex flex-col-reverse items-center lg:items-start gap-1">
                  <dt className="text-base/7 text-gray-300">{stat.name}</dt>
                  <dd className="text-4xl font-semibold tracking-tight text-white">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Sentiment Analysis Section - Separate scrollable area */}
      <div className="px-6 lg:px-12 mt-16">
        <NewsSentimentOverview />
      </div>

      <div className="px-6 lg:px-12 mt-16">
        <MarketTrendCard />
      </div>

    </div>
  )
}

export default Home


