-- Criação do banco de dados
drop database studyfy;
create DATABASE StudyFy;

USE StudyFy;


-- CRIAÇÃO DE TABELAS --

-- Tabela tbl_mentor
CREATE TABLE tbl_mentor (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    data_ingresso TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tbl_imagens_usuario (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome_imagem VARCHAR(255) NOT NULL, -- Nome ou título da imagem
    caminho_imagem VARCHAR(500) NOT NULL -- URL para o arquivo de imagem
);

CREATE TABLE tbl_imagens_grupo_mentoria (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome_imagem VARCHAR(255) NOT NULL, -- Nome ou título da imagem
    caminho_imagem VARCHAR(500) NOT NULL -- URL para o arquivo de imagem
);

-- Tabela tbl_grupo_mentoria
CREATE TABLE tbl_grupo_mentoria (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(30) NOT NULL,
    capacidade INT NOT NULL,
    descricao TINYTEXT,
    materia varchar (256) NOT NULL,
    serie_min INT,
    serie_max INT,
    imagem_id INT, -- ID da imagem do grupo de mentoria
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    mentor_id INT NOT NULL,
    FOREIGN KEY (imagem_id) REFERENCES tbl_imagens_grupo_mentoria(id),
    FOREIGN KEY (mentor_id) REFERENCES tbl_mentor(id)
);

-- Tabela tbl_atividade_grupo_mentoria
CREATE TABLE tbl_atividade_grupo_mentoria (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(100) NOT NULL,
    descricao TINYTEXT NOT NULL,
    grupo_mentoria_id INT NOT NULL,
    FOREIGN KEY (grupo_mentoria_id) REFERENCES tbl_grupo_mentoria(id)
);

-- Tabela tbl_tipo_questao
CREATE TABLE tbl_tipo_questao (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    tipo_questao VARCHAR(45) NOT NULL
);

-- Tabela tbl_questao
CREATE TABLE tbl_questao (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    enunciado VARCHAR(45) NOT NULL,
    tipo_questao_id INT NOT NULL,
    imagem VARCHAR(300),
    atividade_grupo_mentoria_id INT NOT NULL,
    FOREIGN KEY (atividade_grupo_mentoria_id) REFERENCES tbl_atividade_grupo_mentoria(id),
    FOREIGN KEY (tipo_questao_id) REFERENCES tbl_tipo_questao(id)
);

-- Tabela tbl_resposta_lacunas
CREATE TABLE tbl_resposta_lacunas (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    posicao_inicial INT NOT NULL,
    posicao_fim INT NOT NULL,
    questao_id INT NOT NULL,
    palavra VARCHAR(45),
    FOREIGN KEY (questao_id) REFERENCES tbl_questao(id)
);

-- Tabela tbl_resposta_verdadeiro_falso
CREATE TABLE tbl_resposta_verdadeiro_falso (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    autenticacao TINYINT NOT NULL,
    questao_id INT NOT NULL,
    conteudo VARCHAR(45),
    FOREIGN KEY (questao_id) REFERENCES tbl_questao(id)
);

-- Tabela tbl_resposta_correspondencia
CREATE TABLE tbl_resposta_correspondencia (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    palavra_correspondente VARCHAR(45) NOT NULL,
    resposta_correspondente VARCHAR(45) NOT NULL,
    questao_id INT NOT NULL,
    FOREIGN KEY (questao_id) REFERENCES tbl_questao(id)
);

-- Tabela tbl_resposta_multipla_escolha
CREATE TABLE tbl_resposta_multipla_escolha (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    conteudo TINYTEXT NOT NULL,
    autenticacao TINYINT NOT NULL,
    questao_id INT NOT NULL,
    FOREIGN KEY (questao_id) REFERENCES tbl_questao(id)
);

-- Tabela tbl_ordem_palavra
CREATE TABLE tbl_ordem_palavra (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    posicao INT NOT NULL,
    questao_id INT NOT NULL,
    conteudo VARCHAR(45) NOT NULL,
    FOREIGN KEY (questao_id) REFERENCES tbl_questao(id)
);

-- Tabela tbl_materias
CREATE TABLE tbl_materias (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome_materia VARCHAR(90) NOT NULL
);

-- Criação da tabela ranks
CREATE TABLE  tbl_ranks(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    nivel INT NOT NULL,
    num_salas INT NOT NULL
);




-- Criação da tabela tbl_temporadas
CREATE TABLE tbl_temporadas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_inicio DATE NOT NULL,  -- Data de início da temporada
    data_fim DATE NOT NULL      -- Data de término da temporada
);


