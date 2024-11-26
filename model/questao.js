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
    tbl_tipo_questao.tipo_questao AS tipo_questao_nome,  -- Nome do tipo da questão
    tbl_questao.imagem AS questao_imagem
FROM 
    tbl_questao
JOIN 
    tbl_tipo_questao ON tbl_questao.tipo_questao_id = tbl_tipo_questao.id  -- Join com a tabela de tipos de questões
WHERE 
    tbl_questao.atividade_id = ${idAtividade}  -- Filtra pela atividade_id na tabela tbl_questao
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
            SELECT 
    tbl_lacunas.posicao AS posicao_lacuna,
    tbl_lacunas.resposta_correta AS resposta_correta_lacuna,
    tbl_opcoes.texto_opcao AS texto_opcao_possivel
FROM 
    tbl_questao
JOIN 
    tbl_lacunas ON tbl_questao.id = tbl_lacunas.id_questao
JOIN 
    tbl_opcoes ON tbl_questao.id = tbl_opcoes.id_questao
WHERE 
    tbl_questao.id = ${questaoId}
ORDER BY 
    tbl_lacunas.posicao, 
    tbl_opcoes.texto_opcao;
        `;


        const result = await prisma.$queryRawUnsafe(sql);

        const mapaAgrupado = {};
        
        // Percorre o resultado para organizar os dados
        result.forEach(item => {
          // Verifica se a lacuna já está no mapa
          if (!mapaAgrupado[item.posicao_lacuna]) {
            mapaAgrupado[item.posicao_lacuna] = {
              posicao_lacuna: item.posicao_lacuna,
              resposta_correta_lacuna: item.resposta_correta_lacuna,
              opcoes_possiveis: []
            };
          }
        
          // Adiciona a opção à lista de opções possíveis (evitando duplicação)
          if (!mapaAgrupado[item.posicao_lacuna].opcoes_possiveis.includes(item.texto_opcao_possivel)) {
            mapaAgrupado[item.posicao_lacuna].opcoes_possiveis.push(item.texto_opcao_possivel);
          }
        });
        
        // Converte o mapa em um array, que será retornado como o agrupado
        const agrupado = Object.values(mapaAgrupado);

console.log(agrupado);


        return agrupado
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

        console.log(sql);
        

        const resultado = await prisma.$queryRawUnsafe(sql);

        console.log(resultado);
        console.log('id do grupo:', JSON.stringify(resultado, null, 2));
        
        return resultado
    } catch (error) {
        console.error('Erro ao buscar respostas de correspondência:', error);
        return null;
    }
};

const selectAtividadesByMateriaAndSerie = async function(materiaId, serieId) {
    try {
        let sql = `
SELECT 
    tbl_atividades.id AS id_da_atividade,
    tbl_atividades.titulo AS titulo_da_atividade,
    tbl_atividades.descricao AS descricao_da_atividade,
    tbl_atividades.status_resposta AS status_da_resposta,
    tbl_atividades.data_resposta AS data_da_resposta,
    tbl_sub_assuntos.id AS id_do_sub_assunto,
    tbl_sub_assuntos.nome AS nome_do_sub_assunto,
    tbl_assuntos.id AS id_do_assunto,
    tbl_assuntos.nome AS nome_do_assunto,
    tbl_assuntos.cor AS cor_do_assunto,
    tbl_materias.id AS id_da_materia,
    tbl_materias.imagem_materia AS imagem_da_materia,
    tbl_materias.nome_materia AS nome_da_materia,
    tbl_series.id AS id_da_serie,
    tbl_series.nome AS nome_da_serie
FROM 
    tbl_atividades
JOIN 
    tbl_sub_assuntos ON tbl_atividades.sub_assunto_id = tbl_sub_assuntos.id
JOIN 
    tbl_assuntos ON tbl_sub_assuntos.assunto_id = tbl_assuntos.id
JOIN 
    tbl_materias ON tbl_assuntos.materia_id = tbl_materias.id
JOIN 
    tbl_series ON tbl_assuntos.serie_id = tbl_series.id
WHERE 
    tbl_materias.id = ${materiaId}
    AND tbl_series.id = ${serieId};
        `;
        
        let atividades = await prisma.$queryRawUnsafe(sql);

        console.log(atividades);
        
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
