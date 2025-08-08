
import React from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Users, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen bg-gray-50 pt-24 pb-18">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe est là pour répondre à toutes vos questions. 
            N'hésitez pas à nous contacter !
          </p>
        </div>

        {/* Section conseiller - Style CRM */}
        <div className="mb-12">
          <Card className="p-8 bg-gradient-to-br from-pink-50 to-purple-50 border-2 border-pink-200">
            <div className="text-center mb-8">
              <Users className="h-12 w-12 text-pink-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Une question ?</h2>
              <p className="text-xl text-gray-600 mb-6">Parlez-en avec un conseiller</p>
              <p className="text-gray-500">Nos conseillers sont disponibles pour vous accompagner dans votre projet de formation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Option Mail */}
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-pink-300">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Par Email</h3>
                <p className="text-gray-600 text-sm mb-4">Réponse sous 2h en moyenne</p>
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un email
                </Button>
                <p className="text-xs text-gray-500 mt-2">conseiller@learneezy.com</p>
              </Card>

              {/* Option Chat */}
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-purple-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chat en Direct</h3>
                <p className="text-gray-600 text-sm mb-4">Réponse immédiate</p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Démarrer le chat
                </Button>
                <p className="text-xs text-gray-500 mt-2">Lun-Ven: 9h-18h</p>
              </Card>

              {/* Option Téléphone */}
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-orange-300">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Par Téléphone</h3>
                <p className="text-gray-600 text-sm mb-4">Échange personnalisé</p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler maintenant
                </Button>
                <p className="text-xs text-gray-500 mt-2">+33 1 23 45 67 89</p>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-white rounded-full border border-gray-200">
                <Headphones className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-gray-700">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Votre prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Votre nom"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option>Question générale</option>
                  <option>Support technique</option>
                  <option>Problème de paiement</option>
                  <option>Suggestion</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Décrivez votre demande..."
                ></textarea>
              </div>

              <Button className="w-full bg-pink-600 hover:bg-pink-700">
                <Send className="h-4 w-4 mr-2" />
                Envoyer le message
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                    <Mail className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">contact@Learneezy.com</p>
                    <p className="text-gray-600">support@Learneezy.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <Phone className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Téléphone</h3>
                    <p className="text-gray-600">+33 1 23 45 67 89</p>
                    <p className="text-gray-600">+33 6 12 34 56 78</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Adresse</h3>
                    <p className="text-gray-600">123 Rue de la Formation</p>
                    <p className="text-gray-600">75001 Paris, France</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Horaires</h3>
                    <p className="text-gray-600">Lun - Ven : 9h00 - 18h00</p>
                    <p className="text-gray-600">Sam : 10h00 - 16h00</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQ Rapide</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Puis-je obtenir un remboursement ?</h3>
                  <p className="text-gray-600 text-sm">Oui, nous offrons une garantie de remboursement de 30 jours.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Comment accéder à mes cours ?</h3>
                  <p className="text-gray-600 text-sm">Connectez-vous à votre compte et accédez à votre tableau de bord.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Les certificats sont-ils reconnus ?</h3>
                  <p className="text-gray-600 text-sm">Oui, nos certificats sont reconnus par de nombreuses entreprises.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