-- Criação da tabela tbl_salas
CREATE TABLE tbl_salas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_rank INT,  -- Referência ao rank da sala
    numero INT,
    max_pessoas INT DEFAULT 25,
    pessoas_atual INT DEFAULT 0,
    temporada_id INT,  -- Chave estrangeira para a temporada
    FOREIGN KEY (id_rank) REFERENCES tbl_ranks(id),
    FOREIGN KEY (temporada_id) REFERENCES tbl_temporadas(id)  -- Chave estrangeira para a temporada atual
);


-- Tabela tbl_alunos
CREATE TABLE tbl_alunos (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(90),
    email VARCHAR(256),
    senha VARCHAR(25) NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    serie VARCHAR(20) NOT NULL,
    imagem_id INT, -- ID da imagem do usuário
    pontos INT DEFAULT 0,
    id_rank INT DEFAULT 1,
    FOREIGN KEY (id_rank) REFERENCES tbl_ranks(id),
    FOREIGN KEY (imagem_id) REFERENCES tbl_imagens_usuario(id)
);


CREATE TABLE tbl_salas_alunos (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    aluno_id INT NOT NULL,
    sala_id INT NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES tbl_alunos(id),
    FOREIGN KEY (sala_id) REFERENCES tbl_salas(id),
    UNIQUE (aluno_id, sala_id)  -- Para garantir que um aluno não possa estar na mesma sala mais de uma vez
);

CREATE TABLE tbl_alunos_ranks (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    aluno_id INT NOT NULL,
    rank_id INT NOT NULL,
    pontos_rank INT DEFAULT 0,
    FOREIGN KEY (aluno_id) REFERENCES tbl_alunos(id),
    FOREIGN KEY (rank_id) REFERENCES tbl_ranks(id)
);


-- Tabela tbl_alunos_materiais
CREATE TABLE tbl_alunos_materias (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    aluno_id INT NOT NULL,
    materia_id INT NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES tbl_alunos(id),
    FOREIGN KEY (materia_id) REFERENCES tbl_materias(id)
);


-- Tabela tbl_professor
CREATE TABLE tbl_professor (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    nome VARCHAR(90),
    email VARCHAR(256),
    senha VARCHAR(25) NOT NULL,
    data_nascimento DATE NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    imagem_id int,
    FOREIGN KEY (imagem_id) REFERENCES tbl_imagens_usuario(id)
);

-- Tabela tbl_professor_materias
CREATE TABLE tbl_professor_materias (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    professor_id INT NOT NULL,
    materia_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES tbl_professor(id),
    FOREIGN KEY (materia_id) REFERENCES tbl_materias(id)
);

-- Tabela tbl_membros
CREATE TABLE tbl_membros (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    aluno_id INT NOT NULL,
    grupo_mentoria_id INT NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES tbl_alunos(id),
    FOREIGN KEY (grupo_mentoria_id) REFERENCES tbl_grupo_mentoria(id)
);

SELECT 
    tbl_grupo_mentoria.*,
    COUNT(tbl_membros.id) AS numero_membros
FROM 
    tbl_grupo_mentoria
LEFT JOIN 
    tbl_membros ON tbl_grupo_mentoria.id = tbl_membros.grupo_mentoria_id
WHERE 
    tbl_grupo_mentoria.id = 1
GROUP BY 
    tbl_grupo_mentoria.id;
    
    DESCRIBE tbl_grupo_mentoria;
DESCRIBE tbl_mentor;
DESCRIBE tbl_alunos;
DESCRIBE tbl_membros;

-- Tabela tbl_duvida_compartilhada
CREATE TABLE tbl_duvida_compartilhada (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    conteudo TEXT,
    data_envio VARCHAR(45),
    membro_id INT NOT NULL,
    respondida boolean default false,
    FOREIGN KEY (membro_id) REFERENCES tbl_membros(id)
);


