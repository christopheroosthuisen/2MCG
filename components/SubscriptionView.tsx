

import React, { useState, useEffect } from 'react';
import { ScreenHeader, Card, Button, Badge } from './UIComponents';
import { COLORS, SUBSCRIPTION_PLANS, CREDIT_PACKAGES } from '../constants';
import { db } from '../services/dataService';
import { CreditTransaction, SubscriptionPlan, CreditPackage } from '../types';

const Icons = {
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Star: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>,
    CreditCard: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>,
    History: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
};

export const SubscriptionView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState<'PLANS' | 'CREDITS' | 'HISTORY'>('PLANS');
    const user = db.getUser();
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    
    useEffect(() => {
        setTransactions(db.getCreditTransactions());
    }, []);

    const handlePurchaseCredits = (pkg: CreditPackage) => {
        // In a real app, integrate Stripe/Apple Pay here
        if(confirm(`Purchase ${pkg.credits} credits for $${pkg.price}?`)) {
            db.purchaseCredits(pkg.credits, pkg.price, `${pkg.credits} Credits`);
            alert('Purchase Successful!');
        }
    };

    const handleUpdateSubscription = (plan: SubscriptionPlan) => {
        if(plan.tier === user.memberStatus) return;
        if(confirm(`Switch to ${plan.name} plan?`)) {
            db.updateSubscription(plan.tier === 'FREE' ? 'free' : plan.tier === 'PRO' ? 'premium' : 'tour');
            alert(`Switched to ${plan.name} Plan`);
        }
    };

    return (
        <div className="bg-[#F5F5F7] min-h-screen pb-32 animate-in slide-in-from-right duration-300 fixed inset-0 z-50 overflow-y-auto">
            <ScreenHeader 
                title="Membership" 
                subtitle="Account"
                leftAction={
                    <button onClick={onBack} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                }
            />

            {/* Status Card */}
            <div className="px-4 mb-6">
                <Card variant="filled" className="bg-gray-900 text-white p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                        <div className="text-9xl">💎</div>
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Plan</div>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    {user.memberStatus}
                                    {user.memberStatus !== 'FREE' && <Badge variant="warning" className="text-[10px]">Active</Badge>}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Credits</div>
                                <div className="text-3xl font-black text-orange-500">{user.credits}</div>
                            </div>
                        </div>
                        <div className="h-px bg-gray-800 w-full mb-4"></div>
                        <div className="flex gap-2">
                            <button onClick={() => setActiveTab('PLANS')} className="flex-1 bg-white/10 hover:bg-white/20 py-2 rounded-lg text-xs font-bold transition-colors">Manage Plan</button>
                            <button onClick={() => setActiveTab('CREDITS')} className="flex-1 bg-orange-600 hover:bg-orange-500 py-2 rounded-lg text-xs font-bold transition-colors">Add Credits</button>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="px-4 mb-6">
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                    {['PLANS', 'CREDITS', 'HISTORY'].map(t => (
                        <button 
                            key={t}
                            onClick={() => setActiveTab(t as any)}
                            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${activeTab === t ? 'bg-gray-900 text-white shadow' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-4 pb-12">
                {activeTab === 'PLANS' && (
                    <div className="space-y-4">
                        {SUBSCRIPTION_PLANS.map(plan => {
                            const isCurrent = user.memberStatus === plan.tier;
                            return (
                                <div key={plan.id} className={`bg-white rounded-2xl p-5 border-2 transition-all ${isCurrent ? 'border-gray-900 shadow-md' : 'border-transparent shadow-sm'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold" style={{ color: isCurrent ? plan.color : '#1F2937' }}>{plan.name}</h3>
                                            <div className="text-sm text-gray-500 font-medium">
                                                {plan.price === 0 ? 'Free Forever' : `$${plan.price}/mo`}
                                            </div>
                                        </div>
                                        {plan.isPopular && !isCurrent && <Badge variant="warning">Best Value</Badge>}
                                        {isCurrent && <div className="bg-gray-900 text-white p-1 rounded-full"><Icons.Check /></div>}
                                    </div>
                                    <ul className="space-y-2 mb-6">
                                        {plan.features.map((feat, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                                                <span className="text-green-500 text-xs">✓</span> {feat}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button 
                                        fullWidth 
                                        variant={isCurrent ? 'outline' : 'primary'} 
                                        disabled={isCurrent}
                                        onClick={() => handleUpdateSubscription(plan)}
                                        className={isCurrent ? 'border-gray-200 text-gray-400' : ''}
                                    >
                                        {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                                    </Button>
                                </div>
                            );
                        })}
                        <div className="text-center mt-6">
                            <button className="text-xs text-red-500 font-bold hover:underline">Cancel Subscription</button>
                        </div>
                    </div>
                )}

                {activeTab === 'CREDITS' && (
                    <div>
                        <div className="text-center mb-6">
                            <h3 className="font-bold text-gray-900 mb-1">Top Up Your Balance</h3>
                            <p className="text-xs text-gray-500">Credits can be used for live lessons, pro reviews, and premium content.</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {CREDIT_PACKAGES.map(pkg => (
                                <div key={pkg.id} onClick={() => handlePurchaseCredits(pkg)} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between cursor-pointer hover:border-orange-500 transition-colors group relative overflow-hidden">
                                    {pkg.popular && <div className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-xl text-orange-500 shadow-sm group-hover:scale-110 transition-transform">
                                            🪙
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg text-gray-900">{pkg.credits} Credits</div>
                                            {pkg.discount && <div className="text-xs font-bold text-green-600">{pkg.discount}</div>}
                                        </div>
                                    </div>
                                    <Button size="sm" className="px-4 h-9 min-w-[80px]">${pkg.price}</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'HISTORY' && (
                    <div className="space-y-4">
                        {transactions.map(tx => (
                            <div key={tx.id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {tx.amount > 0 ? '+' : '-'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-900">{tx.description}</div>
                                        <div className="text-xs text-gray-400">{tx.date.toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div className={`font-bold ${tx.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    {tx.amount > 0 ? '+' : ''}{tx.amount}
                                </div>
                            </div>
                        ))}
                        {transactions.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <p>No transactions yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
