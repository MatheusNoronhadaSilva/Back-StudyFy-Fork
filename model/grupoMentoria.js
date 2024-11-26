/*******************************************************
 * DATA: 05/09/2024
 * Autor: Ricardo Borges
 * Versão: 1.1
*******************************************************/

// Importa de biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client')

// Instacia da classe PrismaClient
const prisma = new PrismaClient()


// Função para selecionar um grupo de mentoria pelo ID
const selectGrupoMentoriaByID = async function(id) {
    try {
        // Realiza a busca do grupo de mentoria pelo ID
        let sql = `SELECT 
    tbl_grupo_mentoria.*, 
    COUNT(tbl_membros.id) AS quantidade_membros, 
    tbl_materias.nome_materia AS nome_materia, 
    tbl_materias.imagem_materia AS imagem_materia,
    tbl_imagens_grupo_mentoria.caminho_imagem AS imagem_grupo  -- Adicionando a imagem do grupo de mentoria
FROM 
    tbl_grupo_mentoria
LEFT JOIN 
    tbl_membros ON tbl_grupo_mentoria.id = tbl_membros.grupo_mentoria_id
LEFT JOIN 
    tbl_materias ON tbl_grupo_mentoria.materia_id = tbl_materias.id
LEFT JOIN 
    tbl_imagens_grupo_mentoria ON tbl_grupo_mentoria.imagem_id = tbl_imagens_grupo_mentoria.id  -- Junta a imagem do grupo
WHERE 
    tbl_grupo_mentoria.id = ${id}
GROUP BY 
    tbl_grupo_mentoria.id, 
    tbl_materias.nome_materia, 
    tbl_materias.imagem_materia, 
    tbl_imagens_grupo_mentoria.caminho_imagem;

`;

console.log('dddddddddddd');

        // Executa no banco de dados o script SQL
        let rsGrupoMentoria = await prisma.$queryRawUnsafe(sql);    
        

        console.log('teste2');
        
        console.log('testenovo' + rsGrupoMentoria);
        

        const resultadoConvertido = rsGrupoMentoria.map(grupo => ({            
            id: grupo.id,
            nome: grupo.nome,
            capacidade: grupo.capacidade,
            descricao: grupo.descricao,
            materia_nome: grupo.materia_nome,
            materia_imagem: grupo.imagem_materia,
            foto_grupo: grupo.imagem_grupo,
            serie_min: grupo.serie_min,
            serie_max: grupo.serie_max,
            imagem_id: grupo.imagem_id,
            chat_aberto: grupo.chat_aberto,
            data_criacao: grupo.data_criacao,
            mentor_id: grupo.mentor_id,
            quantidade_membros: grupo.quantidade_membros.toString(), // Apenas converte quantidade_membros
        }));
                

        return resultadoConvertido;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// Função para selecionar todos os grupos de mentoria
const selectAllGruposMentoria = async function() {
    try {
        // Realiza a busca de todos os grupos de mentoria
        let sql = `SELECT * FROM tbl_grupo_mentoria`;

        // Executa no banco de dados o script SQL
        let rsGruposMentoria = await prisma.$queryRawUnsafe(sql);

        return rsGruposMentoria;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// Função para inserir um novo grupo de mentoria
const insertGrupoMentoria = async function(dadosGrupoMentoria) {
    try {
        let sql = `INSERT INTO tbl_grupo_mentoria (
        nome, 
        capacidade, 
        descricao, 
        imagem_id, 
        materia_id, 
        serie_min, 
        serie_max, 
        mentor_id
        ) 
        VALUES (
                        '${dadosGrupoMentoria.nome}',
                         ${dadosGrupoMentoria.capacidade},
                        '${dadosGrupoMentoria.descricao}',
                         ${dadosGrupoMentoria.imagem_id},
                         ${dadosGrupoMentoria.materia},
                         ${dadosGrupoMentoria.serie_min},
                         ${dadosGrupoMentoria.serie_max},
                         ${dadosGrupoMentoria.mentor_id}
        );`

        // Executa o SQL para inserir o grupo de mentoria
        let result = await prisma.$executeRawUnsafe(sql);

        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// Função para atualizar um grupo de mentoria existente
const updateGrupoMentoria = async function(id, dadosGrupoMentoria) {
    try {
        let sql = `UPDATE tbl_grupo_mentoria
                    SET 
                        nome = '${dadosGrupoMentoria.nome}',
                        capacidade = ${dadosGrupoMentoria.capacidade},
                        descricao = '${dadosGrupoMentoria.descricao}',
                        foto_perfil = '${dadosGrupoMentoria.foto_perfil}',
                        materia = '${dadosGrupoMentoria.materia}',
                        serie_min = ${dadosGrupoMentoria.serie_min},
                        serie_max = ${dadosGrupoMentoria.serie_max},
                        chat_aberto = ${dadosGrupoMentoria.chat_aberto},
                        data_criacao = '${dadosGrupoMentoria.data_criacao}',
                        mentor_id = ${dadosGrupoMentoria.mentor_id}
                    WHERE id = ${id}`;

        // Executa o SQL para atualizar o grupo de mentoria
        let result = await prisma.$executeRawUnsafe(sql);

        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

// Função para deletar um grupo de mentoria pelo ID
const deleteGrupoMentoria = async function(id) {
    try {
        let sql = `DELETE FROM tbl_grupo_mentoria WHERE id = ${id}`;

        // Executa o SQL para deletar o grupo de mentoria
        let result = await prisma.$executeRawUnsafe(sql);

        return result;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const lastIDGrupoMentoria = async function(){
    try {
        let sql = `SELECT id FROM tbl_grupo_mentoria ORDER BY id DESC LIMIT 1;`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
    
}


const buscarInformacoesTodosGruposMentoria = async (id) => {
    try {
        const sql = `
        SELECT 
    grupo_mentoria.id AS id_grupo,               
    grupo_mentoria.nome AS nome_grupo,
    imagens_grupo_mentoria.nome_imagem AS nome_imagem_grupo,
    imagens_grupo_mentoria.caminho_imagem AS caminho_imagem_grupo,
    grupo_mentoria.capacidade AS capacidade_grupo,
    COUNT(DISTINCT membros.id) AS quantidade_membros,
    COUNT(DISTINCT resposta_duvida.id_resposta_duvida) AS quantidade_duvidas_respondidas,
    materia.nome_materia AS nome_materia,
    materia.imagem_materia AS imagem_materia
FROM 
    tbl_grupo_mentoria AS grupo_mentoria
LEFT JOIN 
    tbl_membros AS membros ON grupo_mentoria.id = membros.grupo_mentoria_id
LEFT JOIN 
    tbl_duvida_compartilhada AS duvida_compartilhada ON duvida_compartilhada.membro_id = membros.id
LEFT JOIN 
    tbl_resposta_duvida AS resposta_duvida ON resposta_duvida.duvida_compartilhada_id = duvida_compartilhada.id
LEFT JOIN 
    tbl_materias AS materia ON grupo_mentoria.materia_id = materia.id
LEFT JOIN 
    tbl_imagens_grupo_mentoria AS imagens_grupo_mentoria ON grupo_mentoria.imagem_id = imagens_grupo_mentoria.id
WHERE 
    grupo_mentoria.id NOT IN (
        SELECT grupo_mentoria_id 
        FROM tbl_membros 
        WHERE aluno_id = ${id}
    )
GROUP BY 
    grupo_mentoria.id, 
    imagens_grupo_mentoria.nome_imagem, 
    imagens_grupo_mentoria.caminho_imagem,
    materia.nome_materia, 
    materia.imagem_materia;
        `;        

        console.log(sql);
        
        const resultado = await prisma.$queryRawUnsafe(sql);   
        
        console.log(resultado);

                // Converte os valores de BigInt para string
                const resultadoConvertido = resultado.map(grupo => ({
                    id: grupo.id_grupo,
                    foto_grupo: grupo.caminho_imagem_grupo,
                    nome_grupo: grupo.nome_grupo,
                    materia_nome: grupo.nome_materia,
                    materia_imagem: grupo.imagem_materia,
                    quantidade_duvidas_respondidas: grupo.quantidade_duvidas_respondidas.toString(),
                    quantidade_membros: grupo.quantidade_membros.toString(),
                    capacidade_grupo: grupo.capacidade_grupo
                }));
        console.log(resultadoConvertido);
        
        return resultadoConvertido;
    } catch (error) {
        console.error('Erro ao buscar informações de todos os grupos de mentoria no DAO:', error);
        throw error;
    }
};

const selectGruposAluno = async(idAluno) => {
    
    try {
        let sql = `SELECT 
    grupo_mentoria.id AS id_grupo,
    grupo_mentoria.nome AS nome_grupo,
    imagens_grupo_mentoria.nome_imagem AS nome_imagem_grupo,
    imagens_grupo_mentoria.caminho_imagem AS caminho_imagem_grupo,
    materias.nome_materia AS nome_materia,
    materias.imagem_materia AS caminho_imagem_materia
FROM 
    tbl_grupo_mentoria AS grupo_mentoria
JOIN 
    tbl_membros AS membros ON membros.grupo_mentoria_id = grupo_mentoria.id
LEFT JOIN 
    tbl_imagens_grupo_mentoria AS imagens_grupo_mentoria ON grupo_mentoria.imagem_id = imagens_grupo_mentoria.id
LEFT JOIN 
    tbl_materias AS materias ON grupo_mentoria.materia_id = materias.id
WHERE 
    membros.aluno_id = ${idAluno};
`
    console.log(sql);
    

        let result = await prisma.$queryRawUnsafe(sql)

        console.log(result);
        

        return result
    } catch (error) {
        console.log('erro');
        
    }
}

const selectMentorByGrupoId = async (idGrupo) => {
    try {
        // Consulta SQL para pegar o mentor com base no ID do grupo de mentoria
        const sql = `
SELECT 
    tbl_mentor.id AS mentor_id,
    COALESCE(tbl_professor.nome, tbl_alunos.nome) AS mentor_nome,  -- Pega o nome, seja de professor ou aluno
    CASE
        WHEN tbl_professor.id IS NOT NULL THEN 'Professor'
        WHEN tbl_alunos.id IS NOT NULL THEN 'Aluno/mentor'
    END AS mentor_tipo,  -- Identifica se o mentor é um professor ou aluno
    COALESCE(tbl_professor_imagens.caminho_imagem, tbl_alunos_imagens.caminho_imagem) AS foto_perfil  -- Caminho da imagem de perfil, se existirem
FROM 
    tbl_grupo_mentoria
LEFT JOIN 
    tbl_membros ON tbl_membros.grupo_mentoria_id = tbl_grupo_mentoria.id
LEFT JOIN 
    tbl_mentor ON tbl_mentor.id = tbl_grupo_mentoria.mentor_id
LEFT JOIN 
    tbl_professor ON tbl_professor.id = tbl_mentor.id  -- Junta com professor
LEFT JOIN 
    tbl_alunos ON tbl_alunos.id = tbl_mentor.id  -- Junta com aluno
LEFT JOIN 
    tbl_imagens_usuario AS tbl_professor_imagens ON tbl_professor_imagens.id = tbl_professor.imagem_id  -- Imagem do professor
LEFT JOIN 
    tbl_imagens_usuario AS tbl_alunos_imagens ON tbl_alunos_imagens.id = tbl_alunos.imagem_id  -- Imagem do aluno
WHERE 
    tbl_grupo_mentoria.id = ${idGrupo}
GROUP BY 
    tbl_grupo_mentoria.id, tbl_mentor.id;

        `;

        // Executa a consulta SQL, passando o ID do grupo como parâmetro
        const result = await prisma.$queryRawUnsafe(sql);

        // Retorna os dados encontrados (se houver)
        return result;

    } catch (error) {
        console.error('Erro ao consultar mentor do grupo:', error);
        throw error;
    }
};

// Exporta as funções
module.exports = {
    selectMentorByGrupoId,
    selectGruposAluno,
    selectGrupoMentoriaByID,
    selectAllGruposMentoria,
    insertGrupoMentoria,
    updateGrupoMentoria,
    deleteGrupoMentoria,
    lastIDGrupoMentoria,
    buscarInformacoesTodosGruposMentoria,
}
