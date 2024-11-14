/*******************************************************
 * DATA: 05/09/2024
 * Autor: Ricardo Borges
 * Versão: 2.0
*******************************************************/

// Importa as mensagens e os DAOs
const membrosDAO = require ('../model/membros.js')
const message = require('./modulo/config.js');


const getListarMembros = async function() {
    try {
        // Criar o objeto JSON
        let membrosJSON = {};
        
        // Chamar a função do DAO para retornar os dados da tabela de produtos
        
        let dadosMembros = await membrosDAO.selectAllMembros();

        // Validação para verificar se existem dados 
        if (dadosMembros) {
            // Criar o JSON para devolver para o APP
            membrosJSON.membros = dadosMembros;
            membrosJSON.quantidade = dadosMembros.length;
            membrosJSON.status_code = 200;
            return membrosJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        } 
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
}

const getBuscarMembroId = async function(id) {
    try {
        let idMembros = id;
        let grupoMembrosJSON = {};

        if (idMembros === '' || idMembros === undefined || isNaN(idMembros)) {
            return message.ERROR_INVALID_ID; // 400
        } else {
            let dadosMembros = await membrosDAO.selectByIdMembro(idMembros);
            if (dadosMembros) {
                if (dadosMembros.length > 0) {
                    grupoMembrosJSON.grupo = dadosMembros;
                    grupoMembrosJSON.status_code = 200;
                    return grupoMembrosJSON;
                } else {
                    return message.ERROR_NOT_FOUND; // 404
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB; // 500
            }
        }
    } catch (error) {
        console.log(error);
        
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

const getListarMembrosMentores = async function() {
    try {
        // Criar o objeto JSON
        let membrosMentoresJSON = {};
        
        // Chamar a função do DAO para retornar os dados da tabela de produtos
        
        let dadosMembrosMentores = await membrosDAO.selectMembrosMentores();

        // Validação para verificar se existem dados 
        if (dadosMembrosMentores) {
            // Criar o JSON para devolver para o APP
            membrosMentoresJSON.membros = dadosMembrosMentores;
            membrosMentoresJSON.quantidade = dadosMembrosMentores.length;
            membrosMentoresJSON.status_code = 200;
            return membrosMentoresJSON;
        } else {
            return message.ERROR_NOT_FOUND;
        } 
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
}

const setInserirAlunoAoGrupo = async function(dadosBody, contentType) {
    try {

        if (String(contentType).toLowerCase() == 'application/json') {

                    // Validação dos dados
        if (dadosBody == null) {
            return {
                status_code: 400,
                message: message.ERROR_MISSING_DATA, // Mensagem de erro se os dados estão faltando
            };
        }

        // Chama a função no DAO para adicionar o aluno ao grupo
        const resultado = await membrosDAO.adicionarAlunoAoGrupo(dadosBody.alunoId, dadosBody.grupoId);

        if (resultado) {
            return {
                status_code: 201,
                message: message.SUCCESS_ADDED_TO_GROUP, // Mensagem de sucesso
                membro: resultado, // Dados do membro que foi adicionado
            };
        } else {
            return {
                status_code: 500,
                message: message.ERROR_INTERNAL_SERVER_DB, // Erro ao interagir com o banco de dados
            };
        }

        } 
    } catch (error) {
        console.error('Erro ao adicionar aluno ao grupo:', error);
        return {
            status_code: 500,
            message: message.ERROR_INTERNAL_SERVER, // Erro genérico do servidor
        };
    }
};

//adicionar

async function setRemoverMembroGrupo(dadosBody, contentType) {
    try {
        if (contentType !== 'application/json') {
            return { status_code: 400, message: 'Content-Type inválido. Esperado: application/json' };
        }
        
        const aluno_id = dadosBody.alunoId;
        const grupo_mentoria_id = dadosBody.grupoId

        console.log(aluno_id);
        
        // Validação dos dados recebidos
        if (!aluno_id || !grupo_mentoria_id) {
            return { status_code: 400, message: 'Dados incompletos. ID do aluno e ID do grupo de mentoria são necessários.' };
        }

        // Encaminha para o model remover no banco de dados
        const result = await membrosDAO.deletarMembroGrupo(aluno_id, grupo_mentoria_id);
        
        return result;
    } catch (error) {
        console.error('Erro no controller ao remover membro do grupo de mentoria:', error);
        return { status_code: 500, message: 'Erro interno no servidor' };
    }
}


module.exports = {
    setRemoverMembroGrupo,
    setInserirAlunoAoGrupo,
    getListarMembros,
    getBuscarMembroId,
    getListarMembrosMentores
};

