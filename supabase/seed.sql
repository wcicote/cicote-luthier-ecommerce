-- =============================================
-- Cicote Luthier - Seed Data
-- 5 produtos de exemplo + categorias
-- =============================================

-- Inserir categorias
INSERT INTO categories (id, name, slug, description, image_url) VALUES
  ('a1b2c3d4-0001-0000-0000-000000000001', 'Banjos', 'banjos', 'Banjos artesanais fabricados sob encomenda', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800'),
  ('a1b2c3d4-0002-0000-0000-000000000002', 'Cordas e Acessórios', 'acessorios', 'Cordas, palhetas, correia e outros acessórios para banjo', 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800'),
  ('a1b2c3d4-0003-0000-0000-000000000003', 'Peças e Ferragens', 'pecas', 'Peças avulsas e ferragens para manutenção e personalização', 'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800')
ON CONFLICT DO NOTHING;

-- Inserir produtos
INSERT INTO products (id, name, description, price, original_price, image_url, stock, category_id, is_active, featured, slug, especificacoes, imagens) VALUES
  (
    'p1000000-0001-0000-0000-000000000001',
    'Banjo Artesanal Walnut 5 Cordas',
    'Banjo de 5 cordas fabricado artesanalmente com madeira de nogueira (walnut) selecionada. Acabamento natural com verniz de alta proteção UV. Ideal para bluegrass e música caipira.',
    2890.00,
    3200.00,
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800',
    3,
    'a1b2c3d4-0001-0000-0000-000000000001',
    TRUE,
    TRUE,
    'banjo-artesanal-walnut-5-cordas',
    '{"material": "Nogueira Americana", "diametro": "11 polegadas", "cordas": "5 cordas", "acabamento": "Verniz natural UV", "peso": "2.8 kg", "garantia": "Vitalícia", "prazo_fabricacao": "8-12 semanas"}',
    '["https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800", "https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=800"]'
  ),
  (
    'p1000000-0002-0000-0000-000000000002',
    'Banjo Tenor Maple 4 Cordas',
    'Banjo tenor de 4 cordas, perfeito para jazz e música irlandesa. Construído com maple (bordo) envelhecido para timbre rico e ressonante. Inclui estojo semi-rígido.',
    2350.00,
    NULL,
    'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=800',
    2,
    'a1b2c3d4-0001-0000-0000-000000000001',
    TRUE,
    FALSE,
    'banjo-tenor-maple-4-cordas',
    '{"material": "Maple Envelhecido", "diametro": "10.5 polegadas", "cordas": "4 cordas", "acabamento": "Mogno natural", "peso": "2.5 kg", "garantia": "2 anos", "prazo_fabricacao": "6-10 semanas"}',
    '["https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=800"]'
  ),
  (
    'p1000000-0003-0000-0000-000000000003',
    'Cordas Premium Nylon para Banjo - Jogo Completo',
    'Jogo completo de cordas de nylon premium para banjo de 5 cordas. Alta durabilidade com timbre brilhante e definido. Fabricação nacional, aprovada por luthiers profissionais.',
    89.90,
    NULL,
    'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
    50,
    'a1b2c3d4-0002-0000-0000-000000000002',
    TRUE,
    TRUE,
    'cordas-premium-nylon-banjo',
    '{"material": "Nylon de alta resistencia", "compatibilidade": "Banjo 5 cordas", "bitola": "0.009 a 0.030", "origem": "Nacional"}',
    '["https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800"]'
  ),
  (
    'p1000000-0004-0000-0000-000000000004',
    'Correia de Couro Artesanal para Banjo',
    'Correia artesanal confeccionada em couro genuíno curtido ao tanino. Regulagem de 95cm a 140cm. Bordado exclusivo com motivos musicais. Fabricada à mão no Brasil.',
    149.90,
    189.90,
    'https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800',
    15,
    'a1b2c3d4-0002-0000-0000-000000000002',
    TRUE,
    FALSE,
    'correia-couro-artesanal-banjo',
    '{"material": "Couro genuino curtido ao tanino", "comprimento": "95cm a 140cm (regulavel)", "largura": "4cm", "fixacao": "Presilha metalica niquelada", "origem": "Nacional artesanal"}',
    '["https://images.unsplash.com/photo-1558008258-3256797b43f3?w=800"]'
  ),
  (
    'p1000000-0005-0000-0000-000000000005',
    'Capotraste para Banjo - Liga de Alumínio',
    'Capotraste profissional em liga de alumínio resistente à corrosão. Encaixe rápido e preciso, sem desafinar o instrumento. Compatível com escalas de banjo padrão de 5 cordas.',
    59.90,
    NULL,
    'https://images.unsplash.com/photo-1461748074721-5b1f11a31e83?w=800',
    30,
    'a1b2c3d4-0003-0000-0000-000000000003',
    TRUE,
    FALSE,
    'capotraste-banjo-aluminio',
    '{"material": "Liga de aluminio", "acabamento": "Niquelado", "compatibilidade": "Banjo 5 cordas, escala padrao", "peso": "45g", "inclui": "Bolsa de protecao"}',
    '["https://images.unsplash.com/photo-1461748074721-5b1f11a31e83?w=800"]'
  )
ON CONFLICT DO NOTHING;