-- Tabela tbl_resposta_duvida
CREATE TABLE tbl_resposta_duvida (
    id_resposta_duvida INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    conteudo VARCHAR(45) NOT NULL,
    data_resposta VARCHAR(45),
    duvida_compartilhada_id INT NOT NULL,
    mentor_id INT NOT NULL,
    FOREIGN KEY (duvida_compartilhada_id) REFERENCES tbl_duvida_compartilhada(id),
    FOREIGN KEY (mentor_id) REFERENCES tbl_mentor(id)
);



-- Tabela tbl_professor_mentor
CREATE TABLE tbl_professor_mentor (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    professor_id INT NOT NULL,
    mentor_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES tbl_professor(id),
    FOREIGN KEY (mentor_id) REFERENCES tbl_mentor(id)
);

-- Tabela tbl_aluno_mentor
CREATE TABLE tbl_aluno_mentor (
    id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    aluno_id INT NOT NULL,
    mentor_id INT NOT NULL,
    FOREIGN KEY (aluno_id) REFERENCES tbl_alunos(id),
    FOREIGN KEY (mentor_id) REFERENCES tbl_mentor(id)
);



CREATE TABLE tbl_emblema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    icone VARCHAR(255) -- Caminho para o ícone do emblema
);

CREATE TABLE tbl_nivel_emblema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_emblema INT,
    nivel INT NOT NULL, -- Nível do emblema (ex: 1, 2, 3, etc.)
    meta VARCHAR(100) NOT NULL, -- Meta para atingir esse nível (ex: 100 atividades)
    FOREIGN KEY (id_emblema) REFERENCES tbl_emblema(id) ON DELETE CASCADE
);


CREATE TABLE tbl_aluno_emblema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_aluno INT,
    id_nivel_emblema INT,  -- Relaciona com o nível do emblema
    data_conquista DATE NOT NULL, -- Data em que o aluno alcançou o nível
    FOREIGN KEY (id_aluno) REFERENCES tbl_alunos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_nivel_emblema) REFERENCES tbl_nivel_emblema(id) ON DELETE CASCADE
);

-- INSERTS 


-- Inserir dados na tabela tbl_mentor

INSERT INTO tbl_imagens_usuario (nome_imagem, caminho_imagem) VALUES 
('Menino', 'https://i.ibb.co/ZXMqtDj/image.png'),
('Menino', 'https://i.ibb.co/VqpFh9r/image.png'),
('Menina', 'https://i.ibb.co/dPrSdFP/image.png'),
('Menina', 'https://i.ibb.co/QPw69Mr/image.png');

INSERT INTO tbl_imagens_grupo_mentoria (nome_imagem, caminho_imagem) VALUES 
('Tucano', 'https://i.ibb.co/kxL92fX/image.png'),
('Onça', 'https://i.ibb.co/JRgDDhW/image.png');



INSERT INTO tbl_mentor (data_ingresso) VALUES
(NOW());

INSERT INTO tbl_mentor (data_ingresso) VALUES
(NOW());


-- Inserir dados na tabela tbl_grupo_mentoria
INSERT INTO tbl_grupo_mentoria (nome, capacidade, descricao, imagem_id, materia, serie_min, serie_max, mentor_id) VALUES
('Grupo A', 10, 'Descrição do Grupo A', 1, 'matemática', 1, 3, 1),
('Grupo B', 10, 'Descrição do Grupo B', 2, 'matemática', 1, 3, 2);


-- Inserir dados na tabela tbl_tipo_questao
INSERT INTO tbl_tipo_questao (tipo_questao) VALUES
('Múltipla Escolha'),
('Verdadeiro ou Falso'),
('Preenchimento de Lacunas');

-- Inserir dados na tabela tbl_atividade_grupo_mentoria
INSERT INTO tbl_atividade_grupo_mentoria (nome, descricao, grupo_mentoria_id) VALUES
('Atividade 1', 'Descrição da Atividade 1', 1);

-- Inserir dados na tabela tbl_questao
INSERT INTO tbl_questao (enunciado, tipo_questao_id, imagem, atividade_grupo_mentoria_id) VALUES
('Qual é a capital do Brasil?', 1, 'imagem1.jpg', 1),
('O céu é azul?', 2, NULL, 1);

