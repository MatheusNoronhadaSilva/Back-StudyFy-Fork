/*******************************************************
 * DATA: 05/09/2024
 * Autor: Ricardo Borges
 * Versão: 1.0
*******************************************************/

// Importa a biblioteca do @prisma/client
const { PrismaClient } = require('@prisma/client');

// Instância da classe PrismaClient
const prisma = new PrismaClient();

// Função para inserir nova atividade
const InsertNovaNota = async function(dadosNota) {
    try {
        let sql = `INSERT INTO caderno_virtual (conteudo, id_aluno) 
VALUES 
    ('${dadosNota.conteudo}', ${dadosNota.alunoId});`;

    console.log(sql);
    
        let resultado = await prisma.$executeRawUnsafe(sql);

        return resultado;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const getNotasByAluno = async function(idAluno) {
    try {
        let resultado = await prisma.$queryRawUnsafe(`
            SELECT id, conteudo, DATE_FORMAT(data_criacao, '%Y-%m-%d') AS data_criacao 
            FROM caderno_virtual
            WHERE id_aluno = ${idAluno};
        `);
        return resultado;
    } catch (error) {
        console.log(error);
        return [];
    }
};

const deleteNota = async function(idAluno, idNota) {
    try {
        let resultado = await prisma.$executeRawUnsafe(`
            DELETE FROM caderno_virtual 
            WHERE id_aluno = ${idAluno} AND id = ${idNota};
        `);
        return resultado > 0;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const updateNota = async function(idAluno, idNota, dadosNota) {
    try {
        let sql = `
            UPDATE caderno_virtual 
            SET conteudo = '${dadosNota.conteudo}'
            WHERE id_aluno = ${idAluno} AND id = ${idNota};
        `;

        let resultado = await prisma.$executeRawUnsafe(sql);
        return resultado > 0;
    } catch (error) {
        console.log(error);
        return false;
    }
};


module.exports = {
    updateNota,
    deleteNota,
    getNotasByAluno,
    InsertNovaNota,
};
