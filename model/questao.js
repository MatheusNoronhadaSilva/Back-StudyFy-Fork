/*******************************************************
 * DATA: 05/09/2024
 * Autor: Ricardo Borges
 * Versão: 1.0
*******************************************************/

// Importa a biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client');

// Instância da classe PrismaClient
const prisma = new PrismaClient();

// Função para selecionar questão pelo ID
const selectQuestaoByID = async function(id) {
    try {
        let sql = `SELECT * FROM tbl_questao WHERE id = ${id};`;
        let resultado = await prisma.$queryRawUnsafe(sql);
        return resultado;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para selecionar todas as questões
const selectAllQuestoes = async function() {
    try {
        let sql = `SELECT * FROM tbl_questao;`;
        let resultado = await prisma.$queryRawUnsafe(sql);
        return resultado;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para inserir nova questão
const insertQuestao = async function(dadosQuestao) {
    try {
        let sql = `INSERT INTO tbl_questao (enunciado, tipo_questao_id, imagem, atividade_grupo_mentoria_id) 
                   VALUES ('${dadosQuestao.enunciado}', ${dadosQuestao.tipo_questao_id}, 
                           '${dadosQuestao.imagem}', ${dadosQuestao.atividade_grupo_mentoria_id});`;
        let resultado = await prisma.$executeRawUnsafe(sql);
        return resultado;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para atualizar questão
const updateQuestao = async function(id, dadosQuestao) {
    try {
        let sql = `UPDATE tbl_questao 
                   SET enunciado = '${dadosQuestao.enunciado}', 
                       tipo_questao_id = ${dadosQuestao.tipo_questao_id}, 
                       imagem = '${dadosQuestao.imagem}', 
                       atividade_grupo_mentoria_id = ${dadosQuestao.atividade_grupo_mentoria_id} 
                   WHERE id = ${id};`;
        let resultado = await prisma.$executeRawUnsafe(sql);
        return resultado;
    } catch (error) {
        console.log(error);
        return false;
    }
};

// Função para deletar questão
const deleteQuestao = async function(id) {
    try {
        let sql = `DELETE FROM tbl_questao WHERE id = ${id};`;
        let resultado = await prisma.$executeRawUnsafe(sql);
        return resultado;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const SelectGeralQuestao = async function () {
   
    try {
        let sql = `SELECT 
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
    tbl_atividade_grupo_mentoria agm ON q.atividade_grupo_mentoria_id = agm.id;;`

        let sqlID = await prisma.$queryRawUnsafe(sql)

        return sqlID
    } catch (error) {
        return false
    }
}

const selectQuestaoPorAtividade = async function(idAtividade) {
    try {
        let sql = `
            SELECT 
                tbl_questao.id AS questao_id,
                tbl_questao.enunciado AS questao_pergunta,
                tbl_questao.tipo_questao_id AS questao_tipo_id,
                tbl_questao.imagem AS questao_imagem
            FROM 
                tbl_atividade_questoes
            JOIN 
                tbl_atividades ON tbl_atividade_questoes.atividade_id = tbl_atividades.id
            JOIN 
                tbl_questao ON tbl_atividade_questoes.questao_id = tbl_questao.id
            WHERE 
                tbl_atividades.id = ${idAtividade}
            ORDER BY 
                tbl_questao.id;
        `;
        let questoes = await prisma.$queryRawUnsafe(sql);
        return questoes;
    } catch (error) {
        console.error('Erro ao buscar questões:', error);
        return false;
    }
};

const selectRespostasMultiplaEscolha = async function(questaoId) {
    try {
        let sql = `
            SELECT * 
            FROM tbl_resposta_multipla_escolha 
            WHERE questao_id = ${questaoId};
        `;
        return await prisma.$queryRawUnsafe(sql);
    } catch (error) {
        console.error('Erro ao buscar respostas de múltipla escolha:', error);
        return null;
    }
};

const selectRespostasVerdadeiroFalso = async function(questaoId) {
    try {
        let sql = `
            SELECT * 
            FROM tbl_resposta_verdadeiro_falso 
            WHERE questao_id = ${questaoId};
        `;
        return await prisma.$queryRawUnsafe(sql);
    } catch (error) {
        console.error('Erro ao buscar respostas de verdadeiro/falso:', error);
        return null;
    }
};

const selectRespostasLacunas = async function(questaoId) {
    try {
        let sql = `
            SELECT * 
            FROM tbl_resposta_lacunas 
            WHERE questao_id = ${questaoId};
        `;
        return await prisma.$queryRawUnsafe(sql);
    } catch (error) {
        console.error('Erro ao buscar respostas de lacunas:', error);
        return null;
    }
};

const selectRespostasCorrespondencia = async function(questaoId) {
    try {
        let sql = `
            SELECT * 
            FROM tbl_resposta_correspondencia 
            WHERE questao_id = ${questaoId};
        `;
        return await prisma.$queryRawUnsafe(sql);
    } catch (error) {
        console.error('Erro ao buscar respostas de correspondência:', error);
        return null;
    }
};

const selectAtividadesByMateriaAndSerie = async function(materiaId, serieId) {
    try {
        let sql = `
            SELECT 
                atividade.id AS id_da_atividade,
                atividade.titulo AS titulo_da_atividade,
                atividade.descricao AS descricao_da_atividade,
                assunto.id AS id_do_assunto,
                assunto.nome AS nome_do_assunto,
                assunto.cor AS cor_assunto,
                sub_assunto.id AS id_do_sub_assunto,
                sub_assunto.nome AS nome_do_sub_assunto,
                materia.id AS id_da_materia,
                materia.nome_materia AS nome_da_materia,
                serie.id AS id_da_serie,
                serie.nome AS nome_da_serie
            FROM 
                tbl_atividades atividade
            JOIN 
                tbl_assuntos assunto ON atividade.assunto_id = assunto.id
            LEFT JOIN 
                tbl_assuntos sub_assunto ON atividade.sub_assunto_id = sub_assunto.id
            JOIN 
                tbl_materias materia ON atividade.materia_id = materia.id
            JOIN 
                tbl_series serie ON atividade.serie_id = serie.id
            WHERE 
                atividade.materia_id = ${materiaId} 
                AND atividade.serie_id = ${serieId}
        `;
        
        let atividades = await prisma.$queryRawUnsafe(sql);
        return atividades;
    } catch (error) {
        console.error(error);
        return false;
    }
};



module.exports = {
    selectAtividadesByMateriaAndSerie,
    selectRespostasCorrespondencia,
    selectRespostasLacunas,
    selectRespostasMultiplaEscolha,
    selectRespostasVerdadeiroFalso,
    selectQuestaoPorAtividade,
    selectAllQuestoes,
    selectQuestaoByID,
    insertQuestao,
    updateQuestao,
    deleteQuestao,
    SelectGeralQuestao
};
