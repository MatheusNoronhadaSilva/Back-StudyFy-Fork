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

module.exports = {
    selectSeries
}