-- Inserir dados na tabela tbl_resposta_lacunas
INSERT INTO tbl_resposta_lacunas (posicao_inicial, posicao_fim, questao_id, palavra) VALUES
(0, 5, 1, 'Brasília');

-- Inserir dados na tabela tbl_resposta_verdadeiro_falso
INSERT INTO tbl_resposta_verdadeiro_falso (autenticacao, questao_id, conteudo) VALUES
(1, 2, 'Sim');

-- Inserir dados na tabela tbl_resposta_correspondencia
INSERT INTO tbl_resposta_correspondencia (palavra_correspondente, resposta_correspondente, questao_id) VALUES
('Brasil', 'Brasília', 1);

-- Inserir dados na tabela tbl_resposta_multipla_escolha
INSERT INTO tbl_resposta_multipla_escolha (conteudo, autenticacao, questao_id) VALUES
('Brasília', 1, 1),
('Rio de Janeiro', 0, 1);

-- Inserir dados na tabela tbl_ordem_palavra
INSERT INTO tbl_ordem_palavra (posicao, questao_id, conteudo) VALUES
(1, 1, 'Brasília');

-- Inserir dados na tabela tbl_materias
INSERT INTO tbl_materias (nome_materia) VALUES
('Matemática'),
('Português'),
('História');

-- Inserir dados na tabela tbl_ranks
INSERT INTO tbl_ranks (nome, nivel, num_salas) VALUES
('Iniciante', 1, 5),
('Intermediário', 2, 10);

-- Inserir dados na tabela tbl_temporadas
INSERT INTO tbl_temporadas (data_inicio, data_fim) VALUES
('2024-01-01', '2024-06-30');

-- Inserir dados na tabela tbl_salas
INSERT INTO tbl_salas (id_rank, numero, max_pessoas, pessoas_atual, temporada_id) VALUES
(1, 101, 25, 5, 1),
(2, 102, 30, 10, 1);


INSERT INTO tbl_professor (nome, email, senha, data_nascimento, telefone, imagem_id) VALUES
('Professor 1', 'professor1@example.com', 'senha123', '1980-01-01', '1234567890', 1),
('Professor 2', 'professor2@example.com', 'senha123', '1981-02-02', '1234567891', 2),
('Professor 3', 'professor3@example.com', 'senha123', '1982-03-03', '1234567892', 3),
('Professor 50', 'professor50@example.com', 'senha123', '2029-02-19', '1234567839', 4);

select * from tbl_alunos;
desc tbl_grupo_mentoria;

-- Inserir dados na tabela tbl_alunos
INSERT INTO tbl_alunos (nome, email, senha, data_nascimento, telefone, serie,  pontos, id_rank, imagem_id) VALUES
('Aluno 1', 'aluno1@example.com', 'senha123', '2005-01-01', '123456789', '1ª série', 0, 1, 1),
('Aluno 2', 'aluno2@example.com', 'senha123', '2005-02-01', '987654321', '2ª série', 0, 1, 2),
('Aluno 3', 'aluno3@example.com', 'senha123', '2005-02-01', '987654321', '2ª série', 0, 1, 1);


-- Inserir dados na tabela tbl_salas_alunos
INSERT INTO tbl_salas_alunos (aluno_id, sala_id) VALUES
(1, 1),
(2, 1);

-- Inserir dados na tabela tbl_alunos_ranks
INSERT INTO tbl_alunos_ranks (aluno_id, rank_id, pontos_rank) VALUES
(1, 1, 10),
(2, 1, 20);

-- Inserir dados na tabela tbl_alunos_materias
INSERT INTO tbl_alunos_materias (aluno_id, materia_id) VALUES
(1, 1),
(1, 2),
(2, 3);


-- Inserir dados na tabela tbl_professor_materias
INSERT INTO tbl_professor_materias (professor_id, materia_id) VALUES
(1, 1),
(2, 2);

-- Inserir dados na tabela tbl_membros
INSERT INTO tbl_membros (aluno_id, grupo_mentoria_id) VALUES
(1, 1),
(2, 1);

-- Inserir dados na tabela tbl_duvida_compartilhada
INSERT INTO tbl_duvida_compartilhada (conteudo, data_envio, membro_id, respondida) VALUES
('Qual é a dúvida?', '2024-01-10', 1, false);

