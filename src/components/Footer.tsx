
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <h2 className="text-2xl font-bold text-white">Learneezy</h2>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li><a href="#accueil" className="text-gray-400 hover:text-white transition-colors">{t('footer.home')}</a></li>
              <li><a href="#cours" className="text-gray-400 hover:text-white transition-colors">{t('footer.courses')}</a></li>
              <li><a href="#apropos" className="text-gray-400 hover:text-white transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.instructors')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.blog')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.careers')}</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t('footer.categories')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.webDevelopment')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.ai')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.svp')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.digitalMarketing')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.cybersecurity')}</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">{t('footer.dataScience')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-6">{t('footer.contact')}</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-pink-400 flex-shrink-0" />
                <span className="text-gray-400">{t('footer.address')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-pink-400 flex-shrink-0" />
                <a href="mailto:contact@Learneezy.fr" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.email')}
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-pink-400 flex-shrink-0" />
                <a href="tel:+33123456789" className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.phone')}
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-bold mb-3">{t('footer.subscribe')}</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-white"
                />
                <button className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-r-lg transition-colors">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-16 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-gray-400">
                {t('footer.copyright')}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <ul className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t('footer.privacyPolicy')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t('footer.termsOfUse')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t('footer.cookies')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    {t('footer.support')}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
