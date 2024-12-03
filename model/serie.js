/*******************************************************
 * DATA: 26/11/2024
 * Autor: Matheus Noronha
 * Versão: 1.0
*******************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const selectSeries = async function () {
    try {
        return await prisma.$queryRaw`SELECT * FROM tbl_series`;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const selectSerieAluno = async function (idAluno) {
    try {
        return await prisma.$queryRaw`select tbl_series.id, tbl_series.nome from tbl_alunos join tbl_series on tbl_alunos.serie_id = tbl_series.id where tbl_alunos.id = ${idAluno};
;
`;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = {
    selectSeries,
    selectSerieAluno
}