-- Inserir dados na tabela tbl_resposta_duvida
INSERT INTO tbl_resposta_duvida (conteudo, data_resposta, duvida_compartilhada_id, mentor_id) VALUES
('Aqui está a resposta', '2024-01-11', 1, 1);

-- Inserir dados na tabela tbl_professor_mentor
INSERT INTO tbl_professor_mentor (professor_id, mentor_id) VALUES
(1, 1);

-- Inserir dados na tabela tbl_aluno_mentor
INSERT INTO tbl_aluno_mentor (aluno_id, mentor_id) VALUES
(2, 1),
(3, 2);

-- Inserir dados na tabela tbl_emblema
INSERT INTO tbl_emblema (nome, descricao, icone) VALUES
('Emblema de Ouro', 'Descrição do emblema de ouro', 'icone_ouro.png'),
('Emblema de Prata', 'Descrição do emblema de prata', 'icone_prata.png');

-- Inserir dados na tabela tbl_nivel_emblema
INSERT INTO tbl_nivel_emblema (id_emblema, nivel, meta) VALUES
(1, 1, 'Concluir 5 atividades'),
(1, 2, 'Concluir 10 atividades'),
(2, 1, 'Concluir 15 atividades');


-- Inserir dados na tabela tbl_aluno_emblema
INSERT INTO tbl_aluno_emblema (id_aluno, id_nivel_emblema, data_conquista) VALUES
(1, 1, '2024-01-15'),
(1, 2, '2024-02-10'),
(2, 1, '2024-01-20');


INSERT INTO tbl_temporadas (data_inicio, data_fim)
    VALUES (
        DATE_ADD((SELECT MAX(t.data_fim) FROM (SELECT data_fim FROM tbl_temporadas) t), INTERVAL 2 DAY),
        DATE_ADD((SELECT MAX(t.data_fim) FROM (SELECT data_fim FROM tbl_temporadas) t), INTERVAL 22 DAY)
    );





-- VIEWS, E OS SELECTS -- 
    
    CREATE VIEW vw_alunos_sala AS
SELECT 
    tbl_alunos.id AS id_aluno,           -- ID do aluno
    tbl_alunos.nome AS nome_aluno,       -- Nome do aluno
    tbl_salas.id AS id_sala,             -- ID da sala
    tbl_salas.numero AS numero_sala       -- Número da sala
FROM 
    tbl_alunos
JOIN 
    tbl_salas_alunos ON tbl_alunos.id = tbl_salas_alunos.aluno_id  -- Junta alunos com salas que frequentam
JOIN 
    tbl_salas ON tbl_salas_alunos.sala_id = tbl_salas.id;          -- Junta com a tabela de salas


SELECT * FROM vw_alunos_sala_1 where id_sala = 1;
    
drop view vw_alunos_sala_1;
    
    ---------------------------------------------------------------------------------------------------------------------

    CREATE VIEW vw_emblemas_aluno AS
SELECT 
    emblema.id AS emblema_id,
    emblema.nome AS emblema_nome,
    nivel_atual.nivel AS nivel_atual,
    nivel_atual.meta AS meta_atual,
    proximo_nivel.nivel AS proximo_nivel,
    proximo_nivel.meta AS meta_proxima,
    aluno_emblema.id_aluno -- Incluindo o ID do aluno
FROM 
    tbl_emblema AS emblema
JOIN 
    tbl_nivel_emblema AS nivel_atual 
    ON emblema.id = nivel_atual.id_emblema
LEFT JOIN 
    tbl_nivel_emblema AS proximo_nivel 
    ON emblema.id = proximo_nivel.id_emblema 
    AND proximo_nivel.nivel = nivel_atual.nivel + 1
JOIN 
    tbl_aluno_emblema AS aluno_emblema -- Associação com a tabela de alunos e emblemas
    ON nivel_atual.id = aluno_emblema.id_nivel_emblema -- Junta com os emblemas dos alunos
