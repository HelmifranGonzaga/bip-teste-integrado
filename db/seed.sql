INSERT INTO USUARIO (USERNAME, PASSWORD, NOME, ROLE, ATIVO, VERSION) VALUES
('admin', '$2a$10$2SvYwjv.XXLL/pMp7jWvpuR58HkhjT.V4kJaN/9ZnA6T/V6PbbL6q', 'Administrador', 'ADMIN', TRUE, 0);

INSERT INTO BENEFICIO (NOME, DESCRICAO, CNPJ, VALOR, ATIVO, VERSION) VALUES
('Vale Alimentação', 'Auxílio para compras em supermercados', '12ABC34501DE35', 850.00, TRUE, 0),
('Vale Refeição', 'Auxílio para refeições diárias', NULL, 900.00, TRUE, 0),
('Plano de Saúde', 'Cobertura médica nacional', NULL, 1200.00, TRUE, 0),
('Plano Odontológico', 'Cobertura odontológica completa', NULL, 150.00, TRUE, 0),
('Auxílio Creche', 'Ajuda de custo para filhos até 5 anos', NULL, 450.00, TRUE, 0),
('Vale Transporte', 'Auxílio para deslocamento', NULL, 300.00, TRUE, 0),
('Auxílio Home Office', 'Ajuda de custo para internet e energia', NULL, 250.00, TRUE, 0),
('Gympass', 'Acesso a academias parceiras', NULL, 100.00, TRUE, 0),
('Seguro de Vida', 'Seguro de vida em grupo', NULL, 80.00, TRUE, 0),
('Bolsa Educação', 'Auxílio para cursos e graduação', NULL, 600.00, TRUE, 0),
('Participação nos Lucros', 'PLR anual', NULL, 5000.00, TRUE, 0),
('Auxílio Farmácia', 'Desconto em medicamentos', NULL, 50.00, TRUE, 0),
('Previdência Privada', 'Plano de aposentadoria complementar', NULL, 400.00, TRUE, 0),
('Auxílio Lente', 'Ajuda para compra de óculos de grau', NULL, 350.00, FALSE, 0),
('Day Off Aniversário', 'Folga remunerada no dia do aniversário', NULL, 0.00, TRUE, 0),
('Auxílio Casamento', 'Bônus para recém-casados', NULL, 1000.00, FALSE, 0),
('Licença Paternidade Estendida', '20 dias de licença paternidade', NULL, 0.00, TRUE, 0),
('Licença Maternidade Estendida', '6 meses de licença maternidade', NULL, 0.00, TRUE, 0),
('Auxílio Pet', 'Ajuda de custo para despesas veterinárias', NULL, 120.00, FALSE, 0),
('Bônus de Indicação', 'Bônus por indicação de novos talentos', NULL, 1500.00, TRUE, 0);
