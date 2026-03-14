import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yxzjvlqzbtkjrtzcqufq.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4emp2bHF6YnRranJ0emNxdWZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzQ1MTA0MSwiZXhwIjoyMDg5MDI3MDQxfQ.aq8CXJV78s6lq1XEAD0sOd0vh6DGT8y7LS8UOQHRzaQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedDatabase() {
  console.log('🌱 Iniciando população do banco de dados...');

  try {
    // Criar categorias
    console.log('📁 Criando categorias...');
    const categoriesData = [
      {
        name: 'Acessórios',
        slug: 'acessorios',
        description: 'Acessórios premium para banjo',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/accessories-collection-VA8J7JrzAhoFDCr4MERFJi.webp',
      },
      {
        name: 'Banjos Artesanais',
        slug: 'banjos-artesanais',
        description: 'Banjos fabricados sob encomenda',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/custom-order-showcase-GBynxkWxfAa5rQEtaDBitT.webp',
      },
    ];

    const { data: categories, error: catError } = await supabase
      .from('categories')
      .insert(categoriesData)
      .select();

    if (catError) {
      console.error('❌ Erro ao criar categorias:', catError);
      return;
    }

    console.log('✅ Categorias criadas:', categories?.length);

    // Criar produtos
    console.log('🛍️ Criando produtos...');
    const productsData = [
      {
        categoryId: categories[0].id,
        name: 'Cordas Premium Nylon',
        slug: 'cordas-premium-nylon',
        description: 'Jogo completo de cordas de nylon de alta qualidade',
        price: '89.90',
        originalPrice: '129.90',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/accessories-collection-VA8J7JrzAhoFDCr4MERFJi.webp',
        stock: 50,
        sku: 'CORDAS-001',
        material: 'Nylon',
        isCustomOrder: 0,
      },
      {
        categoryId: categories[0].id,
        name: 'Correia de Couro Artesanal',
        slug: 'correia-couro-artesanal',
        description: 'Correia de couro legítimo com acabamento manual',
        price: '149.90',
        originalPrice: '199.90',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/materials-detail-CCoKXjY6bpfty3TMbAQMAK.webp',
        stock: 30,
        sku: 'CORREIA-001',
        material: 'Couro',
        isCustomOrder: 0,
      },
      {
        categoryId: categories[0].id,
        name: 'Ponte de Madeira Maciça',
        slug: 'ponte-madeira-macica',
        description: 'Ponte esculpida em madeira de primeira qualidade',
        price: '79.90',
        originalPrice: '119.90',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/accessories-collection-VA8J7JrzAhoFDCr4MERFJi.webp',
        stock: 40,
        sku: 'PONTE-001',
        material: 'Madeira',
        isCustomOrder: 0,
      },
      {
        categoryId: categories[0].id,
        name: 'Cravijas de Latão Polido',
        slug: 'cravijas-latao-polido',
        description: 'Jogo de 5 cravijas de latão polido com acabamento premium',
        price: '199.90',
        originalPrice: '299.90',
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/materials-detail-CCoKXjY6bpfty3TMbAQMAK.webp',
        stock: 25,
        sku: 'CRAVIJAS-001',
        material: 'Latão',
        isCustomOrder: 0,
      },
      {
        categoryId: categories[1].id,
        name: 'Banjo Clássico Walnut',
        slug: 'banjo-classico-walnut',
        description: 'Banjo artesanal sob encomenda em madeira de nogueira',
        price: '2890.00',
        originalPrice: null,
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/custom-order-showcase-GBynxkWxfAa5rQEtaDBitT.webp',
        stock: 5,
        sku: 'BANJO-WALNUT-001',
        material: 'Nogueira',
        isCustomOrder: 1,
      },
      {
        categoryId: categories[1].id,
        name: 'Banjo Maple Claro',
        slug: 'banjo-maple-claro',
        description: 'Banjo artesanal sob encomenda em madeira de bordo',
        price: '2890.00',
        originalPrice: null,
        image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663431106071/iehPagMtD3SZC9NuGcFbDT/custom-order-showcase-GBynxkWxfAa5rQEtaDBitT.webp',
        stock: 5,
        sku: 'BANJO-MAPLE-001',
        material: 'Bordo',
        isCustomOrder: 1,
      },
    ];

    const { data: products, error: prodError } = await supabase
      .from('products')
      .insert(productsData)
      .select();

    if (prodError) {
      console.error('❌ Erro ao criar produtos:', prodError);
      return;
    }

    console.log('✅ Produtos criados:', products?.length);

    // Criar configurações do site
    console.log('⚙️ Criando configurações do site...');
    const settingsData = [
      { key: 'site_name', value: 'Cicote Luthier' },
      { key: 'site_description', value: 'Banjos artesanais e acessórios premium' },
      { key: 'site_email', value: 'contato@cicote.com' },
      { key: 'site_phone', value: '+55 (11) 99999-9999' },
      { key: 'site_address', value: 'São Paulo, SP - Brasil' },
      { key: 'default_shipping_method', value: 'super_frete' },
      { key: 'theme_primary_color', value: '#8B6F47' },
      { key: 'theme_secondary_color', value: '#D4A574' },
    ];

    const { error: settingsError } = await supabase
      .from('site_settings')
      .insert(settingsData);

    if (settingsError) {
      console.error('❌ Erro ao criar configurações:', settingsError);
      return;
    }

    console.log('✅ Configurações criadas');

    console.log('\n🎉 Banco de dados populado com sucesso!');
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

seedDatabase();
