import React from 'react'

const SponsoredAds = ({ sponsoredImg }) => {
  return (
    <div className="bg-white rounded-xl p-3 shadow-md mt-4 mb-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Sponsored</h2>
      <div className="space-y-2">
        <img src={sponsoredImg} alt="" className="w-full h-auto rounded-md" />
        <div className="text-sm font-semibold">Email Marketing</div>
        <div className="text-sm text-gray-600">Supercharge your marketing with a powerful email strategy, easy to use platform built for results.</div>
      </div>
    </div>
  )
}

export default SponsoredAds
