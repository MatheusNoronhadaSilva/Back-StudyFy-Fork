/*******************************************************
 * DATA: 17/11/2024
 * Autor: Matheus Noronha
 * Versão: 1.0
*******************************************************/

const message = require('./modulo/config.js');
const cadernoVirtualDAO = require('../model/cadernoVirtual.js');

// Função para inserir uma nova sala
const setInserirNovaNota = async function (dadosNota, contentType) {
    try {
        if (String(contentType).toLowerCase() !== 'application/json') {
            return message.ERROR_CONTENT_TYPE;
        }

        console.log(dadosNota);
        

        // Inserir sala no banco de dados
        const novaNota = await cadernoVirtualDAO.InsertNovaNota(dadosNota);
        if (novaNota) {

            return {
                nota: dadosNota,
                status_code: message.SUCCESS_CREATED_ITEM.status_code,
                message: message.SUCCESS_CREATED_ITEM.message
            };
        } else {
            return message.ERROR_INTERNAL_SERVER_DB;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

const getNotasAluno = async function(idAluno) {
    try {
        let notas = await cadernoVirtualDAO.getNotasByAluno(idAluno);

        if (notas.length > 0) {
            return {
                status_code: message.SUCCESS_REQUEST.status_code,
                message: message.SUCCESS_REQUEST.message,
                data: notas,
            };
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

const deleteNota = async function(idAluno, idNota) {
    try {
        let resultado = await cadernoVirtualDAO.deleteNota(idAluno, idNota);

        if (resultado) {
            return message.SUCCESS_DELETED_ITEM;
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

const updateNota = async function(idAluno, idNota, dadosNota) {
    try {
        let resultado = await cadernoVirtualDAO.updateNota(idAluno, idNota, dadosNota);

        if (resultado) {
            return message.SUCCESS_UPDATED_ITEM;
        } else {
            return message.ERROR_NOT_FOUND;
        }
    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER;
    }
};

module.exports = {
    updateNota,
    deleteNota,
    getNotasAluno,
    setInserirNovaNota,
};
