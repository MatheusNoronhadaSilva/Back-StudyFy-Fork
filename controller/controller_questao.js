/*******************************************************
 * DATA: 05/09/2024
 * Autor: Ricardo Borges
 * Versão: 1.0
*******************************************************/

// Importa as mensagens e o DAO
const message = require('./modulo/config.js');
const questaoDAO = require('../model/questao.js');

// Função para listar todas as questões
const getListarQuestoes = async function() {
    try {
        let questoes = await questaoDAO.selectAllQuestoes();
        if (questoes) {
            return { questoes, status_code: 200 };
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

// Função para listar todas as questões
const getListarTudoQuestao = async function() {
    try {
        let questoes = await questaoDAO.SelectGeralQuestao();
        if (questoes) {
            return { questoes, status_code: 200 };
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

// Função para buscar questão por ID
const getBuscarQuestaoId = async function(id) {
    try {
        let dadosQuestao = await questaoDAO.selectQuestaoByID(id);
        if (dadosQuestao.length > 0) {
            return { questao: dadosQuestao, status_code: 200 };
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

// Função para inserir nova questão
const setInserirNovaQuestao = async function(dadosQuestao, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let novaQuestao = await questaoDAO.insertQuestao(dadosQuestao);
            if (novaQuestao) {
                return { questao: dadosQuestao, status: message.SUCCESS_CREATED_ITEM.status, status_code: message.SUCCESS_CREATED_ITEM.status_code };
            } else {
                return message.ERROR_INTERNAL_SERVER_DB;
            }
        } else {
            return message.ERROR_CONTENT_TYPE;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

// Função para atualizar questão
const setAtualizarQuestao = async function(id, dadosQuestao, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let updatedQuestao = await questaoDAO.updateQuestao(id, dadosQuestao);
            if (updatedQuestao) {
                return { questao: dadosQuestao, status: message.SUCCESS_UPDATED_ITEM.status, status_code: message.SUCCESS_UPDATED_ITEM.status_code };
            } else {
                return message.ERROR_INTERNAL_SERVER_DB;
            }
        } else {
            return message.ERROR_CONTENT_TYPE;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

// Função para excluir questão
const setExcluirQuestao = async function(id) {
    try {
        let questaoDeletada = await questaoDAO.deleteQuestao(id);
        if (questaoDeletada) {
            return message.SUCCESS_DELETED_ITEM;
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

const getBuscarQuestoesPorAtividade = async function(atividadeId) {
    try {
        let idAtividade = atividadeId;
        let questoesJSON = [];

        if (idAtividade === '' || idAtividade === undefined || isNaN(idAtividade)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
            let dadosQuestoes = await questaoDAO.selectQuestaoPorAtividade(idAtividade);
            if (dadosQuestoes && dadosQuestoes.length > 0) {
                // Para cada questão retornada
                console.log(dadosQuestoes);  
                
                for (let questao of dadosQuestoes) {
                    let respostas = await obterRespostasPorTipoQuestao(questao.questao_tipo_id, questao.questao_id);
                    
                    if (respostas) {
                        
                        questao.respostas = respostas;  // Junta as respostas com os dados da questão
                    }
                    questoesJSON.push(questao);  // Adiciona a questão com as respostas ao array final
                }
                
                return { questoes: questoesJSON, status_code: 200 };
            } else {
                return message.ERROR_NOT_FOUND; // 404
            }
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

// Função que chama a model dependendo do tipo de questão
const obterRespostasPorTipoQuestao = async function(tipoQuestaoId, questaoId) {

    console.log(tipoQuestaoId);
    
    switch (tipoQuestaoId) {
        case 1:
            return await questaoDAO.selectRespostasMultiplaEscolha(questaoId);
        case 2:
            return await questaoDAO.selectRespostasVerdadeiroFalso(questaoId);
        case 3:
            return await questaoDAO.selectRespostasLacunas(questaoId);
        case 4:
            return await questaoDAO.selectRespostasCorrespondencia(questaoId);
        default:
            return null;
    }
};

const getBuscarAtividades = async function(materiaId, serieId) {
    try {
        let atividadesJSON = {};

        // Chama o modelo para realizar o select no banco de dados
        let dadosAtividades = await questaoDAO.selectAtividadesByMateriaAndSerie(materiaId, serieId);

        if (dadosAtividades) {
            if (dadosAtividades.length > 0) {
                atividadesJSON.atividades = dadosAtividades;
                atividadesJSON.status_code = 200;
                return atividadesJSON;
            } else {
                return { status_code: 404, message: 'Nenhuma atividade encontrada para essa matéria e série' }; // 404
            }
        } else {
            return { status_code: 500, message: 'Erro ao buscar atividades no banco de dados' }; // 500
        }
    } catch (error) {
        console.error(error);
        return { status_code: 500, message: 'Erro interno do servidor' }; // 500
    }
};



// Exporta as funções
module.exports = {
    getBuscarQuestoesPorAtividade,
    getBuscarAtividades,
    getListarQuestoes,
    getBuscarQuestaoId,
    setInserirNovaQuestao,
    setAtualizarQuestao,
    setExcluirQuestao,
    getListarTudoQuestao
};
