'use client';
import { Award, Star, CheckCircle, Info } from 'lucide-react';

export default function LoyaltyPage() {
  const points = 80;
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Loyalty Rewards</h1>
        
        <div className="flex flex-col md:flex-row gap-8 items-center bg-gray-50 rounded-2xl p-6 md:p-10 border border-gray-200">
          <div className="bg-gradient-to-br from-[#c89b7b] to-[#a07452] w-32 h-32 rounded-full flex items-center justify-center text-white shadow-lg shrink-0">
            <Award className="w-16 h-16" />
          </div>
          
          <div className="flex-1 text-center md:text-left w-full">
            <h2 className="text-xl font-bold text-gray-500 mb-1">Current Tier</h2>
            <div className="text-4xl font-black text-[#a07452] tracking-wider mb-2">BRONZE</div>
            <div className="text-2xl font-bold text-gray-800 mb-4">{points} <span className="text-base font-normal text-gray-500">Total Points</span></div>
            
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
              <span>BRONZE (0)</span>
              <span>SILVER (100)</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden w-full">
              <div className="h-full bg-[#a07452] rounded-full transition-all" style={{width: `${(points/100)*100}%`}}></div>
            </div>
            <p className="text-sm mt-3 text-gray-600 font-medium">Earn 20 more points to unlock Silver Tier benefits!</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Star className="text-yellow-500"/> Tier Benefits</h2>
          
          <div className="space-y-6">
            <div className="border border-[#c89b7b] rounded-xl p-4 bg-[#c89b7b]/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#c89b7b] text-white text-xs font-bold px-2 py-1 rounded-bl-lg">Current</div>
              <h3 className="font-bold text-[#a07452] text-lg mb-2">Bronze (0 - 99 pts)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#a07452] shrink-0 mt-0.5"/> Standard pickup scheduling</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-[#a07452] shrink-0 mt-0.5"/> Base prices for all scrap items</li>
              </ul>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-4 opacity-70">
              <h3 className="font-bold text-gray-600 text-lg mb-2">Silver (100 - 499 pts)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5"/> <strong>+5% bonus</strong> on total payout</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5"/> Priority pickup times</li>
              </ul>
            </div>
            
            <div className="border border-yellow-200 rounded-xl p-4 bg-yellow-50/50 opacity-70">
              <h3 className="font-bold text-yellow-600 text-lg mb-2">Gold (500+ pts)</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5"/> <strong>+10% bonus</strong> on total payout</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5"/> Exclusive VIP customer support</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5"/> Free yearly eco-friendly merchandise</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Info className="text-primary"/> How to earn points</h2>
          
          <ul className="space-y-4">
            <li className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <div className="font-bold text-gray-800">Account Registration</div>
                <div className="text-xs text-gray-500">One-time signup bonus</div>
              </div>
              <div className="text-green-500 font-bold bg-green-50 px-3 py-1 rounded-full">+50 pts</div>
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <div className="font-bold text-gray-800">Successful Pickup</div>
                <div className="text-xs text-gray-500">Per completed booking</div>
              </div>
              <div className="text-green-500 font-bold bg-green-50 px-3 py-1 rounded-full">+10 pts</div>
            </li>
            <li className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <div className="font-bold text-gray-800">Refer a Friend</div>
                <div className="text-xs text-gray-500">When they complete their first pickup</div>
              </div>
              <div className="text-green-500 font-bold bg-green-50 px-3 py-1 rounded-full">+20 pts</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