WHERE 
    nivel_atual.nivel = (
        SELECT MAX(nivel) 
        FROM tbl_nivel_emblema 
        WHERE id_emblema = emblema.id 
        AND id IN (
            SELECT id_nivel_emblema 
            FROM tbl_aluno_emblema
        )
    );

    drop view vw_emblemas_aluno;
    
    SELECT * FROM vw_emblemas_aluno2 WHERE id_aluno = 1;


    ---------------------------------------------------------------------------------------------------------------------

   CREATE VIEW vw_emblemas_nao_conquistados AS
SELECT 
    n.id AS nivel_emblema_id,
    n.nivel,
    e.id AS emblema_id,
    e.nome AS emblema_nome,
    n.meta,
    ae.id_aluno   -- Adiciona a coluna id_aluno para uso em filtros
FROM 
    tbl_nivel_emblema n
JOIN 
    tbl_emblema e ON n.id_emblema = e.id
LEFT JOIN 
    tbl_aluno_emblema ae ON ae.id_nivel_emblema = n.id
WHERE 
    n.nivel = 1;  -- Filtro para emblemas não conquistados


SELECT * 
FROM vw_emblemas_nao_conquistados
WHERE id_aluno = 2;

    
drop view vw_emblemas_nao_conquistados;
    
  
    
      ---------------------------------------------------------------------------------------------------------------------
    
   CREATE VIEW vw_alunos_ranking_sala AS
SELECT 
    tbl_alunos.id AS id_aluno,
    tbl_alunos.nome AS nome_aluno,
    tbl_alunos_ranks.pontos_rank AS pontos_aluno,
    ROW_NUMBER() OVER (ORDER BY tbl_alunos_ranks.pontos_rank DESC) AS posicao
FROM 
    tbl_alunos 
JOIN 
    tbl_salas_alunos ON tbl_alunos.id = tbl_salas_alunos.aluno_id
JOIN 
    tbl_salas ON tbl_salas_alunos.sala_id = tbl_salas.id
LEFT JOIN 
    tbl_alunos_ranks ON tbl_alunos.id = tbl_alunos_ranks.aluno_id
ORDER BY 
    tbl_alunos_ranks.pontos_rank DESC;  -- Ordena os resultados por pontos de forma decrescente



SELECT *
FROM vw_alunos_ranking_sala
JOIN tbl_salas_alunos ON vw_alunos_ranking_sala.id_aluno = tbl_salas_alunos.aluno_id
WHERE tbl_salas_alunos.sala_id = 1;  -- Substitua 1 pelo ID da sala desejada

    drop view vw_alunos_ranking_sala_1;
    

    ---------------------------------------------------------------------------------------------------------------------

   
   CREATE VIEW vw_informacoes_alunos_ranking AS
SELECT 
    tbl_alunos.id AS id_aluno,                            -- ID do aluno
    tbl_alunos.nome AS nome_aluno,                        -- Nome do aluno
    tbl_alunos_ranks.rank_id AS id_rank,                 -- ID do ranking do aluno
    tbl_alunos_ranks.pontos_rank AS pontos_aluno         -- Pontos do aluno no ranking
FROM 
    tbl_alunos_ranks                                        -- Tabela que contém os ranks dos alunos
JOIN 
    tbl_alunos ON tbl_alunos.id = tbl_alunos_ranks.aluno_id;
    
    
drop view vw_informacoes_alunos_ranking;
    
SELECT * 
FROM vw_informacoes_alunos_ranking
WHERE id_aluno = 2; 
    
        ---------------------------------------------------------------------------------------------------------------------
    
    
  CREATE VIEW vw_alunos_mentores AS
SELECT 
    alunos.id AS aluno_id,
    alunos.nome AS aluno_nome,
    mentores.id AS mentor_id,
    mentores.data_ingresso AS mentor_data_ingresso
FROM 
    tbl_aluno_mentor AS aluno_mentor
JOIN 
    tbl_alunos AS alunos ON aluno_mentor.aluno_id = alunos.id
JOIN 
    tbl_mentor AS mentores ON aluno_mentor.mentor_id = mentores.id;

    
    SELECT * FROM vw_alunos_mentores;

	-- Alunos de um Mentor Específico
    SELECT * FROM vw_alunos_mentores
WHERE mentor_id = 1;

-- Detalhes de um Aluno Específico
SELECT * FROM vw_alunos_mentores
WHERE aluno_id = 2;



    ---------------------------------------------------------------------------------------------------------------------
    
    

    
 CREATE VIEW vw_membros_alunos_grupo_mentoria AS
