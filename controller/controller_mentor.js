/*******************************************************
 * DATA: 05/09/2024
 * Autor: Ricardo Borges
 * Versão: 2.0
*******************************************************/

// Importa as mensagens e os DAOs
const mentorDAO = require('../model/mentor.js');
const message = require('./modulo/config.js');

// Função para formatar a data
function formatarData(data) {
    if (!data) return null; // Se data for falsy, retorna null

    // Verifica se data é um objeto Date
    if (data instanceof Date) {
        return data.toISOString().split('T')[0]; // Converte para string no formato ISO
    }

    // Se data for uma string, continua o processamento
    if (typeof data === 'string') {
        const partes = data.split('T')[0]; // Separa a data da hora
        return partes; // Retorna apenas a parte da data
    }

    return null; // Se não for string nem objeto Date, retorna null
}

// Função para listar todos os mentores
const getListarMentores = async function () {
    try {
        // Criar o objeto JSON
        let mentoresJSON = {};

        // Chamar a função do DAO para retornar os dados da tabela de mentores
        let dadosMentor = await mentorDAO.selectAllMentores();

        // Validação para verificar se existem dados 
        if (dadosMentor) {
            // Formatar as datas de nascimento dos mentores, se aplicável
            dadosMentor.forEach(mentor => {
                if (mentor.data_ingresso) {
                    mentor.data_ingresso = formatarData(mentor.data_ingresso);
                }
            });

            // Criar o JSON para devolver para o APP
            mentoresJSON.mentores = dadosMentor;
            mentoresJSON.quantidade = dadosMentor.length;
            mentoresJSON.status_code = 200;
            return mentoresJSON;

        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
}

const setInserirNovoMentor = async function (dadosMentor, contentType) {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let mentorJSON = {};
            console.log(dadosMentor);
            

            // Validação de campos (omitida por brevidade)

            // Cria o mentor
            const mentorCriado = await mentorDAO.insertMentor();
            console.log(mentorCriado);

            if (mentorCriado) {
                const mentorId = await mentorDAO.lastIDMentor();  // ID do mentor inserido

                console.log(mentorId);
                
                if (mentorId) {
                    // Associar aluno ao mentor
                    const alunoAssociadoAMentor = await mentorDAO.adicionarAlunoAMentor(mentorId[0].id, dadosMentor.idUsuario);

                    if (!alunoAssociadoAMentor) {
                        return { status: 500, status_code: 500, message: 'Erro interno ao associar aluno ao mentor' };  // 500
                    }

                    mentorJSON.mentorCriado = mentorId[0].id;
                    mentorJSON.status = 201;
                    mentorJSON.status_code = 201;
                    mentorJSON.message = 'Mentor criado e aluno associado com sucesso!';

                    return mentorJSON; // 201
                } else {
                    return { status: 500, status_code: 500, message: 'Erro ao pegar LastIdMentor' };  // 500
                }
            } else {
                return { status: 500, status_code: 500, message: 'Erro interno ao criar mentor' };  // 500
            }
        } else {
            return { status: 415, status_code: 415, message: 'Tipo de conteúdo não suportado' };  // 415
        }
    } catch (error) {
        return { status: 500, status_code: 500, message: 'Erro ao processar a requisição' };  // 500
    }
};

const setRemoverMentor = async function (idMentor) {
    try {

        console.log(idMentor);
        
        // Verifica se o ID é válido
        if (!idMentor || isNaN(idMentor)) {
            return message.ERROR_INVALID_ID; // 400
        }

        // Realiza a remoção do mentor
        let resultado = await mentorDAO.removerMentor(idMentor);

        console.log(resultado);
        

        if (resultado) {
            return {
                status: message.SUCCESS_DELETED_ITEM.status,
                status_code: message.SUCCESS_DELETED_ITEM.status_code,
                message: 'Mentor removido com sucesso.',
            }; // 200
        } else {
            return message.ERROR_INTERNAL_SERVER_DB; // 500
        }
    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500
    }
};

module.exports = {
    setRemoverMentor,
    setInserirNovoMentor,
    getListarMentores,
    formatarData
};
