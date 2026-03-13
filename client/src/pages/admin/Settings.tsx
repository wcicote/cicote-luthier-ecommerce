import AdminLayout from '@/components/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Settings as SettingsIcon,
  Globe,
  Layout,
  Users,
  Save,
  RotateCcw,
  Image as ImageIcon,
  Wand2
} from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('site');
  const [isSaved, setIsSaved] = useState(false);

  const tabs = [
    { id: 'site', label: 'Informações do Site', icon: Globe },
    { id: 'layout', label: 'Layout', icon: Layout },
    { id: 'users', label: 'Usuários', icon: Users }
  ];

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <AdminLayout
      title="Configurações"
      subtitle="Gerencie as configurações gerais do site"
    >
      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Site Information Tab */}
      {activeTab === 'site' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-6">
              Informações Básicas
            </h2>

            <div className="space-y-6">
              {/* Logo */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Logo da Marca
                </label>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center">
                      <span className="text-primary-foreground font-display font-bold text-2xl">C</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-medium text-sm mb-2">
                      Fazer Upload
                    </button>
                    <p className="text-xs text-muted-foreground">
                      PNG ou SVG, máximo 2MB. Recomendado: 512x512px
                    </p>
                  </div>
                </div>
              </div>

              {/* Site Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nome da Loja
                </label>
                <input
                  type="text"
                  defaultValue="Cicote Luthier"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Descrição da Loja
                </label>
                <textarea
                  defaultValue="Cicote Luthier: Banjos artesanais sob encomenda e acessórios premium para músicos profissionais."
                  rows={3}
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Email de Contato
                  </label>
                  <input
                    type="email"
                    defaultValue="contato@cicote.com"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    defaultValue="+55 (11) 99999-9999"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  defaultValue="São Paulo, SP - Brasil"
                  className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Social Media */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Redes Sociais
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Instagram URL"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Facebook URL"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="YouTube URL"
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button variant="outline" className="border-border">
              <RotateCcw className="w-4 h-4 mr-2" />
              Descartar
            </Button>
          </div>

          {isSaved && (
            <Card className="p-4 bg-green-50 border-l-4 border-green-500">
              <p className="text-sm font-medium text-green-700">
                ✓ Alterações salvas com sucesso!
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Layout Tab */}
      {activeTab === 'layout' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-display font-semibold text-lg text-foreground mb-6">
              Personalização de Layout
            </h2>

            <div className="space-y-6">
              {/* Hero Section */}
              <div className="border-b border-border pb-6">
                <h3 className="font-semibold text-foreground mb-4">Seção Hero (Topo)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Imagem de Fundo
                    </label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <ImageIcon className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-foreground font-medium">Clique para fazer upload</p>
                      <div className="mt-3 pt-3 border-t border-border">
                        <button className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded text-xs font-medium hover:bg-primary/20 transition-colors">
                          <Wand2 className="w-3 h-3" />
                          Otimizar com IA
                        </button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Título Principal
                    </label>
                    <input
                      type="text"
                      defaultValue="Banjos Artesanais de Excelência"
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Subtítulo
                    </label>
                    <textarea
                      defaultValue="Cada instrumento é cuidadosamente fabricado à mão, combinando tradição musical com técnica contemporânea."
                      rows={2}
                      className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="border-b border-border pb-6">
                <h3 className="font-semibold text-foreground mb-4">Cores</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">
                      Cor Primária
                    </label>
                    <input
                      type="color"
                      defaultValue="#8B6F47"
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">
                      Cor Secundária
                    </label>
                    <input
                      type="color"
                      defaultValue="#D4A574"
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">
                      Cor de Fundo
                    </label>
                    <input
                      type="color"
                      defaultValue="#FFFFFF"
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-2">
                      Cor de Texto
                    </label>
                    <input
                      type="color"
                      defaultValue="#3D3D3D"
                      className="w-full h-10 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">Rodapé</h3>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Texto do Rodapé
                  </label>
                  <textarea
                    defaultValue="© 2026 Cicote Luthier. Todos os direitos reservados."
                    rows={2}
                    className="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Salvar Layout
            </Button>
            <Button variant="outline" className="border-border">
              <RotateCcw className="w-4 h-4 mr-2" />
              Descartar
            </Button>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <Card className="p-6">
          <h2 className="font-display font-semibold text-lg text-foreground mb-6">
            Gerenciamento de Usuários
          </h2>
          <p className="text-muted-foreground mb-6">
            Gerencie os usuários administradores do painel
          </p>

          <div className="space-y-4">
            {[
              { name: 'Admin Principal', email: 'admin@cicote.com', role: 'Proprietário', status: 'Ativo' },
              { name: 'João Silva', email: 'joao@cicote.com', role: 'Gerenciador', status: 'Ativo' }
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div>
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground">{user.role}</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    {user.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <Button className="mt-6 bg-primary hover:bg-primary/90 text-primary-foreground">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Usuário
          </Button>
        </Card>
      )}
    </AdminLayout>
  );
}

import { Plus } from 'lucide-react';