SELECT 
    m.id AS membro_id,
    a.id AS aluno_id,
    a.nome AS aluno_nome,
    a.email AS aluno_email,
    a.telefone AS aluno_telefone,
    a.data_nascimento AS aluno_data_nascimento,
    a.serie AS aluno_serie,
    g.id AS grupo_mentoria_id,
    g.nome AS grupo_mentoria_nome
FROM 
    tbl_membros m
INNER JOIN 
    tbl_alunos a ON m.aluno_id = a.id
INNER JOIN 
    tbl_grupo_mentoria g ON m.grupo_mentoria_id = g.id;    -- Filtra para o grupo de mentoria específico
    
    
    
    SELECT * FROM vw_membros_alunos_grupo_mentoria;
    
    
    -- Filtrar por Grupo de Mentoria Específico:
    SELECT * FROM vw_membros_alunos_grupo_mentoria
WHERE grupo_mentoria_id = 1;


-- Filtrar por Aluno Específico
SELECT * FROM vw_membros_alunos_grupo_mentoria
WHERE aluno_id = 1;


    
    
    ---------------------------------------------------------------------------------------------------------------------
    
    
    CREATE VIEW vw_informacoes_mentores AS
SELECT
  m.id AS mentor_id,
  m.data_ingresso,
  CASE
    WHEN NOT EXISTS (SELECT 1 FROM tbl_aluno_mentor am WHERE am.mentor_id = m.id)
         AND EXISTS (SELECT 1 FROM tbl_professor_mentor pm WHERE pm.mentor_id = m.id) THEN 'Professor'
    WHEN EXISTS (SELECT 1 FROM tbl_aluno_mentor am WHERE am.mentor_id = m.id) THEN 'Aluno'
    ELSE 'Outro'
  END AS tipo_mentor,
  COALESCE(
    (SELECT a.nome FROM tbl_alunos a WHERE am.aluno_id = a.id),
    (SELECT p.nome FROM tbl_professor p WHERE pm.professor_id = p.id)
  ) AS nome_associado
FROM
  tbl_mentor m
LEFT JOIN tbl_professor_mentor pm ON m.id = pm.mentor_id
LEFT JOIN tbl_aluno_mentor am ON m.id = am.mentor_id; -- Junta com a tabela de alunos mentores


SELECT * FROM vw_informacoes_mentores;


-- Filtrar por ID do Mentor
SELECT * FROM vw_informacoes_mentores
WHERE mentor_id = 1;


-- Filtrar por nome do Mentor
SELECT * FROM vw_informacoes_mentores
WHERE tipo_mentor = 'Aluno';




  ---------------------------------------------------------------------------------------------------------------------


CREATE VIEW vw_duvidas_compartilhadas AS
SELECT 
    alunos.nome AS nome_do_aluno,
    duvidas.conteudo AS conteudo_da_duvida,
    duvidas.data_envio AS data_de_envio,
    CASE 
        WHEN duvidas.respondida = 1 THEN 'Respondida' 
        ELSE 'Não respondida' 
    END AS status_da_duvida
FROM 
    tbl_duvida_compartilhada duvidas
INNER JOIN 
    tbl_membros membros ON duvidas.membro_id = membros.id
INNER JOIN 
    tbl_alunos alunos ON membros.aluno_id = alunos.id;


SELECT * FROM vw_duvidas_compartilhadas;

-- Dúvidas Respondidas: 
SELECT * FROM vw_duvidas_compartilhadas
WHERE status_da_duvida = 'Respondida';


-- Dúvidas Não Respondidas:
SELECT * FROM vw_duvidas_compartilhadas
WHERE status_da_duvida = 'Não respondida';

    
    
      ---------------------------------------------------------------------------------------------------------------------
    
    
   CREATE VIEW vw_duvidas_membro AS
SELECT 
    id AS id_duvida,
    conteudo AS conteudo_duvida,
    data_envio AS data_de_envio,
    membro_id AS id_membro,
    respondida AS status_duvida
FROM 
    tbl_duvida_compartilhada;
    
    
    -- Dúvidas Respondidas:
    SELECT * FROM vw_duvidas_membro
