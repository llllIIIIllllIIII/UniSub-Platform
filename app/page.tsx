'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Users, Building2, Zap, Shield, TrendingUp, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';
import { PrimaryButton, SecondaryButton } from '../components/buttons';
import PageTransition, { SlideIn } from '../components/PageTransition';
import { useLanguage } from '../lib/LanguageContext';

export default function HomePage() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleProviderClick = () => {
    router.push('/provider');
  };

  const handleConsumerClick = () => {
    router.push('/consumer');
  };

  return (
    <PageTransition>
      <div className="min-h-screen gradient-bg dark:bg-dark-bg transition-all duration-500">
        <Navbar />
        
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* 背景裝飾 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 rounded-full blur-3xl animate-float" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-brand-light-blue/20 to-brand-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="max-w-7xl mx-auto text-center relative z-10">
            <SlideIn delay={200}>
              <div className="mb-12 animate-fade-in">
                {/* 主要標語 - 現在是主標題 */}
                <div className="relative mb-8">
                  <h1 className="slogan-text">
                    THE FUTURE OF SUBSCRIPTION<br />
                    NFT ACCESS PASS
                  </h1>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-brand-purple to-brand-blue rounded-full animate-bounce-slow">
                    <Sparkles size={20} className="text-white" />
                  </div>
                </div>
                
                <p className="text-fluid-lg text-gray-600 dark:text-dark-text-secondary max-w-4xl mx-auto mb-12 leading-relaxed">
                  {t('home.subtitle')}
                </p>
              </div>
            </SlideIn>

            {/* Main Action Buttons */}
            <SlideIn delay={400}>
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20 animate-slide-up">
                <div className="group hover-lift flex flex-col items-center text-center w-full sm:w-auto sm:max-w-sm">
                  <PrimaryButton 
                    onClick={handleConsumerClick}
                    className="text-fluid-lg px-16 py-6 flex items-center justify-center space-x-4 w-full sm:w-auto mx-auto"
                  >
                    <Users size={28} />
                    <span>{t('home.forConsumers')}</span>
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </PrimaryButton>
                  <p className="text-fluid-sm text-gray-500 dark:text-dark-text-secondary mt-3 px-2 leading-relaxed min-h-[3rem] flex items-center justify-center text-center max-w-xs">{t('home.consumers.desc')}</p>
                </div>

                <div className="group hover-lift flex flex-col items-center text-center w-full sm:w-auto sm:max-w-sm">
                  <SecondaryButton 
                    onClick={handleProviderClick}
                    className="text-fluid-lg px-16 py-6 flex items-center justify-center space-x-4 w-full sm:w-auto mx-auto"
                  >
                    <Building2 size={28} />
                    <span>{t('home.forProviders')}</span>
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </SecondaryButton>
                  <p className="text-fluid-sm text-gray-500 dark:text-dark-text-secondary mt-3 px-2 leading-relaxed min-h-[3rem] flex items-center justify-center text-center max-w-xs">{t('home.providers.desc')}</p>
                </div>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-dark-surface/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <SlideIn delay={600}>
              <div className="text-center mb-20">
                <h2 className="text-fluid-3xl font-bold text-brand-dark dark:text-dark-text mb-6">
                  {t('home.features.title')}
                </h2>
                <p className="text-fluid-lg text-gray-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
                  {t('home.features.description')}
                </p>
              </div>
            </SlideIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Feature 1 */}
              <SlideIn delay={800} direction="up">
                <div className="card text-center group hover-lift">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-purple to-brand-blue rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp size={40} className="text-white" />
                  </div>
                  <h3 className="text-fluid-xl font-bold text-brand-dark dark:text-dark-text mb-6">Transferable Assets</h3>
                  <p className="text-gray-600 dark:text-dark-text-secondary text-fluid-base">
                    Turn unused subscriptions into value. Transfer or sell your NFT subscriptions when you no longer need them.
                  </p>
                </div>
              </SlideIn>

              {/* Feature 2 */}
              <SlideIn delay={1000} direction="up">
                <div className="card text-center group hover-lift">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-blue to-brand-light-blue rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Shield size={40} className="text-white" />
                  </div>
                  <h3 className="text-fluid-xl font-bold text-brand-dark dark:text-dark-text mb-6">Complete Control</h3>
                  <p className="text-gray-600 dark:text-dark-text-secondary text-fluid-base">
                    Manage all your subscriptions in one place. No more forgotten renewals or wasted money on unused services.
                  </p>
                </div>
              </SlideIn>

              {/* Feature 3 */}
              <SlideIn delay={1200} direction="up">
                <div className="card text-center group hover-lift">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand-light-blue to-brand-purple rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Zap size={40} className="text-white" />
                  </div>
                  <h3 className="text-fluid-xl font-bold text-brand-dark dark:text-dark-text mb-6">Web3 Innovation</h3>
                  <p className="text-gray-600 dark:text-dark-text-secondary text-fluid-base">
                    Built on blockchain technology for transparency, security, and true ownership of your subscription rights.
                  </p>
                </div>
              </SlideIn>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <SlideIn delay={1400}>
              <div className="bg-gradient-to-r from-brand-purple to-brand-blue dark:from-brand-purple/90 dark:to-brand-blue/90 rounded-3xl p-12 text-white text-center glass-effect">
                <h2 className="text-fluid-2xl font-bold mb-12">Platform Stats (Demo)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="group">
                    <div className="text-fluid-4xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">$50K+</div>
                    <div className="text-white/80 text-fluid-base">Total Subscription Value</div>
                  </div>
                  <div className="group">
                    <div className="text-fluid-4xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">1,234</div>
                    <div className="text-white/80 text-fluid-base">Active NFT Subscriptions</div>
                  </div>
                  <div className="group">
                    <div className="text-fluid-4xl font-bold mb-4 group-hover:scale-110 transition-transform duration-300">456</div>
                    <div className="text-white/80 text-fluid-base">Successful Transfers</div>
                  </div>
                </div>
              </div>
            </SlideIn>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 bg-brand-bg/30 dark:bg-dark-surface/30">
          <div className="max-w-5xl mx-auto text-center">
            <SlideIn delay={1600}>
              <h2 className="text-fluid-3xl font-bold text-brand-dark dark:text-dark-text mb-8">
                Ready to Transform Your Subscriptions?
              </h2>
              <p className="text-fluid-lg text-gray-600 dark:text-dark-text-secondary mb-12 max-w-3xl mx-auto">
                Join the future of subscription management with NFT technology. 
                Start browsing available subscription NFTs or learn how to list your own.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="group hover-lift">
                  <PrimaryButton 
                    onClick={handleConsumerClick}
                    className="text-fluid-lg px-12 py-6 w-full sm:w-auto min-w-[200px] justify-center"
                  >
                    Browse Subscriptions
                  </PrimaryButton>
                </div>
                <div className="group hover-lift">
                  <SecondaryButton 
                    onClick={handleProviderClick}
                    className="text-fluid-lg px-12 py-6 w-full sm:w-auto min-w-[200px] justify-center"
                  >
                    List Your Service
                  </SecondaryButton>
                </div>
              </div>
            </SlideIn>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
}