WHERE status_duvida = 1;


 -- Dúvidas Não Respondidas:
  SELECT * FROM vw_duvidas_membro
WHERE status_duvida = 0;


-- Dúvidas de um Membro Específico:
SELECT * FROM vw_duvidas_membro
WHERE id_membro = 1;


          ---------------------------------------------------------------------------------------------------------------------
    
    
  CREATE VIEW vw_questoes_atividades AS
SELECT 
    q.id AS questao_id,
    q.enunciado,
    q.tipo_questao_id,
    q.imagem,
    q.atividade_grupo_mentoria_id,
    agm.id AS atividade_id,
    agm.nome AS atividade_nome,
    agm.descricao AS atividade_descricao
FROM 
    tbl_questao q
JOIN 
    tbl_atividade_grupo_mentoria agm ON q.atividade_grupo_mentoria_id = agm.id;
 -- Junta com a tabela de atividades
    
    
    SELECT * FROM vw_questoes_atividades;
    
    
    --  Filtrar questões de uma atividade específica
    SELECT *
FROM vw_questoes_atividades
WHERE atividade_id = 1;


 -- Obter questões de uma atividade específica e incluir apenas as questões com imagem
SELECT *
FROM vw_questoes_atividades
WHERE atividade_id = 1 AND imagem IS NOT NULL;
    
    
     ---------------------------------------------------------------------------------------------------------------------
    
    CREATE VIEW vw_duvidas_respondidas AS
SELECT 
    alunos.nome AS Nome_do_Aluno,
    duvidas.conteudo AS Conteudo_da_Duvida,
    duvidas.data_envio AS Data_de_Envio
FROM 
    tbl_duvida_compartilhada duvidas
INNER JOIN 
    tbl_membros membros ON duvidas.membro_id = membros.id
INNER JOIN 
    tbl_alunos alunos ON membros.aluno_id = alunos.id
WHERE 
    duvidas.respondida = 1;
    
    
    SELECT *
FROM vw_duvidas_respondidas;

  
        ---------------------------------------------------------------------------------------------------------------------
    
    
    CREATE VIEW vw_professores_mentores AS
SELECT 
    professores.id AS professor_id,            -- ID do professor
    professores.nome AS professor_nome,        -- Nome do professor
    mentores.id AS mentor_id,                  -- ID do mentor
    mentores.data_ingresso AS mentor_data_ingresso -- Data de ingresso do mentor
FROM 
    tbl_professor_mentor AS professor_mentor   -- Tabela que relaciona professores e mentores
JOIN 
    tbl_professor AS professores ON professor_mentor.professor_id = professores.id  -- Junta com a tabela de professores
JOIN 
    tbl_mentor AS mentores ON professor_mentor.mentor_id = mentores.id;  -- Junta com a tabela de mentore
    
    
    SELECT *
FROM vw_professores_mentores;


SELECT *
FROM vw_professores_mentores
WHERE professor_id = 1;


SELECT *
FROM vw_professores_mentores
WHERE mentor_id = 1;


            ---------------------------------------------------------------------------------------------------------------------
    
    
    
    CREATE VIEW vw_mentores_alunos AS
SELECT 
    alunos.id AS aluno_id,                     -- ID do aluno
    alunos.nome AS aluno_nome,                 -- Nome do aluno
    mentores.id AS mentor_id,                  -- ID do mentor
    mentores.data_ingresso AS mentor_data_ingresso -- Data de ingresso do mentor
FROM 
    tbl_aluno_mentor AS aluno_mentor           -- Tabela que relaciona alunos e mentores
JOIN 
    tbl_alunos AS alunos ON aluno_mentor.aluno_id = alunos.id  -- Junta com a tabela de alunos
JOIN 
    tbl_mentor AS mentores ON aluno_mentor.mentor_id = mentores.id;  -- Junta com a tabela de mentores
    
    
    
    SELECT * 
FROM vw_mentores_alunos;


SELECT * 
FROM vw_mentores_alunos 
WHERE aluno_id = 1;  -- Substitua 2 pelo ID do aluno desejado


SELECT * 
FROM vw_mentores_alunos 
WHERE mentor_id = 1;  -- Substitua 3 pelo ID do mentor desejado